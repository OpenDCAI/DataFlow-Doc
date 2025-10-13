---
title: PerspectiveSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/perspectivesampleevaluator/
---

## 📘 Overview
The `PerspectiveSampleEvaluator` is an operator designed to assess the toxicity of text inputs using the Perspective API. It processes a DataFrame, sends the text from a specified column to the Perspective API, and appends the resulting toxicity scores to the DataFrame in a new column.

## `__init__` function
```python
def __init__(self, serving: PerspectiveAPIServing = None):
```
### init parameter description
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **serving** | PerspectiveAPIServing | None | The Perspective API serving instance used to make API calls for toxicity scoring. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PerspectiveScore'):
```
#### Parameters
| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance responsible for reading the input DataFrame and writing the output DataFrame. |
| **input_key** | str | Required | The name of the column containing the text to be evaluated for toxicity. |
| **output_key** | str | 'PerspectiveScore' | The name of the column where the generated toxicity scores will be stored. |

## 🧠 Example Usage
```python

```
#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :--- | :--- | :--- |
| *input_key* | str | The input text from the source column. |
| PerspectiveScore | float | The toxicity score returned by the Perspective API. A higher score indicates a higher likelihood of toxicity. |

**Example Input:**
```json
{
    "text": "You are a wonderful person."
}
```
**Example Output:**
```json
{
    "text": "You are a wonderful person.",
    "PerspectiveScore": 0.01539258
}
```
