---
title: NERRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/nerrefiner/
---

## 📘 Overview

`NERRefiner` is a Named Entity Recognition (NER) optimization operator that uses the `spaCy` library to identify and mask specific entities in text (such as person names, locations, organizations, etc.). It achieves data anonymization or feature extraction by replacing identified entities with their type labels (e.g., `[PERSON]`), suitable for data preprocessing, privacy protection, and other scenarios.

## __init__ function

```python
def __init__(self)
```

This operator requires no parameters during initialization.

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name          | Type              | Default | Description                                                         |
| :------------ | :---------------- | :------ | :------------------------------------------------------------------ |
| **storage**   | `DataFlowStorage` | Required | Data flow storage instance for reading and writing data. |
| **input_key** | `str`             | Required | Name of input column containing text for entity recognition and masking. |

## 🧠 Example Usage
```python
from dataflow.operators.general_text import NERRefiner
from dataflow.utils.storage import FileStorage

class NERRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/ner_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = NERRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = NERRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with named entities replaced by labels |

### 📋 Sample Input

```json
{"text":"Apple Inc. is located in California"}
{"text":"John Smith works at Microsoft"}
{"text":"Visit Paris next summer"}
```

### 📤 Sample Output

```json
{"text":"[ORG] is located in [GPE]"}
{"text":"[PERSON] works at [ORG]"}
{"text":"Visit [GPE] [DATE]"}
```

### 📊 Results Analysis

**Sample 1**: "Apple Inc." → [ORG] (organization), "California" → [GPE] (geopolitical entity)
**Sample 2**: "John Smith" → [PERSON] (person name), "Microsoft" → [ORG] (organization)
**Sample 3**: "Paris" → [GPE] (geopolitical entity), "next summer" → [DATE] (date)

**Use Cases**:
- Privacy protection and data anonymization
- Text anonymization
- Information extraction preprocessing
- Sensitive information masking

**Notes**:
- Uses spaCy's en_core_web_sm model
- Supports multiple entity types: PERSON, ORG, GPE, LOC, DATE, MONEY, etc.
- Only applicable to English text
