---
title: MeanWordLengthFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/meanwordlengthfilter/
---

## 📘 Overview

The `MeanWordLengthFilter` is an operator designed to filter text based on the average length of its words. It calculates the average word length for each text entry (total characters divided by the number of words) and keeps only those entries where the average falls within a specified minimum and maximum range.

## `__init__` function

```python
def __init__(self, min_length: float=3, max_length: float=10)
```

### `__init__` Parameters

| Parameter | Type | Default | Description |
| :---------- | :---- | :------ | :----------------------------------------------- |
| **min_length** | float | 3 | The minimum average word length required (inclusive). |
| **max_length** | float | 10 | The maximum average word length allowed (exclusive). |

### Prompt Template Descriptions

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='mean_word_length_filter_label')
```

#### Parameters

| Name | Type | Default | Description |
| :----------- | :---------------- | :------------------------------ | :------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be processed. |
| **output_key** | str | "mean_word_length_filter_label" | The name of the new column to store the filter result label (1 for pass). |

## 🧠 Example Usage

#### 🧾 Default Output Format

The operator filters the input DataFrame and adds a new column specified by `output_key`. Only the rows that pass the filter are retained in the output.

| Field | Type | Description |
| :------------------------------ | :--- | :-------------------------------------------------------------- |
| ... | ... | Original columns from the input data. |
| **[output_key]** | int | The label indicating the filter result. All rows in the output will have a value of 1. |
