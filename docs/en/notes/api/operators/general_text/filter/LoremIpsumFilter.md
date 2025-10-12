---
title: LoremIpsumFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/loremipsumfilter/
---

## 📘 Overview

`LoremIpsumFilter` is an operator for detecting and filtering placeholder text containing "lorem ipsum". It determines whether text is valid by calculating the ratio between the frequency of placeholder text occurrence and the total text length, comparing it against a set threshold, thereby enabling dataset cleaning.

## __init__ Function

```python
def __init__(self, threshold: float=3e-8):
```

### Init Parameters

| Parameter | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| **threshold** | float | 3e-8 | Frequency threshold for determining whether to filter text. When the ratio of placeholder text occurrence frequency to total text length exceeds this threshold, the text will be filtered. |

## run Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='loremipsum_filter_label')
```

#### Parameters

| Name | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to detect. |
| **output_key** | str | 'loremipsum_filter_label' | Output column name for storing filter labels (1 for pass, 0 for filtered out). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import LoremIpsumFilter
from dataflow.utils.storage import FileStorage

class LoremIpsumFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/lorem_ipsum_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = LoremIpsumFilter(
            threshold=3e-8
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='loremipsum_filter_label'
        )

if __name__ == "__main__":
    test = LoremIpsumFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :-- | :-- | :-- |
| [input_key] | str | Original input text content. |
| loremipsum_filter_label | int | Filter label with value 1, indicating this data row passed filtering. |

### 📋 Example Input

```json
{"text": "This is a valid text entry that should pass the filter without any issues."}
{"text": "lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum lorem ipsum lorem ipsum lorem ipsum"}
{"text": "This is normal text. No placeholder content here."}
```

### 📤 Example Output

```json
{"text": "This is a valid text entry that should pass the filter without any issues.", "loremipsum_filter_label": 1}
{"text": "This is normal text. No placeholder content here.", "loremipsum_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Normal text)**:
- Text length: 76 characters
- "lorem ipsum" occurrences: 0
- Frequency ratio: 0 / 76 = 0
- Threshold: 3e-8
- **Passes filter** (0 ≤ 3e-8)

**Sample 2 (Contains excessive placeholder text)**:
- Text length: 105 characters
- "lorem ipsum" occurrences: 5
- Frequency ratio: 5 / 105 ≈ 0.0476
- Threshold: 3e-8
- **Filtered out** (0.0476 > 3e-8)

**Sample 3 (Normal text)**:
- Text length: 47 characters
- "lorem ipsum" occurrences: 0
- Frequency ratio: 0 / 47 = 0
- Threshold: 3e-8
- **Passes filter** (0 ≤ 3e-8)

**Use Cases**:
- Clean placeholder text from web-scraped data
- Filter low-quality content containing template text
- Dataset quality control
- Pre-training corpus cleaning

**Notes**:
- The operator uses regex `r"lorem ipsum"` for case-insensitive matching
- Calculation formula: ratio = occurrence count / text length
- Any text containing "lorem ipsum" will almost certainly be filtered (due to extremely small default threshold)
- Larger threshold means more lenient filtering
