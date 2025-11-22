---
title: SpecialCharacterFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/specialcharacterfilter/
---

## 📘 Overview

`SpecialCharacterFilter` is a special character filtering operator for removing entries containing specific or non-standard Unicode characters from text. This operator detects and filters text using predefined regular expression patterns to ensure data standardization and cleanliness.

## `__init__` Function

```python
def __init__(self)
```

### `init` Parameters

This operator requires no parameters during initialization.

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='special_character_filter_label')
```

Executes the operator's main logic, reading the input DataFrame from storage, detecting special characters in the specified column, filtering non-compliant rows, and writing results back to storage.

#### Parameters

| Name         | Type              | Default                             | Description                                                         |
| :----------- | :---------------- | :--------------------------------- | :----------------------------------------------------------- |
| **storage**  | DataFlowStorage   | Required                               | DataFlow storage instance for reading and writing data.                         |
| **input_key**| str               | Required                               | Input column name corresponding to the text field for special character detection.               |
| **output_key** | str               | "special_character_filter_label"   | Output label column name for marking whether text passes detection (1 for pass, 0 for fail). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import SpecialCharacterFilter
from dataflow.utils.storage import FileStorage

class SpecialCharacterFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/special_char_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = SpecialCharacterFilter()
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='special_character_filter_label'
        )

if __name__ == "__main__":
    test = SpecialCharacterFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field                             | Type | Description                                                   |
| :------------------------------- | :--- | :----------------------------------------------------- |
| [input_key]                      | str  | Original input text.                                       |
| special_character_filter_label   | int  | Special character detection label; 1 indicates text has no special characters and passes detection.   |

### 📋 Example Input

```json
{"text": "This is a normal text without special characters."}
{"text": "This text contains special char u200e which should be filtered."}
{"text": "Another normal text with standard punctuation!"}
```

### 📤 Example Output

```json
{"text": "This is a normal text without special characters.", "special_character_filter_label": 1}
{"text": "Another normal text with standard punctuation!", "special_character_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Normal text)**:
- Detection patterns: `r"u200e"`, `r"&#247;|\? :"`, `r"[�□]|\{\/U\}"`, `r"U\+26[0-F][0-D]|..."`
- Match result: No match
- **Passes filter** (no special characters)

**Sample 2 (Contains u200e)**:
- Pattern match detected: "u200e" found
- **Filtered out** (contains special characters)

**Sample 3 (Standard punctuation)**:
- Detection patterns: No match
- **Passes filter** (standard punctuation is not considered special characters)

**Detected Special Character Types**:
- Unicode control characters (e.g., u200e)
- HTML entities (e.g., &#247;)
- Broken characters (e.g., �, □)
- Unicode emoji ranges (e.g., U+2600-U+273F)

**Use Cases**:
- Clean web-scraped data
- Filter text containing abnormal Unicode characters
- Data normalization processing
- Ensure text compatibility

**Notes**:
- Uses predefined regex patterns for detection
- Empty text will be filtered
- Standard punctuation marks are not considered special characters
- Special character patterns can be customized as needed
