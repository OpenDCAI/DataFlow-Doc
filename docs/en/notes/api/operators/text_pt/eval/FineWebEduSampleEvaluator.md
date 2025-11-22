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

## 🧾 Output Format

The operator appends a new column (specified by `output_key`) to the input DataFrame, containing the educational score for the text in the `input_key` column.

| Field | Type | Description |
| :--- | :--- | :--- |
| [input\_key] | str | The original input text from the source column. |
| [output\_key] | float | The calculated educational value score, ranging from 0 to 1. |

**Example Input:**
```json
{
    "text": "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy, through a process that uses sunlight, water, and carbon dioxide."
}
```

**Example Output:**
```json
{
    "text": "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy, through a process that uses sunlight, water, and carbon dioxide.",
    "FineWebEduScore": 0.98765
}
```
