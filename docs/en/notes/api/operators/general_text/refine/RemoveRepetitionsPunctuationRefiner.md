---
title: RemoveRepetitionsPunctuationRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removerepetitionspunctuationrefiner/
---

## 📘 Overview
The `RemoveRepetitionsPunctuationRefiner` is an operator designed to clean text by removing consecutive repeated punctuation marks. For example, it transforms "!!!" into "!" and ",," into ",". It uses regular expressions to identify and replace sequences of identical punctuation characters with a single instance.

## `__init__`
```python
def __init__(self)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | This operator does not require any initialization parameters. |

## Prompt Template Descriptions


## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
| Parameter | Type | Default | Description |
| :------------- | :---------------- | :--- | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the column containing the text to be processed. |

## 🧠 Example Usage


#### 🧾 Default Output Format (Output Format)
The operator modifies the specified `input_key` column in place within the DataFrame.

| Field | Type | Description |
| :--- | :--- | :--- |
| `[input_key]` | str | The text after removing repeated punctuation. The field name matches the `input_key` parameter. |

**Example Input:**
```json
{
"text_to_clean": "This is great!!! I am so excited?? Also,, this is a test..."
}
```
**Example Output:**
```json
{
"text_to_clean": "This is great! I am so excited? Also, this is a test."
}
```
