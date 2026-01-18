---
title: FineWebEduSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/eval/finewebedusampleevaluator/
---

## 📘 Overview

The `FineWebEduSampleEvaluator` is an operator designed to evaluate the educational value of a given text. It utilizes the `HuggingFaceTB/fineweb-edu-classifier`, a pre-trained sequence classification model, to assign a score between 0 and 1. A higher score indicates a greater educational value, making this operator suitable for filtering and selecting educational content.

## `__init__` function

```python
def __init__(self, model_cache_dir: str = './dataflow_cache', device: str = 'cuda')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **model\_cache\_dir** | str | './dataflow\_cache' | The directory to cache the downloaded Hugging Face model and tokenizer. |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda', 'cpu'). If not specified, it defaults to 'cuda' if available, otherwise 'cpu'. |

## Prompt Template Descriptions

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='FineWebEduScore')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance for reading the input DataFrame and writing the result. |
| **input\_key** | str | Required | The name of the input column in the DataFrame that contains the text to be evaluated. |
| **output\_key** | str | 'FineWebEduScore' | The name of the output column where the generated educational value scores will be stored. |

## 🧠 Example Usage
```python
from dataflow.operators.text_pt.eval import FineWebEduSampleEvaluator
from dataflow.utils.storage import FileStorage

# Prepare data and storage
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# Initialize and run the operator
fineweb_evaluator = FineWebEduSampleEvaluator()
fineweb_evaluator.run(
    storage.step(),
    input_key='raw_content',
    output_key='FinewebEduScore'
)
```

## 🧾 Output Format

The operator appends a new column (specified by `output_key`) to the input DataFrame, containing the educational score for the text in the `input_key` column.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input data. |
| FinewebEduScore | float | The calculated educational value score. |

**Example Input:**
```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios..."
}
```

**Example Output:**
```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios...",
  "FinewebEduScore": 1.5264956951
}
```
