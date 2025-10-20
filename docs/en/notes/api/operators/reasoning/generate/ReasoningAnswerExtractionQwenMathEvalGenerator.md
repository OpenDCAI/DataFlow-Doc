---
title: ReasoningAnswerExtractionQwenMathEvalGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/generate/reasoninganswerextractionqwenmathevalgenerator/
---

## 📘 Overview
[ReasoningAnswerExtractionQwenMathEvalGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) This operator is used to extract normalized answer expressions from mathematical problem responses, performing string cleaning, unit processing, and format standardization.

## `__init__` function
```python
@OPERATOR_REGISTRY.register()
class ReasoningAnswerExtractionQwenMathEvalGenerator(OperatorABC):
    """
    A class to handle the process of extracting answers from a dataset.
    """

    def __init__(self, dataset_name:str = None):
```
### init Parameter Description
| Parameter Name | Type | Default | Description |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **dataset_name** | str | None | Dataset name, used for specific dataset answer extraction logic. |

## run function
```python
def run(self, storage: DataFlowStorage, response_key:str = "pseudo_correct_solution_example", extraction_key:str = "extraction")
```
Executes the main logic of the operator, reads a DataFrame containing answers to be extracted from storage, extracts normalized answers, and writes the results back to storage.
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **response_key** | str | "pseudo_correct_solution_example" | Input column name, corresponding to the original text field containing answers to be extracted. |
| **extraction_key** | str | "extraction" | Output column name, corresponding to the extracted and normalized answer field. |

## 🧠 Example Usage
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
            response_key = "pseudo_correct_solution_example",
            extraction_key = "extraction"
        )

if __name__ == "__main__":
    pl = ReasoningAnswerExtractionQwenMathEvalGeneratorTest()
    pl.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :-------------- | :---- | :---------- |
| (Original fields) | - | All original fields from the input data will be preserved. |
| extraction | str | Extracted and normalized mathematical answer expression. |

Example input:
```json
{
"pseudo_correct_solution_example": "The circumference of the circle is 2 * pi * 5, which is approximately 31.4. Therefore, the answer is \\boxed{31.4}."
}
```
Example output:
```json
{
"pseudo_correct_solution_example": "The circumference of the circle is 2 * pi * 5, which is approximately 31.4. Therefore, the answer is \\boxed{31.4}.",
"extraction": "31.4"
}
```
