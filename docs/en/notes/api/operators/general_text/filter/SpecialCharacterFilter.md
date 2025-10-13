---
title: SpecialCharacterFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/specialcharacterfilter/
---

## 📘 Overview
The `SpecialCharacterFilter` operator is used to remove text that contains special or unicode characters. It uses a predefined set of regular expression patterns to detect non-standard characters to ensure text normalization.

## `__init__` function
```python
def __init__(self)
```
This operator does not require any parameters during initialization.

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='special_character_filter_label')
```
Executes the main logic of the operator, reading a DataFrame from storage, filtering out rows with special characters, and writing the result back to storage.

#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be filtered. |
| **output_key** | str | "special_character_filter_label" | The name of the output column that stores the filter result (1 for valid text, 0 for invalid). |

## Prompt Template Descriptions
<br>

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator adds a new column (specified by `output_key`) to the input DataFrame and filters out the rows that contain special characters. Only the rows that pass the filter are written to the output.

| Field | Type | Description |
| :-------------- | :---- | :---------- |
| [input_key] | str | The original input text. |
| [output_key] | int | A label indicating the text passed the filter. This value will always be `1` in the output data. |

Example Input:
```json
{"text": "This is a valid sentence."}
{"text": "This contains a special character u200e."}
```
Example Output:
```json
{
"text": "This is a valid sentence.",
"special_character_filter_label": 1
}
```
