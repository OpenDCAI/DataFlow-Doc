---
title: PresidioSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/presidiosampleevaluator/
---

## 📘 Overview

`PresidioSampleEvaluator` is an operator that detects personally identifiable information (PII) in text using the Microsoft Presidio model and returns the count of detected PII entities. It supports various entity types such as names, emails, and phone numbers, implemented based on the `dslim/bert-base-NER` model. This operator is suitable for assessing text privacy and security risks.

## `__init__`

```python
def __init__(self, device='cuda', lang='en', model_cache_dir='./dataflow_cache')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda' or 'cpu'). |
| **lang** | str | 'en' | The language of the text to be analyzed. |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded model. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='PresidioScore')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance for reading and writing data. |
| **input_key** | str | Required | The column name in the input dataframe that contains the text to be evaluated. |
| **output_key** | str | 'PresidioScore' | The column name for the output scores (PII counts). |

## 🧠 Example Usage

```python

```

#### 🧾 Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| [input_key] | str | The original input text from the specified `input_key` column. |
| [output_key] | int | The number of PII entities detected in the input text. The default field name is `PresidioScore`. |

**Example Input:**
(Assuming `input_key` is "text")
```json
{
    "text": "My name is John Doe and my email is john.doe@example.com."
}
```

**Example Output:**
(Assuming `output_key` is "PresidioScore")
```json
{
    "text": "My name is John Doe and my email is john.doe@example.com.",
    "PresidioScore": 2
}
```
