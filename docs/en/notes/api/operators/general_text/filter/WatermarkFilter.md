---
title: WatermarkFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/watermarkfilter/
---

# 📘 WatermarkFilter
The WatermarkFilter operator is designed to detect and remove text entries that contain specified watermark keywords.

## `__init__`
```python
def __init__(self, watermarks: list = ['Copyright', 'Watermark', 'Confidential'])
```
### init parameter description
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **watermarks** | list | ['Copyright', 'Watermark', 'Confidential'] | A list of watermark keywords to search for in the text. |

## Prompt Template Descriptions

## run
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'watermark_filter_label')
```
#### Parameters
| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be checked. |
| **output_key** | str | 'watermark_filter_label' | The name of the output column where the filter result (1 for valid, 0 for invalid) is stored. |

## 🧠 Example Usage

#### 🧾 Default output format (Output Format)
The operator adds a new column (specified by `output_key`) to the input data. The value in this column is `1` if no watermarks are found, and `0` otherwise. The operator then filters the data, returning only the rows where the value is `1`.

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_key* | str | The original input text. |
| *output_key* | int | `1` if the text does not contain any watermarks, `0` otherwise. The final output only contains rows where this value is `1`. |

Example Input DataFrame:
```json
[
    {"text": "This is a clean sentence."},
    {"text": "This text contains a Copyright notice."},
    {"text": "Another line of text, no issues here."},
    {"text": "Confidential information should not be shared."}
]
```
Example Output DataFrame (after filtering):
```json
[
    {"text": "This is a clean sentence.", "watermark_filter_label": 1},
    {"text": "Another line of text, no issues here.", "watermark_filter_label": 1}
]
```
