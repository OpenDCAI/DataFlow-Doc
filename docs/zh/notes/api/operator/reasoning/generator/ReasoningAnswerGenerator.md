---
title: ReasoningAnswerGenerator
createTime: 2025/10/09 11:01:59
permalink: /zh/api/u4zfvr4i/
---

## 📘 概述
[ReasoningAnswerGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个推理型答案生成算子，用于根据输入问题自动构建提示词（prompt）并调用大语言模型（LLM）生成推理式答案。
该算子可与多种 Prompt 模板（数学、通用、DIY）和 LLM 服务模块配合使用，实现自动化的问答生成流程。

## __init__函数
```python
@prompt_restrict(
    MathAnswerGeneratorPrompt,
    GeneralAnswerGeneratorPrompt,
    DiyAnswerGeneratorPrompt
)
@OPERATOR_REGISTRY.register()
class ReasoningAnswerGenerator(OperatorABC):
    '''
    Answer Generator is a class that generates answers for given questions.
    '''
    def __init__(self,
                llm_serving: LLMServingABC,
                prompt_template = MathAnswerGeneratorPrompt | GeneralAnswerGeneratorPrompt | DiyAnswerGeneratorPrompt | DIYPromptABC
                ):
```
### init参数说明
| 参数名                 | 类型              | 默认值                           | 说明                              |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving**     | `LLMServingABC` | 必需                            | 大语言模型服务实例，用于执行推理与生成。            |
| **prompt_template** | `PromptABC`     | 默认支持`MathAnswerGeneratorPrompt, GeneralAnswerGeneratorPrompt, DiyAnswerGeneratorPrompt`或者集成`DIYPromptABC`自定义prompt | 提示词模板对象，用于构建问题输入。支持数学、通用与自定义模板。 |

### Prompt模板说明
| Prompt 模板名称                      | 主要用途          | 适用场景                    | 特点说明                                                  |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| **MathAnswerGeneratorPrompt**    | 生成数学类问题的推理与答案 | 数学题解、公式推导、定理证明、计算类问题    | 内置数学专用模板，强调逻辑推理与公式展示，支持逐步解题结构（Step-by-step reasoning） |
| **GeneralAnswerGeneratorPrompt** | 生成通用推理类答案     | 日常推理、阅读理解、常识问答、分析型问题    | 模板通用性强，支持多领域的逻辑推理与解释生成，语义自然流畅                         |
| **DiyAnswerGeneratorPrompt**     | 用户自定义推理模板     | 用户希望自行控制 Prompt 结构或生成风格 | 支持用户输入自定义提示词与规则，最大化灵活性与可控性，可与系统参数组合使用                 |

## run函数
```python
def run(storage, input_key="instruction", output_key="generated_cot")
```

执行算子主逻辑，从存储中读取输入 DataFrame，生成 LLM 基于prompt的推理结果，并将结果写回存储。

#### 参数

| 名称             | 类型                | 默认值               | 说明                 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage**    | `DataFlowStorage` | 必需                | 数据流存储实例，负责读取与写入数据。 |
| **input_key**  | `str`             | `"instruction"`   | 输入列名，对应问题字段。       |
| **output_key** | `str`             | `"generated_cot"` | 输出列名，对应生成答案字段。     |

## 🧠 示例用法

```python
from dataflow.operators.reasoning import ReasoningAnswerGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC
from dataflow.prompts.reasoning.general import GeneralAnswerGeneratorPrompt

class ReasoningAnswerGeneratorTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="test_step3.jsonl",
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
        
        self.answer_generator = ReasoningAnswerGenerator(
            llm_serving=self.llm_serving,
            prompt_template=GeneralAnswerGeneratorPrompt()
        )
        
    def forward(self):
        self.answer_generator.run(
            storage = self.storage.step(),
            input_key = "instruction", 
            output_key = "generated_cot"
        )

if __name__ == "__main__":
    pl = ReasoningAnswerGeneratorTest()
    pl.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段              | 类型    | 说明          |
| :-------------- | :---- | :---------- |
| `instruction`   | `str` | 输入的问题文本。    |
| `generated_cot` | `str` | 模型生成的推理式答案。 |

示例输入：

```json
{
"instruction":"A triangle has sides of lengths 7, 24, and 25. Determine if it is a right triangle."
}
```
示例输出：

```json
{
"instruction":"A triangle has sides of lengths 7, 24, and 25. Determine if it is a right triangle.",
"generated_cot":"Solution:\n1. Identify key components and premises of the task\n→ Sides of the triangle are 7, 24, and 25.\n\n2. Apply relevant principles, theorems, or methods with step-by-step derivation or argument\n→ Use the Pythagorean theorem for a right triangle: a^2 + b^2 = c^2.\n→ Assume 25 is the hypotenuse (largest side), then check: 7^2 + 24^2 = 25^2.\n\n3. Perform any necessary calculations or logical checks with intermediate verification\n→ Calculate 7^2: 7^2 = 49.\n→ Calculate 24^2: 24^2 = 576.\n→ Calculate 25^2: 25^2 = 625.\n→ Verify: 49 + 576 = 625.\n\n4. Present the final answer or conclusion in a clear, unambiguous notation\n→ Since 7^2 + 24^2 = 25^2 holds true, the triangle is a right triangle.\n→ The triangle is a right triangle: \\\\boxed{\\text{Yes}}."
}
```
