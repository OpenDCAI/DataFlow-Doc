---
title: PresidioSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/presidiosampleevaluator/
---

## 📘 Overview

`PresidioSampleEvaluator` is an operator for detecting Personal Identifiable Information (PII) in text using the Microsoft Presidio framework. It can identify and extract various types of sensitive information such as names, email addresses, phone numbers, credit card numbers, etc., helping protect user privacy and comply with data protection regulations.

**Key Features**:
- Detects multiple PII entity types (person names, locations, organizations, email addresses, phone numbers, credit cards, etc.)
- Based on Named Entity Recognition (NER) models
- Returns detected entity types, positions, and confidence scores
- Supports multiple languages
- Extensible entity type detection

**Use Cases**: Privacy protection, data anonymization, compliance auditing, sensitive information filtering

## __init__

```python
def __init__(self, device='cuda', lang='en', model_cache_dir='./dataflow_cache')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **device** | str | 'cuda' | Computing device (cuda or cpu). |
| **lang** | str | 'en' | Text language, affects model selection. |
| **model_cache_dir** | str | './dataflow_cache' | Local cache directory for storing and loading pre-trained models. |

## run

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PresidioScore')
```

#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name specifying the column containing the text to be evaluated. |
| **output_key** | str | 'PresidioScore' | Output column name for storing detected PII entities. |

## 🧠 Example Usage
```python
from dataflow.operators.general_text import PresidioSampleEvaluator
from dataflow.utils.storage import FileStorage

class PresidioSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/presidio_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = PresidioSampleEvaluator(
            device='cuda',
            lang='en',
            model_cache_dir='./dataflow_cache'
        )
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='PresidioScore'
        )

if __name__ == "__main__":
    test = PresidioSampleEvaluatorTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | The original input text |
| PresidioScore | list | List of detected PII entities, each containing entity type, start position, end position, and confidence score |

### 📋 Example Input
```json
{"text": "The weather is nice today. Let's go for a walk in the park."}
{"text": "My name is John Smith and I live in New York."}
{"text": "Please contact me at john.doe@example.com or call me at +1-555-123-4567. My credit card number is 4532-1234-5678-9010."}
```

### 📤 Example Output
```json
{"text": "The weather is nice today. Let's go for a walk in the park.", "PresidioScore": []}
{"text": "My name is John Smith and I live in New York.", "PresidioScore": [{"entity_type": "PERSON", "start": 11, "end": 21, "score": 0.85}, {"entity_type": "LOCATION", "start": 37, "end": 45, "score": 0.85}]}
{"text": "Please contact me at john.doe@example.com or call me at +1-555-123-4567. My credit card number is 4532-1234-5678-9010.", "PresidioScore": [{"entity_type": "EMAIL_ADDRESS", "start": 21, "end": 41, "score": 1.0}, {"entity_type": "PHONE_NUMBER", "start": 57, "end": 73, "score": 0.75}, {"entity_type": "CREDIT_CARD", "start": 101, "end": 120, "score": 1.0}]}
```

### 📊 Result Analysis

**Sample 1 (No PII):**
- PresidioScore: [] (empty list)
- No sensitive information detected
- Safe text without privacy concerns

**Sample 2 (Simple PII):**
- Detected 2 entities:
  - PERSON: "John Smith" (confidence: 0.85)
  - LOCATION: "New York" (confidence: 0.85)
- Contains basic personal information

**Sample 3 (Sensitive PII):**
- Detected 3 entities:
  - EMAIL_ADDRESS: "john.doe@example.com" (confidence: 1.0)
  - PHONE_NUMBER: "+1-555-123-4567" (confidence: 0.75)
  - CREDIT_CARD: "4532-1234-5678-9010" (confidence: 1.0)
- Contains highly sensitive financial and contact information
- Requires anonymization or masking before storage/sharing

**Common Entity Types**:
- PERSON: Person names
- LOCATION: Geographic locations
- ORGANIZATION: Organization names
- EMAIL_ADDRESS: Email addresses
- PHONE_NUMBER: Phone numbers
- CREDIT_CARD: Credit card numbers
- DATE_TIME: Dates and times
- US_SSN: US Social Security Numbers

**Application Value**: This operator is crucial for GDPR/CCPA compliance, helping organizations automatically detect and handle PII in text data, protecting user privacy and avoiding legal risks.
