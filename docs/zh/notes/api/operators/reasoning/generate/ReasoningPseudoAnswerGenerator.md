---
title: ReasoningPseudoAnswerGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/generate/reasoningpseudoanswergenerator/
---

## 📘 概述
[ReasoningPseudoAnswerGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个伪答案生成算子。它通过多次调用大语言模型（LLM）为同一个问题生成多个候选答案，然后通过投票（选择最频繁出现的答案）的方式确定最终答案。这种方法旨在提高答案的准确性和鲁棒性。

## `__init__`函数
```python
@prompt_restrict(
    MathAnswerGeneratorPrompt
)

@OPERATOR_REGISTRY.register()
class ReasoningPseudoAnswerGenerator(OperatorABC):
    '''
    Pseudo Answer Generator is a class that generates answers for given questions, then choose the most frequent answer.
    '''
    def __init__(self, llm_serving: LLMServingABC = None, max_times: int = 3):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行推理与生成。 |
| **max_times** | int | 3 | 对每个问题重复生成答案的最大次数，用于投票选出最频繁的答案。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
|MathAnswerGeneratorPrompt | 生成问题的答案 | 伪答案生成 | 输入问题，输出答案 |

## run函数
```python
def run(
    self,
    storage: DataFlowStorage,
    input_key: str = "instruction",
    output_key_answer: str = "pseudo_answers",
    output_key_answer_value: str = "pseudo_answer_value",
    output_key_solutions: str = "pseudo_solutions",
    output_key_correct_solution_example: str = "pseudo_correct_solution_example",
)
```
执行算子主逻辑，从存储中读取输入 DataFrame，多次调用 LLM 生成候选答案，通过投票选出最终答案，并将所有相关结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "instruction" | 输入列名，对应问题字段。 |
| **output_key_answer** | str | "pseudo_answers" | 输出列名，对应多次生成的所有候选答案列表。 |
| **output_key_answer_value** | str | "pseudo_answer_value" | 输出列名，对应投票选出的最终答案。 |
| **output_key_solutions** | str | "pseudo_solutions" | 输出列名，对应所有生成最终答案的推理过程列表。 |
| **output_key_correct_solution_example**| str |"pseudo_correct_solution_example"| 输出列名，对应一个生成最终答案的推理过程示例。|

## 🧠 示例用法
```python
from dataflow.operators.reasoning import ReasoningPseudoAnswerGenerator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC
from dataflow.serving import APILLMServing_request

class ReasoningPseudoAnswerGeneratorTest():
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
        
        self.operator = ReasoningPseudoAnswerGenerator(
            llm_serving = self.llm_serving,
            max_times = 3
        )
        
    def forward(self):
        self.operator.run(
            storage = self.storage.step(),
            input_key = "instruction",
            output_key_answer = "pseudo_answers",
            output_key_answer_value = "pseudo_answer_value",
            output_key_solutions = "pseudo_solutions",
            output_key_correct_solution_example = "pseudo_correct_solution_example",
        )

if __name__ == "__main__":
    pl = ReasoningPseudoAnswerGeneratorTest()
    pl.forward()
```
