---
title: LowercaseRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/lowercaserefiner/
---

## 📘 LowercaseRefiner
`LowercaseRefiner` is a refiner operator that converts all uppercase characters in a specified text field to lowercase, unifying the text format.

## `__init__`
```python
def __init__(self)
```
### init parameters
This operator does not require any parameters during initialization.

### Prompt Template Descriptions

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name          | Type              | Default Value | Description                                                                 |
| :------------ | :---------------- | :------------ | :-------------------------------------------------------------------------- |
| **storage**   | DataFlowStorage   | Required      | Data flow storage instance, responsible for reading and writing data.       |
| **input_key** | str               | Required      | The name of the input column whose text content will be converted to lowercase. |

## 🧠 Example Usage

#### 🧾 Default Output Format (Output Format)
The operator modifies the specified `input_key` column in the DataFrame by converting its text to lowercase. Other columns remain unchanged.

| Field             | Type | Description                                                      |
| :---------------- | :--- | :--------------------------------------------------------------- |
| {any other field} | any  | Other fields from the input data are preserved.                  |
| {input\_key}      | str  | The original text from the input key field, now in all lowercase. |

**Example Input:**
(Assuming `input_key="text"`)
```json
{
  "id": 1,
  "text": "This is an EXAMPLE of Mixed-Case TEXT."
}
```
**Example Output:**
```json
{
  "id": 1,
  "text": "this is an example of mixed-case text."
}
```
