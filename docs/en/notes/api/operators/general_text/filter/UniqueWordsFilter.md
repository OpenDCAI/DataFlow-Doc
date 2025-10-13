---
title: UniqueWordsFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/uniquewordsfilter/
---

## 📘 Overview
The `UniqueWordsFilter` is an operator designed to filter text based on the ratio of unique words. It calculates the proportion of unique words to the total number of words in a given text and filters out entries that fall below a specified threshold.

## `__init__` function
```python
def __init__(self, threshold: float=0.1)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.1 | The minimum ratio of unique words required for a text to pass the filter. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use Case | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='unique_words_filter')
```
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be processed. |
| **output_key** | str | "unique_words_filter" | The name of the output column where the filter result (1 for pass, 0 for fail) will be stored. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator adds a new column (specified by `output_key`) to the input DataFrame. This column contains an integer value: `1` if the text passes the unique word ratio filter, and `0` otherwise. The original DataFrame is then filtered to retain only the rows that passed the check.

| Field | Type | Description |
| :--- | :--- | :--- |
| *[input_columns]* | any | Original columns from the input data. |
| **unique_words_filter** | int | The filter result. `1` if the unique word ratio is above the threshold, `0` otherwise. |

**Example Input:**
```json
{
"text": "The quick brown fox jumps over the lazy dog."
}
{
"text": "test test test test test."
}
```

**Example Output (assuming `threshold=0.5`):**
```json
{
"text": "The quick brown fox jumps over the lazy dog.",
"unique_words_filter": 1
}
```
