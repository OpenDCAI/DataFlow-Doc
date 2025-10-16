---
title: RemoveExtraSpacesRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removeextraspacesrefiner/
---

## 📘 Overview

The `RemoveExtraSpacesRefiner` is an operator designed to clean and standardize text data by removing redundant whitespace. It replaces any sequence of multiple spaces with a single space and trims leading and trailing whitespace from the text.

## `__init__`

```python
def __init__(self)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | This operator does not require any parameters during initialization. |

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be processed. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import RemoveExtraSpacesRefiner
from dataflow.utils.storage import FileStorage

class RemoveExtraSpacesRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_extra_spaces_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveExtraSpacesRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveExtraSpacesRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text after whitespace normalization |

### 📋 Sample Input

```json
{"text":"This  is   a    test     with      extra       spaces."}
{"text":"  Leading spaces and trailing spaces  "}
{"text":"Multiple   spaces    between     words"}
{"text":"Normal text without extra spaces"}
{"text":"Tab\tand\t\tnewline\n\ncharacters   mixed"}
```

### 📤 Sample Output

```json
{"text":"This is a test with extra spaces."}
{"text":"Leading spaces and trailing spaces"}
{"text":"Multiple spaces between words"}
{"text":"Normal text without extra spaces"}
{"text":"Tab and newline characters mixed"}
```

### 📊 Results Analysis

In this test, 4 out of 5 input samples were modified:

**Sample 1 (Extra Spaces)**:
- Original: "This  is   a    test     with      extra       spaces."
- Replaced all consecutive spaces with single spaces
- Result: "This is a test with extra spaces."
- **Modified**

**Sample 2 (Leading/Trailing Spaces)**:
- Original: "  Leading spaces and trailing spaces  "
- Removed leading and trailing whitespace, kept single spaces
- Result: "Leading spaces and trailing spaces"
- **Modified**

**Sample 3 (Multiple Spaces Between Words)**:
- Original: "Multiple   spaces    between     words"
- Replaced all consecutive spaces with single spaces
- Result: "Multiple spaces between words"
- **Modified**

**Sample 4 (Normal Text)**:
- Original: "Normal text without extra spaces"
- Text has no extra spaces
- **Unchanged** (remains as is)

**Sample 5 (Tabs and Newlines)**:
- Original: "Tab\tand\t\tnewline\n\ncharacters   mixed"
- Tabs and newlines treated as whitespace, converted to single spaces
- Result: "Tab and newline characters mixed"
- **Modified**

**Use Cases**:
- Text format standardization
- Clean up formatting issues in OCR results
- Unify text format in data preprocessing
- Remove extra spaces from copy-paste text

**Notes**:
- This operator uses Python's `split()` and `join()` methods
- Automatically handles all types of whitespace (spaces, tabs, newlines, etc.)
- Recommended for late-stage text cleaning, used with other refiners to clean residual spaces
