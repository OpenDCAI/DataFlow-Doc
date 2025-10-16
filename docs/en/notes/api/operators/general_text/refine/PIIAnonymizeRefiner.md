---
title: PIIAnonymizeRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/piianonymizerefiner/
---

## 📘 Overview

`PIIAnonymizeRefiner` is an operator that uses Presidio and BERT-NER models to identify and anonymize Personally Identifiable Information (PII) in text. It supports detection and anonymization of multiple PII types, effectively protecting data privacy.

## `__init__` function

```python
def __init__(self, lang='en', device='cuda', model_cache_dir='./dataflow_cache', model_name='dslim/bert-base-NER')
```

### init parameter description

| Parameter          | Type | Default                | Description                         |
| :----------------- | :--- | :---------------------- | :---------------------------------- |
| **lang**           | str  | 'en'                    | Language code for text, used to select appropriate model. |
| **device**         | str  | 'cuda'                  | Device for running model, e.g., 'cuda' or 'cpu'. |
| **model_cache_dir** | str  | './dataflow_cache'      | Local cache directory for storing downloaded NER models. |
| **model_name**     | str  | 'dslim/bert-base-NER'   | Name of pre-trained NER model to use. |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name        | Type            | Default | Description                                       |
| :---------- | :-------------- | :------ | :------------------------------------------------ |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str             | Required | Input column name for text field to perform PII anonymization. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import PIIAnonymizeRefiner
from dataflow.utils.storage import FileStorage

class PIIAnonymizeRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/pii_anonymize_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = PIIAnonymizeRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = PIIAnonymizeRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with PII information replaced by anonymization labels |

### 📋 Sample Input

```json
{"text":"My email is john@example.com"}
{"text":"Call me at 555-1234"}
{"text":"My name is John Smith"}
```

### 📤 Sample Output

```json
{"text":"My email is <EMAIL_ADDRESS>"}
{"text":"Call me at 555-1234"}
{"text":"My name is <PERSON>"}
```

### 📊 Results Analysis

**Sample 1**: "john@example.com" → `<EMAIL_ADDRESS>`
**Sample 2**: Phone number not recognized (may be non-standard format)
**Sample 3**: "John Smith" → `<PERSON>`

**Use Cases**:
- Data privacy protection
- GDPR compliance processing
- Sensitive information de-identification
- Preprocessing before data sharing

**Notes**:
- Uses Presidio and BERT-NER models for PII recognition
- Supports recognition of multiple PII types including person names, emails, phones, addresses, etc.
- First use will download BERT model
- Recognition accuracy depends on model and text format
