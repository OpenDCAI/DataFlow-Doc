---
title: ReasoningQuestionFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/filter/reasoningquestionfilter/
---

## 📘 概述

[ReasoningQuestionFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/filter/reasoning_question_filter.py) 是一个问题过滤算子，用于对输入的问题进行正确性检查。它利用大语言模型（LLM）判断问题在格式、语义、逻辑以及信息充分性等方面是否合格，并只保留通过检查的合格问题。

## `__init__`函数

```python
@prompt_restrict(
    MathQuestionFilterPrompt, 
    GeneralQuestionFilterPrompt, 
    DiyQuestionFilterPrompt
)
@OPERATOR_REGISTRY.register()
class ReasoningQuestionFilter(OperatorABC):
    def __init__(self,
                 system_prompt: str = "You are a helpful assistant.",
                 llm_serving: LLMServingABC = None,
                 prompt_template = MathQuestionFilterPrompt | GeneralQuestionFilterPrompt | DiyQuestionFilterPrompt | DIYPromptABC
                 ):
```

### init参数说明

| 参数名            | 类型          | 默认值                                                                                           | 说明                                                                         |
| :---------------- | :------------ | :----------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **system\_prompt**  | str           | "You are a helpful assistant."                                                                   | 系统提示词，用于定义大语言模型的全局行为。                                         |
| **llm\_serving**    | LLMServingABC | 必需                                                                                             | 大语言模型服务实例，用于执行判断与推理。                                           |
| **prompt\_template**| PromptABC     | 默认支持MathQuestionFilterPrompt, GeneralQuestionFilterPrompt, DiyQuestionFilterPrompt或者集成DIYPromptABC自定义prompt | 提示词模板对象，用于构建发送给LLM的检查提示词。支持数学、通用与自定义模板。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :----------------------------- | :------- | :------- | :------- |
|     MathQuestionFilterPrompt        | 数学问题过滤 | 数学相关问题 | 检查问题是否符合数学格式，是否包含必要的计算步骤。 |  
|     GeneralQuestionFilterPrompt     | 通用问题过滤 | 非数学问题 | 检查问题是否符合一般语法规则，是否包含必要的信息。 |  
|     DiyQuestionFilterPrompt        | 自定义问题过滤 | 自定义问题类型 | 允许用户根据需求定义特定的问题过滤规则。 |  

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str = "math_problem")
```

执行算子主逻辑，从存储中读取输入 DataFrame，对指定列的问题进行过滤，并将过滤后的结果写回存储。

#### 参数

| 名称        | 类型            | 默认值           | 说明                               |
| :---------- | :-------------- | :--------------- | :--------------------------------- |
| **storage** | DataFlowStorage | 必需             | 数据流存储实例，负责读取与写入数据。 |
| **input\_key**  | str             | "math\_problem" | 输入列名，对应需要被过滤的问题字段。   |

## 🧠 示例用法
```python
from dataflow.operators.reasoning import ReasoningQuestionFilter
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC
from dataflow.serving import APILLMServing_request
from dataflow.prompts.reasoning.math import MathQuestionFilterPrompt

class ReasoningQuestionFilterTest():    
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        # use API server as LLM serving
        self.llm_serving = APILLMServing_request(
                    api_url="",
                    model_name="gpt-4o",
                    max_workers=30
        )
        
        self.operator = ReasoningQuestionFilter(
            system_prompt="You are a helpful assistant.",
            llm_serving=self.llm_serving,
            prompt_template=MathQuestionFilterPrompt()
            )   
        
    def forward(self):
        self.operator.run(
            storage = self.storage.step(),
            input_key="output"
        )

if __name__ == "__main__":
    pl = ReasoningQuestionFilterTest()
    pl.forward()
```

## 🧾 默认输出格式（Output Format）

该算子是一个过滤器，不会在输出中添加新列。它会返回一个与输入结构相同的 DataFrame，但只包含通过所有检查的问题行。

示例输入：

```json
{"math_problem":"What is 2+2?"}
{"math_problem":"Solve for x in the equation x/0 = 5."}
{"math_problem":"If a car travels at 60 mph, how long does it take to travel 120 miles?"}
```

示例输出（假设第二个问题因逻辑错误被过滤）：

```json
{"math_problem":"What is 2+2?"}
{"math_problem":"If a car travels at 60 mph, how long does it take to travel 120 miles?"}
```
