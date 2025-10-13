---
title: RemoveNumberRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removenumberrefiner/
---

## 📘 Overview
The `RemoveNumberRefiner` is an operator designed to remove all numeric characters (0-9) from a specified text field within a dataset. It processes each text entry, filters out digits, and updates the dataset with the refined text. This is useful for cleaning textual data where numbers are irrelevant.

## `__init__` function
```python
def __init__(self)
```
This operator does not require any parameters during initialization.

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- |:--- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
Executes the main logic of the operator. It reads a DataFrame from storage, removes numeric characters from the specified input column, and writes the modified DataFrame back to storage.

#### Parameters
| Name | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be processed. |

## 🧠 Example Usage
```python

```

#### 🧾 Output Format
The operator modifies the input DataFrame by cleaning the text in the column specified by `input_key`. The structure of the DataFrame remains the same.

| Field | Type | Description |
| :-------------- | :---- | :---------- |
| *input_key* | str | The original input text with all numeric characters removed. |
| *other_fields* | any | Other fields from the input data remain unchanged. |

**Example Input:**
```json
{
"id": 123,
"text_to_clean": "This is version 2.0, released in 2024."
}
```
**Example Output (assuming `input_key` is "text_to_clean"):**
```json
{
"id": 123,
"text_to_clean": "This is version ., released in ."
}
```
