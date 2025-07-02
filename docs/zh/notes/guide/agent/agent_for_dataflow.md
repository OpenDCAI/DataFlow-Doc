---
title: DataFlow-Agent接入
icon: material-symbols:robot-2-outline
createTime: 2025/06/25 15:56:00
permalink: /zh/guide/agent/agent_for_dataflow/
---

# DataFlow-Agent接入

## **如何接入新的算子？**

按照 Dataflow 的要求编写新的算子并成功运行后，如何在 Agent 中进行添加？

### 1.修改Operator文件

`/toolkits/resources/Operator.json`中记录着dataflow所有的**算子信息，启动指令，和描述。**

```json
    {
      "node": 1,
      "name": "QuestionGenerator",
      "type": "generator",
      "description": "基于现有的问题数据，每个问题合成1-5个新问题",
      "input": [
        { "instruction": "1+1=?", "output": "1+1=2." }
      ],
      "output": [
        { "instruction": "1+1=?", "output": "1+1=2.", "Synth_or_Input": "input" },
        { "instruction": "2+5=?", "output": null, "Synth_or_Input": "synth" }
      ],
      "command": "python ReasoningPipeline/code/QuestionGenerator.py --yaml_path ReasoningPipeline/yaml/QuestionGenerator.yaml",
      "required": true,
      "depends_on": []
    },
```

- 你可以将新算子加入现有的 pipeline，也可以新建专属 pipeline 来管理和整理这些算子。
- 字段 `depends_on: [2]` 表示该算子的执行依赖于节点 2 的结果，不能单独运行。
- `command` 字段必须配置正确，这是保证算子能够**顺利执行的入口**。

### 2.调用

修改完成后，Agent 就可以按照 Quickstart 的方式进行访问和使用了。

## 如何自定义任务和任务链？

现在的Dataflow-Agent任务链中包含：

- 意图分析
- 数据类型识别
- 算子筛选与pipeline推荐
- pipeline执行

每个任务都包含自己的tool。

### 1.定义任务

在`/agentrole/taskcenter/task_definitions.py`中**初始化任务，**

```python
@TaskRegistry.register('data_content_classification')
def _make_data_content_classification(prompts_template):
    return Task(
        config_path=f'{ancestor_dir}/TaskInfo.yaml',
        prompts_template=prompts_template,
        system_template="system_prompt_for_data_content_classification",
        task_template="task_prompt_for_data_content_classification",
        param_funcs={
            "local_tool_for_sample": local_tool_for_sample,
            "local_tool_for_get_categories": local_tool_for_get_categories
        },
        is_result_process=False,  #是否需要对结果进行后处理？
        use_pre_task_result = False, #是否需要使用前一个任务的结果？
        task_name= "data_content_classification"
    )
```

在`main`中获取对应任务：

```python
task1 = TaskRegistry.get('data_content_classification', prompts_template)
```

组转成任务链进行传递执行：

```python
task_chain = [router,task1]

service = AnalysisService(
    config_path='ChatAgentYaml.yaml',
    tasks=task_chain,
    memory_entity=memory,
    request=request
)
return await service.process_request()
```

### 2.书写prompts

根据定义的任务提示词在**`/promptstemplates/resources/template.json`**中书写，

比如**示例任务中：**

```json
{
	"system_prompt_for_data_content_classification":"You are a data content analysis expert. You can help me classify my sampled data content.",
	"task_prompt_for_data_content_classification"："Please categorize the sampled information below.\\n=====================================================\\n{local_tool_for_sample}\\n=====================================================\\nReturn a content classification result. These sampled contents can only belong to the following categories: {local_tool_for_get_categories}  \\nReturn the result in JSON format, for example:\\n\\n {{\\\"ContentSubType\\\": \\\"MIXTURE\\\"}}"
}
```

在**task_prompt_**中，`local_tool_for_sample`以及`local_tool_for_get_categories`都是工具执行的返回结果。

我们提供了一套书写的模板：

```
        """
        TEMPLATE =
                [ROLE] {role_definition}
                [TASK] {current_task}
                [INPUT] {content}
                [OUTPUT RULES]
                1. 仅回复JSON格式{expected_output}内容
                2. 禁止包含{prohibited_elements}
                [EXAMPLE] {demonstration}
        """
```

其中最重要的是 **[OUTPUT RULES]**。在整个 DataFlow-Agent 框架中，**多个 Agent 通过 JSON 格式进行交互**。因此，在提示词中需要明确要求返回**干净的 JSON 格式结果**。这个结果会被保存在下一个 Task 的 **`pre_task_result`** 中，而下一个任务的 Tool 可能会从 `pre_task_result` 中获取并处理结果。

### 3.定义工具

在 **data_content_classification** 任务中我们定义了两个工具，

- local_tool_for_sample
- local_tool_for_get_categories

其中具体的代码在：**`/toolkits/tools.py`**中

```python
def local_tool_for_sample(
    sample_size: int = 100,
    use_file_sys: int = 1,
    json_file: str = ""
) -> Dict[str, Any]:
```

其中如果需要Tool的传参，可以在**`/TaskInfo.yaml`**中进行配置，其中参数一一对应：

```yaml
data_content_classification:  #任务名
  local_tool_for_sample:      #任务的Tool名
    sample_size: 50
    use_file_sys: 1
    json_file: /data/json/pipeline_test_dirty_data.json
```

除此之外对于，如果需要用到**`request，memory，pre_task_result`**属于内置参数，不需要在配置文件中显式写出。

### 4.定义任务的参数传递

任务参数传递机制的核心目的是确保下一个任务的 Tool 能够从`pre_task_result`中**获取并处理**数据。尤其在涉及自定义复杂工具的场景下，由于任务参数高度依赖 LLM 的返回结果，为规避模型幻觉导致的参数异常，我们引入 debug-agent 进行严格的**Json 格式校验**。这一机制可确保 Tool 在运行过程中始终基于合法参数执行，**有效避免因格式错误引发的运行时问题。**

## DataFlow算子的prompt复用

- 若用户新增算子需调用 LLM 及自定义 Prompt，Dataflow-agent 已提供相应接口支持；
- 具体实现逻辑为：依据 operator_name（采用特殊 key 形式，支持通过单一 Prompt 适配多算子场景）、提示类型及语言参数，从`/promptstemplates/resources/operator_template.json`文件中提取对应模板，再通过关键字参数完成占位符替换，最终生成 Prompt 文本。若需添加统一答案后缀，可通过设置`add_suffix=True`开启该功能。

举例：

```json
{
  "text_cleaner": {
    "prompts": {
      "zh": {
        "system": "[ROLE] 你是文本清洗算子……",
        "task": "请对以下文本进行清洗：{text} -        ----  {{text}}"
      },
      "en": {
        "system": "[ROLE] You are a text-cleaning operator…",
        "task": "Please clean the text: {text}"
      }
    }
  },

  "html_sanitizer": {
    "prompts": {
      "zh": {
        "system": "[ROLE] 你是 HTML 清洗算子……",
        "task": "请对以下 HTML 进行清理：{html}"
      },
      "en": {
        "system": "[ROLE] You are an HTML sanitizing operator…",
        "task": "Sanitize the following HTML: {html}"
      }
    }
  }
}

```

当模板写入之后就可以同如下方式调用：

```python
from prompt_template import PromptsTemplateGenerator
g = PromptsTemplateGenerator(output_language="en")
html_code = """
<script>alert('xss')</script>
<div>Safe text</div>
"""
prompt = g.render_operator_prompt(
    operator_name="html_sanitizer",
    html=html_code  
)
print(prompt)
```

---



## 