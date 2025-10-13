---
title: CurlyBracketFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/curlybracketfilter/
---

## 📘 Overview
The `CurlyBracketFilter` is an operator designed to filter text data by identifying and removing entries with an excessive number of curly brackets. It calculates the ratio of curly brackets to the total text length and discards rows where this ratio exceeds a specified threshold.

## `__init__` function
```python
def __init__(self, threshold: float=0.025)
```
### init Parameters
| Parameter | Type | Default | Description |
| :---------- | :---- | :------- | :----------- |
| **threshold** | float | 0.025 | The threshold for the ratio of curly brackets to text length. If the ratio is above this value, the text is filtered out. |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='curly_bracket_filter_label')
```
#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance for reading and writing data. |
| **input_key** | str | Required | The name of the column in the input DataFrame that contains the text to be processed. |
| **output_key** | str | 'curly_bracket_filter_label' | The name of the new column that will be added to the DataFrame, containing the filter result (1 for pass, 0 for fail). |

## Prompt Template Descriptions

## 🧠 Example Usage

#### 🧾 Default Output Format (Output Format)
The output is a filtered DataFrame that only includes the rows that passed the filter check. A new column, specified by `output_key`, is added to show the result (always 1 in the final output).

| Field | Type | Description |
| :----------------------------- | :---- | :------------------------------------------------------ |
| [input_key] | str | The original input text from the specified input column. |
| [output_key] | int | The filter label. The output only contains rows where this value is 1. |

Example Input (a row in the input DataFrame):
```json
{
"text":"This is a valid sentence."
}
```
Example Output (a row in the output DataFrame):
```json
{
"text":"This is a valid sentence.",
"curly_bracket_filter_label": 1
}
```
