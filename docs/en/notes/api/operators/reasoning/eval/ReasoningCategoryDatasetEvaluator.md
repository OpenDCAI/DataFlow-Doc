---
title: ReasoningCategoryDatasetEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/eval/reasoningcategorydatasetevaluator/
---

## 📘 Overview
[ReasoningCategoryDatasetEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/evaluate/reasoning_category_dataset_evaluator.py) is an operator used to analyze and report the distribution of primary and secondary categories within a dataset. It calculates the number of samples for each category and provides a statistical summary of the category distribution.

## `__init__` function
```python
def __init__(self)
```
This operator does not require any parameters during initialization.

## `run` function
```python
def run(self, storage: DataFlowStorage, input_primary_category_key: str = "primary_category", input_secondary_category_key: str = "secondary_category")
```
Executes the main logic of the operator. It reads a DataFrame from storage, calculates the category distribution, and returns the statistical information as a dictionary.

#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading data. |
| **input_primary_category_key** | str | "primary_category" | The column name for the primary category. |
| **input_secondary_category_key** | str | "secondary_category" | The column name for the secondary category. |

## Prompt Template Descriptions


## 🧠 Example Usage
```python
from dataflow.operators.reasoning import ReasoningCategoryDatasetEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC

class ReasoningCategoryDatasetEvaluatorTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = ReasoningCategoryDatasetEvaluator()
        
    def forward(self):
        self.evaluator.run(
            storage = self.storage.step(),
            input_primary_category_key = "primary_category",
            input_secondary_category_key = "secondary_category",
        )

if __name__ == "__main__":
    pl = ReasoningCategoryDatasetEvaluatorTest()
    pl.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :-------------- | :---- | :---------- |
| key | str | Primary category name. |
| value | dict | Dictionary containing the total number of samples for this primary category (`primary_num`) and the number of samples for each secondary category. |

Example input (dataframe rows stored in `storage`):
```json
{ "primary_category": "Science", "secondary_category": "Physics" }
{ "primary_category": "Science", "secondary_category": "Chemistry" }
{ "primary_category": "Science", "secondary_category": "Physics" }
{ "primary_category": "Humanities", "secondary_category": "History" }
```
Example output:
```json
{
  "Science": {
    "primary_num": 3,
    "Physics": 2,
    "Chemistry": 1
  },
  "Humanities": {
    "primary_num": 1,
    "History": 1
  }
}
```
