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

```

#### 🧾 Output Format
The `run` function returns a dictionary containing the statistics of the difficulty distribution. The keys of the dictionary are the unique difficulty levels found in the dataset, and the values are the counts of samples for each level.

**Example Input (Data in `storage`)**:
A dataframe with a column named `difficulty_score` (or as specified by `input_diffulty_key`).
```
[
    {"instruction": "Question A...", "difficulty_score": "easy"},
    {"instruction": "Question B...", "difficulty_score": "medium"},
    {"instruction": "Question C...", "difficulty_score": "easy"},
    {"instruction": "Question D...", "difficulty_score": "hard"},
    {"instruction": "Question E...", "difficulty_score": "medium"}
]
```

**Example Output (Return value of `run` function)**:
```json
{
    "easy": 2,
    "medium": 2,
    "hard": 1
}
```
