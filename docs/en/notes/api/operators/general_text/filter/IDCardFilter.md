---
title: IDCardFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/idcardfilter/
---

## 📘 Overview
The `IDCardFilter` operator detects and filters text containing ID card-related terms. It uses regular expressions to match common ID card numbers and related keywords to identify and remove data rows that may contain sensitive personal information, providing data cleaning and privacy protection.

## `__init__` Function
```python
def __init__(self, threshold:int=3)
```
### Initialization Parameters
| Parameter Name | Type | Default | Description |
| :---------- | :--- | :---- | :--------------------------------- |
| **threshold** | int | 3 | Threshold for the count of ID card-related terms matched. When the count of related terms in text reaches or exceeds this threshold, the text will be filtered. |

## `run` Function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='id_card_filter_label')
```
#### Parameters
| Name | Type | Default | Description |
| :---------- | :---------------- | :----------------------- | :---------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance responsible for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to be checked. |
| **output_key** | str | 'id_card_filter_label' | Output column name for storing the filter result label (1 means passed, 0 means filtered). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import IDCardFilter
from dataflow.utils.storage import FileStorage

class IDCardFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/idcard_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = IDCardFilter(threshold=3)
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='id_card_filter_label'
        )

if __name__ == "__main__":
    test = IDCardFilterTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :----------------------- | :---- | :----------------------------------------------------------- |
| text | str | Original input text |
| id_card_filter_label | int | Filter label. Value of 1 means passed check (ID card-related term count < threshold), 0 means failed |

### 📋 Sample Input

```json
{"text": "This is a normal conversation about daily life."}
{"text": "Please provide your 身份证号码 and 身份证 information for verification. Contact ID card number."}
```

### 📤 Sample Output

```json
{"text": "This is a normal conversation about daily life.", "id_card_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Normal Conversation)**:
- Text: "This is a normal conversation about daily life."
- Does not contain ID card-related terms
- Match count: 0
- **Passed filter** (< 3 threshold)

**Sample 2 (Contains Sensitive Information)**:
- Text: "Please provide your 身份证号码 and 身份证 information for verification. Contact ID card number."
- Contains multiple ID card-related terms:
  - "身份证号码" (1 occurrence)
  - "身份证" (1 occurrence)
  - "ID card" (1 occurrence)
- Match count: ≥3
- **Failed filter** (≥ 3 threshold)

**Detected Keyword Patterns** (including but not limited to):
- Chinese: 身份证、身份证号、身份证号码、证件号、证件号码
- English: ID card, identity card, ID number
- Regex patterns: May include matching ID card number formats

**Use Cases**:
- Privacy protection, filtering text containing ID card information
- Data compliance checking
- Sensitive information detection
- Prevent personal information leakage

**Notes**:
- Default threshold is 3, meaning filter when ID card-related terms appear 3 or more times
- Detects keywords in both Chinese and English
- Uses regular expressions for pattern matching
- Recommend adjusting threshold based on specific use cases
- This operator focuses on keyword matching, does not validate ID card number formats
