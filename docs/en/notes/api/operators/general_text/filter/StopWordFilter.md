---
title: StopWordFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/stopwordfilter/
---

## 📘 Overview
The `StopWordFilter` operator filters text based on the proportion of stop words. It identifies and retains text entries where the ratio of stop words exceeds a specified threshold. This operator utilizes the NLTK library for tokenization and stop word recognition.

## __init__
```python
def __init__(self, threshold: float, use_tokenizer: bool)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | float | Required | The minimum ratio of stop words for a text to be kept. |
| **use_tokenizer**| bool | Required | If `True`, uses NLTK's tokenizer; otherwise, splits text by whitespace. |

## Prompt Template Descriptions



## run
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='stop_word_filter_label')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be filtered. |
| **output_key** | str | "stop_word_filter_label" | The name of the output column where the filter result (1 for kept, 0 for discarded) is stored. |

## 🧠 Example Usage



#### 🧾 Default Output Format (Output Format)
The operator adds a new column (specified by `output_key`) to the input data and then filters the rows. The final output written to storage contains the original columns plus the new output column, but only for the rows that passed the filter (i.e., where the stop word ratio was greater than the threshold).

| Field | Type | Description |
| :--- | :--- | :--- |
| *[original_fields]* | any | The original fields from the input data are preserved. |
| **stop_word_filter_label** | int | A label indicating the filter result. The value is `1` for rows that are kept. |

**Example Input:**
```json
{
    "text": "this is an article about the fundamentals of machine learning"
}
```

**Example Output (assuming it passes a filter with `threshold=0.4`):**
```json
{
    "text": "this is an article about the fundamentals of machine learning",
    "stop_word_filter_label": 1
}
```
