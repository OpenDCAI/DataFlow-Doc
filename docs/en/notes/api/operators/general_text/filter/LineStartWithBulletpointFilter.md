---
title: LineStartWithBulletpointFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/linestartwithbulletpointfilter/
---

## 📘 Overview

`LineStartWithBulletpointFilter` is a text filtering operator that detects and filters content where lines starting with bullet points (such as `•`, `*`, `-`, etc.) account for a high proportion of text. It determines whether to retain the text by calculating the ratio of bullet point lines and comparing it with the set threshold.

## __init__ Function

```python
def __init__(self, threshold: float=0.9)
```

### Init Parameters

| Parameter | Type | Default | Description |
| :---------- | :---- | :------ | :----------------------------------------------------------- |
| **threshold** | float | 0.9 | Bullet point line ratio threshold. If the proportion of bullet point lines exceeds this value, the data entry will be filtered. |

## run Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='line_start_with_bullet_point_filter_label')
```

### Run Parameters

| Name | Type | Default | Description |
| :----------- | :---------------- | :------------------------------------------- | :------------------------------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field to check. |
| **output_key** | str | "line_start_with_bullet_point_filter_label" | Output column name for storing filter result labels (1 for pass, 0 for fail). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import LineStartWithBulletpointFilter
from dataflow.utils.storage import FileStorage

class LineStartWithBulletpointFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/line_start_with_bulletpoint_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = LineStartWithBulletpointFilter(
            threshold=0.9
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='line_start_with_bullet_point_filter_label'
        )

if __name__ == "__main__":
    test = LineStartWithBulletpointFilterTest()
    test.forward()
```

## 🧾 Default Output Format

The operator adds a new column specified by `output_key` to the DataFrame for storing filter labels. The final DataFrame written to storage contains only data that passes filtering (i.e., rows where `output_key` column value is 1).

| Field | Type | Description |
| :------------------------------------------- | :--- | :------------------------------------------------------------------- |
| text | str | Original input text field. |
| **line_start_with_bullet_point_filter_label** | int | Filter result label (1 for pass, 0 for fail). |

### 📋 Example Input

```json
{"text": "This is normal text without any bullet points. It should pass the filter."}
{"text": "• First item\n• Second item\n• Third item\n• Fourth item\n• Fifth item"}
{"text": "Normal paragraph here.\n• One bullet point\nAnother normal line."}
```

### 📤 Example Output

```json
{"text": "This is normal text without any bullet points. It should pass the filter.", "line_start_with_bullet_point_filter_label": 1}
{"text": "Normal paragraph here.\n• One bullet point\nAnother normal line.", "line_start_with_bullet_point_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (No bullet points)**:
- Total lines: 1
- Lines starting with bullet points: 0
- Bullet point line ratio: 0/1 = 0.0 (0%)
- **Passes filter** (≤ 0.9 threshold)

**Sample 2 (All bullet points)**:
- Total lines: 5
- Lines starting with bullet points: 5
- Bullet point line ratio: 5/5 = 1.0 (100%)
- **Filtered out** (> 0.9 threshold)

**Sample 3 (Few bullet points)**:
- Total lines: 3
- Lines starting with bullet points: 1
- Bullet point line ratio: 1/3 ≈ 0.33 (33%)
- **Passes filter** (≤ 0.9 threshold)

**Use Cases**:
- Filter low-quality content presented as lists
- Remove text primarily composed of bullet points
- Ensure text consists of complete paragraphs rather than simple lists

**Notes**:
- The operator detects various bullet points: `•`, `‣`, `▶`, `▷`, `◆`, `■`, `□`, etc.
- Default threshold is 0.9, meaning if more than 90% of lines start with bullet points, it will be filtered
- Suitable for filtering text mainly composed of list items
