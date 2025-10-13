---
title: RemoveContractionsRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removecontractionsrefiner/
---
# 📘 Overview

The `RemoveContractionsRefiner` is a refiner operator designed to expand English contractions within a text. It converts abbreviated forms into their full, unabbreviated equivalents (e.g., transforming "can't" to "cannot"). This process helps to standardize the text, which can be beneficial for subsequent natural language processing tasks. It utilizes the `contractions` library to perform the expansion.

## __init__ function

```python
def __init__(self)
```

### init Parameters

| Parameter | Type | Default Value | Description |
| :-------- | :--- | :------------ | :---------- |
| *N/A*     | *N/A*| *N/A*         | This operator does not require any initialization parameters. |

## Prompt Template Descriptions

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

### Parameters

| Name        | Type              | Default Value | Description                                                    |
| :---------- | :---------------- | :------------ | :------------------------------------------------------------- |
| **storage** | DataFlowStorage   | Required      | The DataFlow storage instance used for reading and writing data. |
| **input_key** | str               | Required      | The name of the input column that contains the text to refine.   |

## 🧠 Example Usage

```python
```

#### 🧾 Default Output Format (Output Format)

The operator modifies the column specified by `input_key` in place, expanding any contractions found in the text.

| Field       | Type | Description                                   |
| :---------- | :--- | :-------------------------------------------- |
| [input_key] | str  | The input text with all contractions expanded. |

**Example Input:**

```json
{
  "text": "I can't go to the party because I'm feeling sick. He'll be there, though."
}
```

**Example Output:**

```json
{
  "text": "I cannot go to the party because I am feeling sick. He will be there, though."
}
```
