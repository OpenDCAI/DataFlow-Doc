---
title: ReasoningDifficultyDatasetEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/eval/reasoningdifficultydatasetevaluator/
---

## 📘 Overview
The `ReasoningDifficultyDatasetEvaluator` is an operator designed to analyze and report the distribution of difficulty levels within a dataset. It processes a dataframe, counts the occurrences of each difficulty score, and returns a summary dictionary of the distribution.

## __init__ function
```python
def __init__(self)
```
### init parameter description
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | This operator does not require any parameters during initialization. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
|---|---|---|---|
| | | | |

## run function
```python
def run(self, storage: DataFlowStorage, input_diffulty_key: str = "difficulty_score")
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, which provides access to the input dataframe. |
| **input_diffulty_key** | str | "difficulty_score" | The name of the column in the input dataframe that contains the difficulty scores. |

## 🧠 Example Usage
```python
from dataflow.operators.reasoning import ReasoningDifficultyDatasetEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC

class ReasoningDifficultyDatasetEvaluatorTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = ReasoningDifficultyDatasetEvaluator()
        
    def forward(self):
        self.evaluator.run(
            storage = self.storage.step(),
            input_diffulty_key = "difficulty_score",
        )

if __name__ == "__main__":
    pl = ReasoningDifficultyDatasetEvaluatorTest()
    pl.forward()
```

#### 🧾 Return Value

This operator returns a dictionary where the keys are the difficulty levels found in the dataset, and the values are the corresponding sample counts for each difficulty level.

Example return value:
```json
{
  "Easy": 150,
  "Medium": 200,
  "Hard": 80
}
```
