---
title: LineWithJavascriptFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/linewithjavascriptfilter/
---

## 📘 Overview
The `LineWithJavascriptFilter` is an operator designed to identify and filter out text entries that contain references to "javascript". The filtering logic is based on the number of lines in the text and the number of occurrences of the keyword "javascript". A text entry is kept if it has 3 or fewer lines, or if the number of lines *not* containing "javascript" meets a specified threshold.

## `__init__` function
```python
def __init__(self, threshold: int=3)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | int | 3 | The minimum number of lines that must *not* contain "javascript" for a multi-line text (more than 3 lines) to pass the filter. |

## Prompt Template Descriptions
(Information not available)

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='line_with_javascript_filter_label')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading the input dataframe and writing the filtered output. |
| **input_key** | str | Required | The name of the column in the input dataframe that contains the text to be analyzed. |
| **output_key** | str | 'line_with_javascript_filter_label' | The name for the new column that will be added to the dataframe to store the filtering result (1 for pass, 0 for fail). |

## 🧠 Example Usage
(Information not available)

#### 🧾 Default Output Format (Output Format)
The operator filters the input dataframe and writes back only the rows that pass the filter. A new column (specified by `output_key`) is added, which will have a value of `1` for all rows in the output.

| Field | Type | Description |
| :--- | :--- | :--- |
| [input_key] | str | The original input text from the specified input column. |
| line_with_javascript_filter_label | int | The result of the filter check. All rows in the output will have this value set to `1`. |

**Example Input:**
A dataframe represented as a list of JSON objects.
```json
[
    {
        "text": "This is a short entry.\nIt only has two lines.\nIt passes the filter."
    },
    {
        "text": "This entry has four lines.\nThis line mentions javascript.\nThis line also mentions javascript.\nThis line is clean."
    },
    {
        "text": "This entry has five lines.\nLine 2 is clean.\nLine 3 is clean.\nLine 4 is clean.\nLine 5 is clean."
    }
]
```
**Example Output:**
The output dataframe stored will only contain the rows that passed the filter. (Note: The second entry from the input is filtered out because it has > 3 lines, but the number of lines without "javascript" (2) is less than the default threshold of 3).
```json
[
    {
        "text": "This is a short entry.\nIt only has two lines.\nIt passes the filter.",
        "line_with_javascript_filter_label": 1
    },
    {
        "text": "This entry has five lines.\nLine 2 is clean.\nLine 3 is clean.\nLine 4 is clean.\nLine 5 is clean.",
        "line_with_javascript_filter_label": 1
    }
]
```
