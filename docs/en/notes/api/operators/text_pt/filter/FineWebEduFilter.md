---
title: FineWebEduFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/filter/finewebedufilter/
---

## 📘 FineWebEduFilter
`FineWebEduFilter` is an operator that filters data based on scores from the FineWebEduScorer. Fineweb-Edu is a classifier designed to evaluate the educational value of a given text. It retains data samples whose scores fall within a specified range `[min_score, max_score]`.

## `__init__`
```python
def __init__(self, min_score: float = 2.5, max_score: float = 10000, model_cache_dir: str = './dataflow_cache', device: str = 'cuda')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 2.5 | The minimum score threshold to keep the data. |
| **max_score** | float | 10000 | The maximum score threshold to keep the data. |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded model. |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda', 'cpu'). |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='FinewebEduScore')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlowStorage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be scored. |
| **output_key** | str | 'FinewebEduScore' | The name of the output column to store the generated score. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :--- | :--- | :--- |
| *input_columns* | - | Original columns from the input data. |
| FinewebEduScore | float | The score indicating the educational value of the text, added by the operator. |

**Example Input:**
```json
{
    "text": "The mitochondria is the powerhouse of the cell."
}
```
**Example Output:**
```json
{
    "text": "The mitochondria is the powerhouse of the cell.",
    "FinewebEduScore": 4.5
}
```
