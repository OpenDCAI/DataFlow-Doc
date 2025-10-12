---
title: WatermarkFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/watermarkfilter/
---

## 📘 Overview

`WatermarkFilter` is a watermark content filtering operator for detecting and removing text containing specified watermark keywords (such as copyright notices, confidentiality markers, etc.). The operator effectively identifies and filters out non-compliant data rows by matching against a predefined keyword list.

## `__init__` Function

```python
def __init__(self, watermarks: list= ['Copyright', 'Watermark', 'Confidential'])
```

### Init Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **watermarks** | list | `['Copyright', 'Watermark', 'Confidential']` | Keyword list for identifying watermark content. |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='watermark_filter_label')
```

### Parameters

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to detect. |
| **output_key** | str | "watermark_filter_label" | Output column name for marking whether text passes watermark detection. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import WatermarkFilter
from dataflow.utils.storage import FileStorage

class WatermarkFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/watermark_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = WatermarkFilter(
            watermarks=['Copyright', 'Watermark', 'Confidential']
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='watermark_filter_label'
        )

if __name__ == "__main__":
    test = WatermarkFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

The operator adds a new field to the data (default `watermark_filter_label`), where a value of 1 indicates passed detection (no watermark) and 0 indicates failed (has watermark). The final output dataframe only includes rows that pass detection.

| Field | Type | Description |
| :--- | :--- | :--- |
| `<input_key>` | str | Input text to be detected. |
| watermark_filter_label | int | Watermark detection label; 1 indicates no watermark. Value is always 1 in output data. |

### 📋 Example Input

```json
{"text": "This is a clean document without any watermarks."}
{"text": "Confidential: This document contains sensitive information."}
{"text": "Another line of text for processing."}
{"text": "Copyright 2024. All rights reserved."}
```

### 📤 Example Output

```json
{"text": "This is a clean document without any watermarks.", "watermark_filter_label": 1}
{"text": "Another line of text for processing.", "watermark_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (No watermark)**:
- Text content: Normal document description
- Detected watermark keywords: None
- **Passes filter** (no watermark content)

**Sample 2 (Contains "Confidential")**:
- Text content: Contains "Confidential:" marker
- Detected watermark keywords: "Confidential"
- **Filtered out** (matches watermark keyword)

**Sample 3 (No watermark)**:
- Text content: Plain text
- Detected watermark keywords: None
- **Passes filter** (no watermark content)

**Sample 4 (Contains "Copyright")**:
- Text content: Contains copyright notice "Copyright 2024"
- Detected watermark keywords: "Copyright"
- **Filtered out** (matches watermark keyword)

**How It Works**:
1. Use regular expressions to match watermark keywords
2. Keyword list is joined with `|` to form regex pattern
3. Any text matching keywords is filtered
4. Matching is case-sensitive

**Use Cases**:
- Filter copyrighted content
- Remove documents with confidentiality markers
- Clean commercial watermark text
- Data compliance processing

**Notes**:
- Uses regex matching, supports fuzzy matching
- Default keywords: `['Copyright', 'Watermark', 'Confidential']`
- Watermark keyword list can be customized
- Matching is case-sensitive
