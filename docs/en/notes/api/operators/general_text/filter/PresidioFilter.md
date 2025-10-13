---
title: PresidioFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/presidiofilter/
---

## 📘 Overview

The `PresidioFilter` is a data filtering operator that scores and filters text based on the presence of Personally Identifiable Information (PII). It utilizes the Microsoft Presidio model to detect various types of sensitive data, such as names, email addresses, and phone numbers. This operator is essential for data privacy protection and compliance checks, allowing users to retain or discard data based on a specified range of PII counts.

## `__init__`
```python
def __init__(self, min_score: int = 0, max_score: int = 5, lang='en', device='cuda', model_cache_dir='./dataflow_cache')
```

| Parameter | Type | Default Value | Description |
| :------------------ | :---- | :--------------------- | :------------------------------------------------------------------ |
| **min_score** | int | 0 | Minimum PII count threshold for retaining samples. |
| **max_score** | int | 5 | Maximum PII count threshold for retaining samples. |
| **lang** | str | 'en' | Text language for the Presidio model. |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda', 'cpu'). |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache downloaded models. |

## Prompt Template Descriptions

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PresidioScore')
```

| Parameter | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :----------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be analyzed. |
| **output_key** | str | 'PresidioScore' | The name of the output column to store the calculated PII score. |

## 🧠 Example Usage

#### 🧾 Default Output Format
| Field | Type | Description |
| :-------------- | :---- | :--------------------------------------------------------- |
| {input_key} | str | The original input text from the specified `input_key` column. |
| PresidioScore | int | The number of PII entities detected in the text. |

**Example Input:**
*(Assuming `input_key` is "text")*
```json
{
"text":"My name is John Doe and my email is john.doe@example.com."
}
```
**Example Output:**
*(The operator filters the dataset. For a single record that passes the filter, this is how the data would be augmented before being written.)*
```json
{
"text":"My name is John Doe and my email is john.doe@example.com.",
"PresidioScore": 2
}
```
