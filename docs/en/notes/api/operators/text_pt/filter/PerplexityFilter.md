---
title: PerplexityFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/filter/perplexityfilter/
---

## 📘 Overview
The `PerplexityFilter` is an operator designed to filter data based on perplexity scores. It calculates the perplexity of text using a Hugging Face model, where lower scores generally indicate higher fluency and quality. This operator is useful for cleaning datasets by removing low-quality or nonsensical text entries.

## `__init__`
```python
def __init__(self, min_score: float = 10.0, max_score: float = 500.0, model_name: str = 'gpt2', device='cuda')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 10.0 | The minimum perplexity score for a record to be kept. |
| **max_score** | float | 500.0 | The maximum perplexity score for a record to be kept. |
| **model_name** | str | 'gpt2' | The name or path of the Hugging Face model to use for scoring. |
| **device** | str | 'cuda' | The device on which the model will run (e.g., 'cuda' or 'cpu'). |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| --- | --- | --- | --- |
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PerplexityScore')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be scored. |
| **output_key** | str | "PerplexityScore" | The name of the new column that will store the calculated perplexity score. |

## 🧠 Example Usage
```python
from dataflow.operators.text_pt.filter import PerplexityFilter
from dataflow.utils.storage import FileStorage

# Prepare data and storage
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# Initialize and run the filter
perplexity_filter = PerplexityFilter(
    min_score=10.0,
    max_score=500.0,
    model_name='gpt2',
    device='cuda'
)
perplexity_filter.run(
    storage.step(),
    input_key='raw_content',
    output_key='PerplexityScore'
)
```
#### 🧾 Default Output Format
The operator adds a new column (specified by `output_key`) with the perplexity score to the existing data and filters the rows based on `min_score` and `max_score`.

| Field | Type | Description |
| :--- | :--- | :--- |
| *original_fields* | any | The original fields from the input data. |
| PerplexityScore | float | The calculated perplexity score for the text in the `input_key` column. |

**Example Input:**
```json
{
"raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)..."
}
```
**Example Output (if it passes the filter):**
```json
{
"raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)...",
"PerplexityScore": 49.2016410828
}
```
