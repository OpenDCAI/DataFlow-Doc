---
title: CharNumberFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/charnumberfilter/
---

## 📘 Overview

The `CharNumberFilter` is an operator designed to filter text data based on the number of characters. It calculates the character count of a given text field after removing whitespace and retains only the rows where the count meets a specified minimum threshold.

## `__init__` function

```python
def __init__(self, threshold: int=100)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | int | 100 | The minimum number of characters (after stripping whitespace) required for the text to pass the filter. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='char_number_filter_label')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance used for reading the input DataFrame and writing the filtered result. |
| **input_key** | str | Required | The name of the column containing the text to be filtered. |
| **output_key** | str | "char_number_filter_label" | The name of the new column that will be added to store the filter result (1 for pass, 0 for fail) before filtering. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

The operator modifies the DataFrame in storage by filtering out rows that do not meet the character count threshold. The output DataFrame will only contain the rows that passed the filter. A new column is added to indicate the result before filtering.

| Field | Type | Description |
| :--- | :--- | :--- |
| *[input_key]* | str | The original input text from the specified input column. |
| *[other_columns]* | any | Other columns from the original DataFrame are preserved. |
| *[output_key]* | int | The result of the filter check. In the final output DataFrame, this value will always be 1. |
