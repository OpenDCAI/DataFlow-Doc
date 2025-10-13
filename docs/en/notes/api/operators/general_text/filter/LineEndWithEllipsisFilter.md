---
title: LineEndWithEllipsisFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/lineendwithellipsisfilter/
---

# 📘 Overview

The `LineEndWithEllipsisFilter` operator detects and filters text lines ending with ellipsis (...) or (……), commonly used to identify incomplete statements. It calculates the ratio of lines ending with an ellipsis to the total number of lines in a given text. If this ratio is below a specified threshold, the text is kept; otherwise, it is filtered out.

## `__init__`

```python
def __init__(self, threshold: float=0.3)
```

| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.3 | The maximum allowed ratio of lines ending with an ellipsis. Texts with a ratio below this threshold will be kept. |

## Prompt Template Descriptions

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'line_end_with_ellipsis_filter_label')
```

| Argument | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be analyzed. |
| **output_key** | str | 'line_end_with_ellipsis_filter_label' | The name of the output column where the filter label (1 for pass, 0 for fail) will be stored. |

## 🧠 Example Usage

## 🧾 Output Format

The operator adds a new column (specified by `output_key`) to the DataFrame, containing a label that indicates whether the text passed the filter. It then writes a new DataFrame to storage containing only the rows that passed the filter (where the label is 1).

| Field | Type | Description |
| :--- | :--- | :--- |
| *original_columns* | | The original columns from the input DataFrame are preserved. |
| **line_end_with_ellipsis_filter_label** | int | A label indicating the filter result. `1` means the text passed the filter (ratio < threshold), and `0` means it failed. |
