---
title: CodeLengthSampleFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/filter/codelengthsamplefilter/
---

## 📘 Overview
`CodeLengthSampleFilter` is a code filtering operator designed to remove samples based on their length characteristics. It utilizes the `CodeLengthSampleEvaluator` to score code snippets and filters out those that are either too long or poorly formatted, ensuring data quality for subsequent processing steps.

## __init__
```python
def __init__(self, min_score: float = 1.0, max_score: float = 1.0)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 1.0 | The minimum score a code sample must have to pass the filter. |
| **max_score** | float | 1.0 | The maximum score a code sample can have to pass the filter. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'length_filter_label')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance used for reading and writing dataframes. |
| **input_key** | str | Required | The name of the input column in the dataframe that contains the code data to be evaluated. |
| **output_key** | str | 'length_filter_label' | The name of the output column where the filter result (1 for pass, 0 for fail) will be stored. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator adds a new column to the dataframe, specified by `output_key`, which indicates whether the sample passed the filter. It also adds several columns with scoring metrics from the evaluator before returning a new dataframe containing only the rows that passed.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | | Original columns from the input dataframe. |
| **length_filter_label** | int | The result of the filter. `1` if the code sample is within the specified score range, `0` otherwise. The column name is determined by the `output_key` parameter. |
