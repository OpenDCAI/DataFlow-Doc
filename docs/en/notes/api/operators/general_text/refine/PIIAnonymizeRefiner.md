---
title: PIIAnonymizeRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/piianonymizerefiner/
---

## 📘 PIIAnonymizeRefiner
The `PIIAnonymizeRefiner` is an operator that identifies and anonymizes Personally Identifiable Information (PII) in text using Presidio and BERT-NER models. It supports the detection and anonymization of various PII types.

## __init__
```python
def __init__(self, lang='en', device='cuda', model_cache_dir='./dataflow_cache', model_name='dslim/bert-base-NER')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **lang** | str | 'en' | The language code of the text to be processed (e.g., 'en' for English). |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda' or 'cpu'). |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded NER model. |
| **model_name** | str | 'dslim/bert-base-NER' | The name of the pre-trained NER model from the Hugging Face Hub. |

## Prompt Template Descriptions

## run
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the column in the DataFrame that contains the text to be anonymized. |

## 🧠 Example Usage

#### 🧾 Default Output Format (Output Format)
The operator modifies the input DataFrame in place. The column specified by `input_key` will have its PII content replaced with placeholders.

| Field | Type | Description |
| :--- | :--- | :--- |
| {input_key} | str | The text from the input column, now with PII anonymized. |

**Example Input:**
```json
{
"text": "My name is John Doe and my phone number is 212-555-1234."
}
```
**Example Output:**
```json
{
"text": "My name is <PERSON> and my phone number is <PHONE_NUMBER>."
}
```
