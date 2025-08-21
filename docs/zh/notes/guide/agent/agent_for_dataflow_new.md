---
title: DataFlow-Agent
icon: material-symbols:robot-2-outline
createTime: 2025/06/25 15:56:00
permalink: /zh/guide/agent/agent_for_dataflow_new/
---

## DataFlow-Agent概述

DataFlow-Agent 是一个多智能体协作的自动化任务处理系统，流程包括任务分解、工具注册、任务调度、执行验证与报告生成，适用于数据治理和自动分析等多步骤场景。

🛠️ **自动数据治理 Pipeline 编排**：一键生成+调试数据治理流程，实现治理管线自动化；

⚡ **自动算子编写**：支持全自动生成、注册与调用数据处理算子，无需手动编写代码；

🔗 **自定义任务链，灵活流程定义**：用户可按需自由组合任务节点，打造专属的数据治理流程；

## DataFlow-Agent核心功能

### NL2Pipeline

**功能描述：**

- 通过多轮对话，Agent能够逐步了解用户的真实意图，并判断是否需要进一步为数据推荐治理管线。
- 在完成推荐后，用户可以选择是否自动执行管线。框架支持自动调试管线，并能够在出现报错时自动进行修复。

**主要特性：**

- 支持一键执行；
- 自驱动调试与自愈，直到达到重试上限；

**使用示例：**

```shell
export DF_API_KEY=sk-
export DF_API_URL=https://api.

dataflow init
cd dataflow_agent
python run_dataflow_agent_with_console.py recommend
```

用户可以自定义参数：

```python
    pipeline_recommand_params = {
        "json_file": f"{DATAFLOW_DIR}/dataflow/example/ReasoningPipeline/pipeline_math_short.json",
        "py_path": f"{DATAFLOW_DIR}/test/recommend_pipeline.py",
        "api_key": api_key,
        "chat_api_url": chat_api_url,
        "execute_the_pipeline": False,
        "use_local_model": True,
        "local_model_name_or_path": "/mnt/public/model/huggingface/Qwen2.5-7B-Instruct",
        "timeout": 3600,
        "max_debug_round": 5
    }
    
    if len(sys.argv) == 2 and sys.argv[1] == "recommend":
        test_req = ChatAgentRequest(
            language="zh",
            target="帮我针对数据推荐一个的pipeline!!!不需要去重的算子 ！",
            model="deepseek-v3",
            sessionKEY="dataflow_demo",
            **pipeline_recommand_params
        )
```

**参数解释：**

| 参数名                   | 类型 | 含义                                                         |
| :------------------------ | :---- | :------------------------------------------------------------ |
| json_file                | str  | 待处理**数据**的 JSON/JSONL 文件路径。                       |
| py_path                  | str  | 用于保存**生成管线代码的文件路径。**                         |
| api_key                  | str  | 用于与后端 LLM 服务或第三方服务通信的 API Key。              |
| chat_api_url             | str  | 用于与 LLM 服务通信的 API 地址。                             |
| execute_the_pipeline     | bool | 是否要实际执行推荐出来的管线。**False 表示只推荐，不执行。** |
| use_local_model          | bool | 是否使用本地模型推理（True 代表不用远端 LLM，而用本地 Huggingface 模型）。 |
| local_model_name_or_path | str  | 本地模型的名称或路径（这里是 Qwen2.5-7B-Instruct 的本地路径）。 |
| timeout                  | int  | 执行超时时长（秒），如 3600 秒 = 1 小时。                    |
| max_debug_round          | int  | 最大 debug 轮数，**执行和调试 pipeline 时最多允许多少轮调试尝试。** |
| language                 | str  | 会话或请求所使用的语言（如 `"zh"` 表示中文，`"en"` 表示英文）。 |
| target                   | str  | 用户希望 Agent 完成的具体任务描述，即用户的需求或指令。      |
| model                    | str  | 指定用于处理请求的模型名称（如 `"deepseek-v3"`），决定底层用哪个大模型进行推理。 |
| sessionKEY               | str  | 当前会话的唯一标识，用于追踪和区分不同用户或任务的上下文（如 `"dataflow_demo"`）。 |

### NL2Operator

**功能描述：**

- 通过多轮对话，Agent能够逐步了解用户的真实意图，并判断是否需要进一步编写符合DataFlow风格的算子。
- 在完成编写后，用户可以选择是否单独测试算子的功能。框架支持自动调试管线和算子，并能够在出现报错时自动进行修复。

**主要特性：**

- 支持算子单独测试；
- 自驱动调试与自愈，直到达到重试上限；

**使用示例：**

```shell
export DF_API_KEY=sk-
export DF_API_URL=https://api.

dataflow init
cd dataflow_agent
python run_dataflow_agent_with_console.py write
```

用户可以自定义参数：

```python
    operator_write_params = {
        "json_file": f"{DATAFLOW_DIR}/dataflow/example/ReasoningPipeline/pipeline_math_short.json",
        "py_path": f"{DATAFLOW_DIR}/test/operator_transEN.py",
        "api_key": api_key,
        "chat_api_url": chat_api_url,
        "execute_the_operator": False,
        "use_local_model": True,
        "local_model_name_or_path": "/mnt/public/model/huggingface/Qwen2.5-7B-Instruct",
        "timeout": 3600,
        "max_debug_round": 5
    }
    
    if len(sys.argv) == 2 and sys.argv[1] == "write":
        test_req = ChatAgentRequest(
            language="zh",
            target="我需要一个算子，直接使用llm_serving，实现语言翻译，把英文翻译成中文！",
            model="deepseek-v3",
            sessionKEY="dataflow_demo",
            ** operator_write_params
        )
```

**参数解释：**

| 参数名                   | 类型 | 含义                                                         |
| :------------------------ | :---- | :------------------------------------------------------------ |
| json_file                | str  | 待处理**数据**的 JSON/JSONL 文件路径。                       |
| py_path                  | str  | 用于保存**生成算子代码的文件路径。**                         |
| api_key                  | str  | 用于与后端 LLM 服务或第三方服务通信的 API Key。              |
| chat_api_url             | str  | 用于与 LLM 服务通信的 API 地址。                             |
| execute_the_operator     | bool | 是否要实际执行生成的算子。**False 表示只生成代码，不执行。** |
| use_local_model          | bool | 是否使用本地模型推理（True 代表不用远端 LLM，而用本地 Huggingface 模型）。 |
| local_model_name_or_path | str  | 本地模型的名称或路径（如 Qwen2.5-7B-Instruct 的本地路径）。  |
| timeout                  | int  | 执行超时时长（秒），如 3600 秒 = 1 小时。                    |
| max_debug_round          | int  | 最大 debug 轮数，执行和调试算子时最多允许多少轮调试尝试。    |
| language                 | str  | 会话或请求所使用的语言（如 `"zh"` 表示中文，`"en"` 表示英文）。 |
| target                   | str  | 用户希望 Agent 完成的具体任务描述，即用户的需求或指令。      |
| model                    | str  | 指定用于处理请求的模型名称（如 `"deepseek-v3"`），决定底层用哪个大模型进行推理。 |
| sessionKEY               | str  | 当前会话的唯一标识，用于追踪和区分不同用户或任务的上下文（如 `"dataflow_demo"`）。 |

## 任务链设置

在 DataFlow-Agent 框架下，为了让用户能够更加稳定、高效地使用算子编排与算子编写功能，我们预设了 7 个核心任务。

| 任务名              | 主要功能说明                                                 | 主要工具                                                     |
| :------------------- | :------------------------------------------------------------ | :----------------------------------------------------------- |
| router:railway_car: | 对话路由：分析并判断用户当前对话意图，将请求分配到合适的处理流程。 | `local_tool_for_get_chat_history`：获取对话历史              |
|                     |                                                              | `local_tool_for_get_chat_target`：获取用户的目标             |
| classify:cake:      | 数据内容分类：识别和分类用户输入的数据内容类型。             | `local_tool_for_sample`：采样数据                            |
|                     |                                                              | `local_tool_for_get_categories`：分类数据                    |
| rec:radio:          | 推荐推理管线：根据分类结果和用户需求，推荐合适的数据处理管线。 | `local_tool_for_sample`：采样数据                            |
|                     |                                                              | `local_tool_for_get_operator_content_map_from_all_operators`：算子映射，找到可用的算子 |
|                     |                                                              | `local_tool_for_get_purpose`：获取用户的意图                 |
| exe:earth_africa:   | 执行推荐管线：执行推荐的数据处理管线并返回结果。             | `local_tool_for_execute_the_recommended_pipeline`：执行与调试推荐的管线 |
| op_match:ocean:     | 匹配算子：根据用户需求，匹配已有的算子（功能组件）。         | `local_tool_for_get_operator_content`：获取算子信息          |
| op_write:octopus:   | 编写算子：参考匹配算子，自动生成符合需求的新算子代码。       | `local_tool_for_get_match_operator_code`：获取算子源码       |
|                     |                                                              | `local_tool_for_get_purpose`：获取用户的意图                 |
| op_debug:on:        | 调试算子：自动化执行和调试算子，发现并修复潜在问题。         | `local_tool_for_debug_and_exe_operator`：执行与调试算子      |

## 如何自定义任务

DataFlow-Agent框架支持自定义任务，如果你觉得预设任务无法满足你的需求，你可以自定义任务链，我们以**`op_match`**为例：

### 1.注册任务

在`/agentrole/taskcenter/task_definitions.py`中**初始化任务**

```python
@TaskRegistry.register('match_operator')
def _make_match_operator(prompts_template,request):
    return Task(
        request           = request,
        config_path       = f"{yaml_dir}/TaskInfo.yaml",  
        prompts_template  = prompts_template,
        system_template   = "system_prompt_for_match_operator",
        task_template     = "task_prompt_for_match_operator",
        param_funcs       = {
            "get_operator_content": local_tool_for_get_operator_content
        },
        is_result_process = False,   
        use_pre_task_result = False, 
        task_name         = "match_operator"
    )
```

| 参数名              | 类型   | 含义                                                         |
| :------------------- | :------ | :------------------------------------------------------------ |
| request             | object | 当前的请求对象，包含用户输入、上下文等信息。                 |
| config_path         | str    | 配置文件路径，**指定任务所需的 YAML 配置文件位置。**         |
| prompts_template    | object | 提示词模板对象，用于生成系统和任务相关的 prompt。            |
| system_template     | str    | 系统提示词模板名称，用于指定系统级 prompt 的模板。           |
| task_template       | str    | 任务提示词模板名称，用于指定当前任务的 prompt 模板。         |
| param_funcs         | dict   | 工具函数字典，提供任务执行时所需的参数处理函数。此处为 `{ "get_operator_content": local_tool_for_get_operator_content }`，**用于获取可用算子内容。** |
| is_result_process   | bool   | 是否需要对任务结果进行后处理。`False` 表示不需要。           |
| use_pre_task_result | bool   | 是否使用前序任务的结果作为输入。`False` 表示不使用。         |
| task_name           | str    | 任务名称，此处为 `"match_operator"`。                        |

定义完成之后可以通过获取**任务实例：**

```python
op_match = TaskRegistry.get("match_operator",prompts_template=tmpl, request = req)
```

### 2.工具编写

在上述的 **`param_funcs`** 中，我们定义了任务所需使用的工具，这些工具均为我们自主实现，因此统一以 **local_tool_** 作为命名前缀。每个任务工具函数默认可接收三个参数，以及额外的自定义参数。

**默认参数包括：**

| 参数名                      | 类型   | 说明                                                         |
| :--------------------------- |:------ | :------------------------------------------------------------ |
| request:rainbow:            | object | 当前任务的请求对象，**包含用户输入及上下文参数。**           |
| pre_task_result:panda_face: | any    | 前序任务的结果，**便于任务之间的数据流转。**                 |
| memory:melon:               | any    | 任务执行过程中的临时存储或共享内存，**其中存储了全部的对话历史以及任务结果信息。** |

**额外自定义参数：**在配置文件`DataFlow/dataflow/agent/taskcenter/resources/TaskInfo.yaml`中，我们可以定义任务额外细节，尤其是工具的需要的额外参数：

```yaml
match_operator:
  tools:
  	local_tool_for_get_operator_content:
      data_key: 
        ContentSubType: MIXTURE
      keep_keys: [name, type, description]
```

### 3.提示词编写

根据定义的任务提示词在**`/promptstemplates/resources/template.json`**中书写，比如**示例任务中：**

```json
{
    "system_prompt_for_match_operator": "You must strictly follow the user's requirements. Based on the operator content and intended use provided, select the Four most similar operator names from the operator library and output the results only in the specified JSON format. Do not output any extra content, comments, or additional keys. Regardless of whether there is an exact match, you must output two operator names.",
    "task_prompt_for_match_operator": "[ROLE] You are an expert in data operator retrieval. [TASK] Based on the provided operator content {get_operator_content} and user requirement {purpose}, find the Four most similar operator names from the operator library and provide your reasoning. [INPUT FORMAT] The input includes: - Operator content (get_operator_content) - User requirement (purpose). [OUTPUT RULES] 1. Strictly return the content in the JSON structure shown below. Do not include any extra content, comments, or new keys. 2. You must output two operator names under all circumstances. JSON output example: { \"match_operators\": [ \"OperatorName1\", \"OperatorName2\", \"OperatorName3\", \"OperatorName4\" ], \"reason\": xxx }"
}
```
:bangbang:尤其需要注意的是，我们要明确规定任务之间的交互格式，即每个任务返回的 JSON 数据中各字段（key）的命名和含义。这不仅有助于上下游任务准确解析和利用结果，也保证了整个任务链的稳定性和可扩展性。
