---
title: CurlyBracketFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/curlybracketfilter/
---

## 📘 Overview

`CurlyBracketFilter` is a data filtering operator that detects and filters out entries where curly brackets (`{}`) are used excessively in text. It determines whether to filter an entry by calculating the ratio of curly bracket count to total text length and comparing it with a preset threshold.

## `__init__` Function

```python
def __init__(self, threshold: float=0.025):
```

### Initialization Parameters

| Parameter Name | Type  | Default  | Description                                                         |
| :------------ | :---- | :------ | :----------------------------------------------------------- |
| **threshold** | float | 0.025   | Threshold for the ratio of curly bracket count to text length. Text rows exceeding this threshold will be filtered. |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='curly_bracket_filter_label'):
```

#### Parameters

| Name          | Type              | Default                       | Description                                                         |
| :------------ | :---------------- | :--------------------------- | :----------------------------------------------------------- |
| **storage**   | DataFlowStorage   | Required                         | DataFlow storage instance responsible for reading and writing data. |
| **input_key** | str               | Required                         | Input column name corresponding to the text field to be checked. |
| **output_key**| str               | 'curly_bracket_filter_label' | Output column name for storing the filter result label (1 means passed, 0 means failed). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import CurlyBracketFilter
from dataflow.utils.storage import FileStorage

class CurlyBracketFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/curly_bracket_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = CurlyBracketFilter(threshold=0.025)
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='curly_bracket_filter_label'
        )

if __name__ == "__main__":
    test = CurlyBracketFilterTest()
    test.forward()
```

## 🧾 Default Output Format

After operator execution, a new column specified by `output_key` is added to the DataFrame, and rows that failed the check are filtered out. The filtered DataFrame is written back to storage.

| Field                     | Type | Description                                             |
| :----------------------- | :--- | :----------------------------------------------- |
| text                     | str  | Original input text                                     |
| curly_bracket_filter_label | int  | Filter label, value of 1 means the data row passed the curly bracket ratio check |

### 📋 Sample Input

```json
{"text": "This is normal text without brackets."}
{"text": "Code snippet: {{variable}} and {another} {here} {too} {many} {brackets}"}
```

### 📤 Sample Output

```json
{"text": "This is normal text without brackets.", "curly_bracket_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Normal Text)**:
- Text: "This is normal text without brackets."
- Curly bracket count: 0
- Text length: 38
- Curly bracket ratio: 0/38 = 0.0
- **Passed filter** (≤ 0.025 threshold)

**Sample 2 (Contains Many Curly Brackets)**:
- Text: "Code snippet: {{variable}} and {another} {here} {too} {many} {brackets}"
- Curly bracket count: 12 (including left and right brackets)
- Text length: approximately 75
- Curly bracket ratio: 12/75 ≈ 0.16 (16%)
- **Failed filter** (> 0.025 threshold)

**Use Cases**:
- Filter code snippets or template text
- Identify and remove text containing many placeholders
- Clean template remnants from scraped data
- Improve purity of natural language text data

**Notes**:
- The operator calculates the ratio of curly bracket (`{` and `}`) count to text length
- Default threshold of 0.025 means curly bracket count should not exceed 2.5% of text length
- Both left and right curly brackets are counted in the total
- Threshold can be adjusted based on actual use cases
