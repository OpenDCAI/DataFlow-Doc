---
title: QuratingFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/filter/quratingfilter/
---

## 📘 Overview
The `QuratingFilter` operator filters data based on scores from the `QuratingScorer`. It evaluates text quality across four dimensions using the Qurating model: writing style, required expertise, facts and trivia content, and educational value. Each dimension is scored from 0-9, providing a comprehensive quality assessment suitable for filtering high-quality educational or knowledge-based content.

## `__init__`
```python
def __init__(self, min_scores: dict = {'writing_style': 0,'required_expertise': 0,'facts_and_trivia': 0,'educational_value': 0}, max_scores: dict = {'writing_style': 9,'required_expertise': 9,'facts_and_trivia': 9,'educational_value': 9}, map_batch_size: int = 512, num_workers: int = 1, device_batch_size: int = 16, device: str = 'cuda', labels: list = ['writing_style', 'required_expertise', 'facts_and_trivia', 'educational_value'], model_cache_dir: str = './dataflow_cache')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_scores** | dict | `{'writing_style': 0, ...}` | Minimum score thresholds for each dimension to keep a sample. |
| **max_scores** | dict | `{'writing_style': 9, ...}` | Maximum score thresholds for each dimension to keep a sample. |
| **map_batch_size** | int | 512 | Mapping batch size for processing. |
| **num_workers** | int | 1 | Number of data loading workers. |
| **device_batch_size** | int | 16 | Batch size for each device. |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda', 'cpu'). |
| **labels** | list | `['writing_style', ...]` | List of evaluation dimensions to score. |
| **model_cache_dir** | str | './dataflow_cache' | Directory to cache the downloaded model. |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The column name in the dataframe that contains the text to be evaluated. |

## Prompt Template Descriptions

## 🧠 Example Usage

#### 🧾 Default Output Format (Output Format)
The operator filters the input dataframe and adds new columns indicating whether each sample passed the filter for each dimension. Only rows that pass the filter for *all* specified dimensions are kept in the final output.

| Field | Type | Description |
| :--- | :--- | :--- |
| *original_fields* | - | The operator preserves all original fields from the input data. |
| {label}_label | int | A binary flag (1 or 0) indicating if the sample's score for that dimension is within the `[min_scores[label], max_scores[label]]` range. A column is added for each label. For a row to be in the output, all its `_label` values must be 1. |

**Example Input:**
```json
{
"text": "The mitochondria is the powerhouse of the cell."
}
```
**Example Output (for a record that passed the filter):**
```json
{
"text": "The mitochondria is the powerhouse of the cell.",
"writing_style_label": 1,
"required_expertise_label": 1,
"facts_and_trivia_label": 1,
"educational_value_label": 1
}
```
