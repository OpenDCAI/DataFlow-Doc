---
title: ReasoningAnswerExtractionQwenMathEvalGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/generate/reasoninganswerextractionqwenmathevalgenerator/
---

## 📘 概述
[ReasoningAnswerExtractionQwenMathEvalGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 该算子用于从数学问题回答中提取规范化答案表达式，进行字符串清洗、单位处理和格式标准化。

## __init__函数
```python
@OPERATOR_REGISTRY.register()
class ReasoningAnswerExtractionQwenMathEvalGenerator(OperatorABC):
    """
    A class to handle the process of extracting answers from a dataset.
    """

    def __init__(self, dataset_name:str = None):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **dataset_name** | str | None | 数据集名称，用于特定数据集的答案提取逻辑。 |

## run函数
```python
def run(self, storage: DataFlowStorage, response_key:str = "pseudo_correct_solution_example", extraction_key:str = "extraction")
```
执行算子主逻辑，从存储中读取包含待提取答案的 DataFrame，提取规范化答案，并将结果写回存储。
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **response_key** | str | "pseudo_correct_solution_example" | 输入列名，对应包含待提取答案的原始文本字段。 |
| **extraction_key** | str | "extraction" | 输出列名，对应提取并规范化后的答案字段。 |

## 🧠 示例用法
```python
from dataflow.operators.reasoning import ReasoningAnswerExtractionQwenMathEvalGenerator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC

class ReasoningAnswerExtractionQwenMathEvalGeneratorTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.operator = ReasoningAnswerExtractionQwenMathEvalGenerator()
        
    def forward(self):
        self.operator.run(
            storage = self.storage.step(),
            input_key = "pseudo_correct_solution_example",
            output_key = "extraction"
        )

if __name__ == "__main__":
    pl = ReasoningAnswerExtractionQwenMathEvalGeneratorTest()
    pl.forward()
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| (原始字段) | - | 输入数据中的所有原始字段将被保留。 |
| extraction | str | 提取并规范化后的数学答案表达式。 |

示例输入：
```json
{
"pseudo_correct_solution_example": "The circumference of the circle is 2 * pi * 5, which is approximately 31.4. Therefore, the answer is \\boxed{31.4}."
}
```
示例输出：
```json
{
"pseudo_correct_solution_example": "The circumference of the circle is 2 * pi * 5, which is approximately 31.4. Therefore, the answer is \\boxed{31.4}.",
"extraction": "31.4"
}
```
