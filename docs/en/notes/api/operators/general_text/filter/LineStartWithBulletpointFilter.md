---
title: LineStartWithBulletpointFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/linestartwithbulletpointfilter/
---

## 📘 Overview

The `LineStartWithBulletpointFilter` operator is designed to detect and filter text where a significant portion of lines begin with bullet point symbols. It operates by calculating the ratio of lines starting with predefined bullet characters (e.g., '•', '*', '-') within a given text. If this ratio exceeds a specified threshold, the entire text entry is filtered out. This is useful for cleaning datasets by removing lists, outlines, or improperly formatted text.

## `__init__` function

```python
def __init__(self, threshold: float=0.9)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.9 | The maximum allowed ratio of bulleted lines. If the ratio of lines starting with a bullet point exceeds this threshold, the text will be filtered out. |

## Prompt Template Descriptions

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='line_start_with_bullet_point_filter_label')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading the input dataframe and writing the filtered output. |
| **input_key** | str | Required | The name of the column in the dataframe that contains the text to be processed. |
| **output_key**| str | 'line_start_with_bullet_point_filter_label' | The name for the new column that stores the filter result (1 for pass, 0 for fail). |

## 🧠 Example Usage

#### 🧾 Default Output Format

The operator returns a filtered dataframe. It adds a new column (named by `output_key`) containing a binary label (1 for pass, 0 for fail) and keeps only the rows that passed the filter (i.e., rows where the label is 1).

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input dataframe. |
| line_start_with_bullet_point_filter_label | int | A binary label indicating the filter result. The output dataframe only contains rows where this value is 1. |
