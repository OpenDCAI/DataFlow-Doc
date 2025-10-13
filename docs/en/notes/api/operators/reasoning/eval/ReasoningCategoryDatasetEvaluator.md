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


#### 🧾 Default Output Format
The `run` method returns a dictionary containing the statistical information of the categories.

**Example Input Data in DataFrame:**
```json
[
    {"primary_category": "Humanities", "secondary_category": "History"},
    {"primary_category": "STEM", "secondary_category": "Mathematics"},
    {"primary_category": "STEM", "secondary_category": "Physics"},
    {"primary_category": "STEM", "secondary_category": "Mathematics"}
]
```

**Example Output (Return Value):**
```json
{
    "STEM": {
        "primary_num": 3,
        "Mathematics": 2,
        "Physics": 1
    },
    "Humanities": {
        "primary_num": 1,
        "History": 1
    }
}
```
