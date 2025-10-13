---
title: CapitalWordsFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/capitalwordsfilter/
---

## 📘 CapitalWordsFilter
The CapitalWordsFilter is an operator designed to filter text data by checking if the ratio of capitalized words exceeds a specified threshold. It supports an optional tokenizer for more accurate word splitting.

## `__init__`
```python
def __init__(self, threshold: float=0.2, use_tokenizer: bool=False)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.2 | The threshold for the ratio of capitalized words. Rows with a ratio above this value will be filtered out. |
| **use_tokenizer** | bool | False | If True, uses a tokenizer to split text into words. If False, splits by whitespace. |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='capital_words_filter')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading the input DataFrame and writing the filtered result. |
| **input_key** | str | Required | The column name in the input DataFrame that contains the text to be analyzed. |
| **output_key** | str | 'capital_words_filter' | The name of the new column added to the DataFrame, which stores the filter result (1 for pass, 0 for fail). |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator filters the input DataFrame and writes the result back to storage. It adds a new column (specified by `output_key`) containing the filter check result (1 if the text passes the filter, 0 otherwise) and only retains the rows that passed the filter.

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_key* | str | The original input text. |
| *output_key* | int | The result of the filter check. The output DataFrame only contains rows where this value is 1. |

**Example Input (a row in the input DataFrame):**
```json
{
    "text": "This is a sentence with one CAPITAL word."
}
```
**Example Output (the corresponding row in the filtered DataFrame):**
```json
{
    "text": "This is a sentence with one CAPITAL word.",
    "capital_words_filter": 1
}
```
