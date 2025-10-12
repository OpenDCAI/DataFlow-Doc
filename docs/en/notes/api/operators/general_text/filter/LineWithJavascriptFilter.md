---
title: LineWithJavascriptFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/linewithjavascriptfilter/
---

## 📘 Overview

`LineWithJavascriptFilter` identifies and filters text lines containing 'javascript' references. It determines whether to retain the data entry by checking if the number of lines without the "javascript" keyword reaches the specified threshold.

## __init__ Function

```python
def __init__(self, threshold: int=3)
```

### Init Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | int | 3 | An integer threshold. If the number of lines without "javascript" is greater than or equal to this threshold, the text is considered valid. |

## run Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='line_with_javascript_filter_label')
```

#### Parameters

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to filter. |
| **output_key** | str | 'line_with_javascript_filter_label' | Output column name for storing filter result labels (1 for pass, 0 for filtered out). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import LineWithJavascriptFilter
from dataflow.utils.storage import FileStorage

class LineWithJavascriptFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/line_with_javascript_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = LineWithJavascriptFilter(
            threshold=3
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='line_with_javascript_filter_label'
        )

if __name__ == "__main__":
    test = LineWithJavascriptFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| text | str | Original input text field. |
| line_with_javascript_filter_label | int | Filter label (1 for pass, 0 for filtered out). |

### 📋 Example Input

```json
{"text": "This is a normal text without any JavaScript references."}
{"text": "Line 1: javascript code here\nLine 2: more javascript\nLine 3: javascript again\nLine 4: and javascript"}
{"text": "First line is fine.\nSecond line mentions javascript.\nThird line is ok.\nFourth line is also fine."}
```

### 📤 Example Output

```json
{"text": "This is a normal text without any JavaScript references.", "line_with_javascript_filter_label": 1}
{"text": "First line is fine.\nSecond line mentions javascript.\nThird line is ok.\nFourth line is also fine.", "line_with_javascript_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (No JavaScript)**:
- Total lines: 1
- Lines without "javascript": 1
- **Passes filter** (≥ 3 threshold or total lines ≤ 3)

**Sample 2 (Many JavaScript)**:
- Total lines: 4
- Lines without "javascript": 0
- **Filtered out** (< 3 threshold and total lines > 3)

**Sample 3 (Few JavaScript)**:
- Total lines: 4
- Lines without "javascript": 3
- **Passes filter** (≥ 3 threshold)

**Use Cases**:
- Filter text containing excessive JavaScript code or references
- Remove code snippets from technical documentation
- Ensure content purity

**Notes**:
- The operator is case-insensitive for the "javascript" keyword
- If total lines ≤ 3, automatically passes
- If lines without "javascript" ≥ threshold, passes
- Default threshold is 3, adjustable based on actual needs
