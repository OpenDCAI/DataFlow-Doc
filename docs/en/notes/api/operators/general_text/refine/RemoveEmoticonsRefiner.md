---
title: RemoveEmoticonsRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removeemoticonsrefiner/
---

## 📘 RemoveEmoticonsRefiner

The `RemoveEmoticonsRefiner` is an operator designed to remove text-based emoticons (e.g., `:-)` , `:D`) from text data. It operates by matching and replacing emoticons based on a predefined dictionary, effectively cleaning the text for further processing.

## \_\_init\_\_ function

```python
def __init__(self)
```

### init parameters

| Parameter | Type | Default | Description |
| :-------- | :--- | :------ | :--------------------------------------------------------------------- |
| *None*    | -    | -       | This operator does not require any parameters during its initialization. |

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name        | Type            | Default  | Description                                              |
| :---------- | :-------------- | :------- | :------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str             | Required | The name of the input column containing the text to be processed. |

## 🧠 Example Usage

## 🧾 Default output format（Output Format）

The operator modifies the data in the column specified by `input_key` by removing text-based emoticons. Other columns remain unchanged.

| Field     | Type | Description                                  |
| :-------- | :--- | :------------------------------------------- |
| input_key | str  | The original text with emoticons removed. |

**Example Input:**

```json
{
  "text": "That's a great idea! :D Let's do it :-)."
}
```

**Example Output:**

```json
{
  "text": "That's a great idea!  Let's do it ."
}
```
