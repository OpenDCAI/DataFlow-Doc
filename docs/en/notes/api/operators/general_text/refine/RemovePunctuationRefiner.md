---
title: RemovePunctuationRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removepunctuationrefiner/
---

## 📘 Overview
The `RemovePunctuationRefiner` is an operator designed to remove all punctuation symbols from a given text field.

## __init__ function
```python
def __init__(self)
```
### init parameter description
| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | No parameters required for initialization. |

### Prompt Template Descriptions

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
Executes the main logic of the operator. It reads a DataFrame from storage, removes punctuation from the text in the specified input column, and writes the modified DataFrame back to storage.
#### Parameters
| Name | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be processed. |

## 🧠 Example Usage

#### 🧾 Default Output Format
The operator modifies the specified `input_key` column in the DataFrame by removing punctuation. The output will have the same structure as the input, but with the text in the target column refined.

Example Input:
```json
{
"text_data": "Hello, world! This is a test sentence; let's see how it works."
}
```
Example Output (assuming `input_key`="text_data"):
```json
{
"text_data": "Hello world This is a test sentence lets see how it works"
}
```
