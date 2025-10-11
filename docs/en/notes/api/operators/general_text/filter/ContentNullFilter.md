---
title: ContentNullFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/contentnullfilter/
---

## 📘 Overview
The `ContentNullFilter` operator filters null values, empty strings, or text containing only whitespace characters from datasets to ensure the quality and validity of data for downstream processing.

## __init__ Function
```python
def __init__(self)
```
### Initialization Parameters
| Parameter Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | This operator requires no parameters during initialization. |

## run Function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='content_null_filter_label')
```
#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :--------------------------- | :------------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance responsible for reading and writing data. |
| **input_key** | str | Required | Input column name specifying the text field to check for null values. |
| **output_key** | str | "content_null_filter_label" | Output column name for storing the filter result label (1 means valid, 0 means invalid). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import ContentNullFilter
from dataflow.utils.storage import FileStorage

class ContentNullFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/content_null_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = ContentNullFilter()
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='content_null_filter_label'
        )

if __name__ == "__main__":
    test = ContentNullFilterTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--------------------------- | :---- | :---------------------------------- |
| text | str | Original input text field |
| content_null_filter_label | int | Filter label, value of 1 means the data row is valid and passed the filter |

### 📋 Sample Input

```json
{"text": "This is a valid sentence."}
{"text": ""}
{"text": "   "}
{"text": "Another valid one."}
```

### 📤 Sample Output

```json
{"text": "This is a valid sentence.", "content_null_filter_label": 1}
{"text": "Another valid one.", "content_null_filter_label": 1}
```

### 📊 Result Analysis

In this test, 2 out of 4 input data items passed the filter:

**Sample 1 (Valid Text)**:
- Text: "This is a valid sentence."
- Contains valid content
- **Retained** (content_null_filter_label=1)

**Sample 2 (Empty String)**:
- Text: "" (empty string)
- **Filtered** (not in output)

**Sample 3 (Whitespace Only)**:
- Text: "   " (only contains spaces)
- **Filtered** (not in output)

**Sample 4 (Valid Text)**:
- Text: "Another valid one."
- Contains valid content
- **Retained** (content_null_filter_label=1)

**Use Cases**:
- Data cleaning, removing null values and invalid data
- Ensure data quality for downstream processing
- Remove noise data during preprocessing phase
- Guarantee validity of text fields

**Notes**:
- This operator filters `None`, empty strings `""`, and strings containing only whitespace characters
- Uses the `str.strip()` method to detect whitespace-only strings
- A fundamental filter operator in data processing pipelines
