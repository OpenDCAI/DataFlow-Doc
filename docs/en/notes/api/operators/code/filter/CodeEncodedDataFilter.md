---
title: CodeEncodedDataFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/filter/codeencodeddatafilter/
---

## 📘 Overview
[CodeEncodedDataFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/code_encoded_data_filter.py) filters code samples based on encoded data patterns using `CodeEncodedDataSampleEvaluator` scores. It is designed to remove content that appears to be binary or auto-generated, such as Base64 strings, hexadecimal data, or long Unicode escape sequences.

## __init__ function
```python
def __init__(self, min_score: float = 1.0, max_score: float = 1.0)
```
### init parameter descriptions
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 1.0 | The minimum score for a sample to be kept. |
| **max_score** | float | 1.0 | The maximum score for a sample to be kept. |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = "encoded_data_filter_label")
```
Executes the data filtering logic. It reads a DataFrame from storage, calculates encoded data scores for the specified input column, and filters rows based on the `min_score` and `max_score` thresholds.

#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the code text to evaluate. |
| **output_key** | str | "encoded_data_filter_label" | The name of the output column where the filter result (1 for pass, 0 for fail) will be stored. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format (Output Format)
The operator adds a new column to the DataFrame, indicated by `output_key`, which contains a binary label (1 for pass, 0 for fail). It also adds columns for the calculated scores. The DataFrame is then filtered, retaining only the rows that pass the filter.

| Field | Type | Description |
| :--- | :---- | :--- |
| ... | | Original columns from the input data. |
| **CodeEncodedDataScore** | float | A comprehensive score from 0-1, where 1 indicates the sample passes all checks. |
| **encoded_data_filter_label** | int | The filter result: 1 if the `CodeEncodedDataScore` is within the `[min_score, max_score]` range, 0 otherwise. |

**Example Input:**
```json
{
"text":"import base64; s = 'aGVsbG8gd29ybGQ='; print(base64.b64decode(s))"
}
```
**Example Output:**
```json
{
"text":"import base64; s = 'aGVsbG8gd29ybGQ='; print(base64.b64decode(s))",
"Base64Ratio": 0.15,
"HexRatio": 0.0,
"UnicodeEscapeRatio": 0.0,
"CodeEncodedDataScore": 0.0,
"encoded_data_filter_label": 0
}
```
