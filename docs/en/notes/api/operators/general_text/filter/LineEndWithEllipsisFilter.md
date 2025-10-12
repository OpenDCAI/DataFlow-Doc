---
title: LineEndWithEllipsisFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/lineendwithellipsisfilter/
---

## 📘 Overview

`LineEndWithEllipsisFilter` is a data filtering operator that detects the proportion of lines ending with ellipsis (`...` or `…`) in text. When this proportion is below the preset threshold, the text is considered valid and retained; otherwise, it is filtered out. This operator is commonly used in data cleaning to identify and remove incomplete expressions.

## `__init__` Function

```python
def __init__(self, threshold: float=0.3)
```

### Init Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.3 | Floating-point threshold. If the proportion of lines ending with ellipsis is less than this threshold, the text passes filtering. |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'line_end_with_ellipsis_filter_label')
```

#### Parameters

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to detect. |
| **output_key** | str | 'line_end_with_ellipsis_filter_label' | Output column name for storing filter result labels (1 for pass, 0 for fail). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import LineEndWithEllipsisFilter
from dataflow.utils.storage import FileStorage

class LineEndWithEllipsisFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/line_end_with_ellipsis_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = LineEndWithEllipsisFilter(
            threshold=0.3
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='line_end_with_ellipsis_filter_label'
        )

if __name__ == "__main__":
    test = LineEndWithEllipsisFilterTest()
    test.forward()
```

## 🧾 Default Output Format

The operator adds a new column specified by `output_key` to the DataFrame to mark filter results (1 for pass, 0 for fail), and ultimately writes back only rows that pass filtering (i.e., marked as 1).

| Field | Type | Description |
| :--- | :--- | :--- |
| text | str | Original input text |
| line_end_with_ellipsis_filter_label | int | Filter label (1 for pass, 0 for fail) |

### 📋 Example Input

```json
{"text": "This is a complete sentence without any issues."}
{"text": "This is incomplete...\nAnother line that ends with...\nAnd one more..."}
{"text": "First line is fine.\nSecond line is also good.\nThird line is complete too."}
```

### 📤 Example Output

```json
{"text": "This is a complete sentence without any issues.", "line_end_with_ellipsis_filter_label": 1}
{"text": "First line is fine.\nSecond line is also good.\nThird line is complete too.", "line_end_with_ellipsis_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Complete text)**:
- Total lines: 1
- Lines ending with ellipsis: 0
- Ellipsis line ratio: 0/1 = 0.0 (0%)
- **Passes filter** (< 0.3 threshold)

**Sample 2 (Many ellipses)**:
- Total lines: 3
- Lines ending with ellipsis: 3
- Ellipsis line ratio: 3/3 = 1.0 (100%)
- **Filtered out** (≥ 0.3 threshold)

**Sample 3 (No ellipsis)**:
- Total lines: 3
- Lines ending with ellipsis: 0
- Ellipsis line ratio: 0/3 = 0.0 (0%)
- **Passes filter** (< 0.3 threshold)

**Use Cases**:
- Filter incomplete expressions or unfinished text
- Remove low-quality content containing excessive ellipses
- Ensure text completeness and expression integrity

**Notes**:
- The operator detects two ellipsis formats: `...` and `…`
- Text is split by lines for detection
- Default threshold is 0.3, adjustable based on actual needs
