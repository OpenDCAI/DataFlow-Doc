---
title: DebertaV3Filter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/filter/debertav3filter/
---

## 📘 Overview
The `DebertaV3Filter` is an operator designed to filter data based on text quality scores. It utilizes a DebertaV3-based quality classifier model to evaluate each text entry and retains only those entries that meet a predefined quality threshold (e.g., 'Medium' or 'High').

## `__init__`
```python
def __init__(self, allowed_scores : list = ['Medium', 'High'], model_name='nvidia/quality-classifier-deberta', model_cache_dir='./dataflow_cache', device='cuda', batch_size=16)
```
### `__init__` Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **allowed_scores** | list | `['Medium', 'High']` | A list of quality scores that are considered acceptable. Rows with these scores will be kept. |
| **model_name** | str | `'nvidia/quality-classifier-deberta'` | The identifier of the pre-trained DebertaV3 model to be used for quality classification. |
| **model_cache_dir** | str | `'./dataflow_cache'` | The directory where the downloaded model will be cached. |
| **device** | str | `'cuda'` | The device on which the model will run (e.g., 'cuda' or 'cpu'). |
| **batch_size** | int | `16` | The number of samples to process in a single batch during inference. |

## Prompt Template Descriptions
Not applicable for this operator.

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'Debertav3Score')
```
Executes the main filtering logic. It reads a DataFrame from storage, computes quality scores for the text in the `input_key` column, adds the scores to a new `output_key` column, and writes the filtered DataFrame (containing only rows with allowed scores) back to storage.

#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance used for reading the input DataFrame and writing the filtered output. |
| **input_key** | str | Required | The name of the column in the input DataFrame that contains the text to be evaluated. |
| **output_key** | str | `'Debertav3Score'` | The name of the new column that will be added to the DataFrame to store the quality score of each text entry. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator filters the input data and adds a new column for the quality score. Only the rows with a score present in the `allowed_scores` list (as defined during initialization) will be present in the output.

| Field | Type | Description |
| :--- | :--- | :--- |
| (original fields) | - | All original fields from the input data are preserved. |
| Debertav3Score | str | The quality score assigned by the model (e.g., 'Low', 'Medium', 'High'). This is the default `output_key`. |

**Example Input:**
```json
{
    "text": "The quick brown fox jumps over the lazy dog."
}
```
**Example Output (assuming the score was 'High' and 'High' is in `allowed_scores`):**
```json
{
    "text": "The quick brown fox jumps over the lazy dog.",
    "Debertav3Score": "High"
}
```
