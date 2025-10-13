---
title: AlphaWordsFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/alphawordsfilter/
---

# 📘 `AlphaWordsFilter`

`AlphaWordsFilter` is an operator designed to filter text data based on the proportion of alphabetic words. It calculates the ratio of words containing at least one letter to the total number of words in a given text. If this ratio exceeds a specified threshold, the text is retained; otherwise, it is filtered out. The operator supports two modes for word tokenization: using the NLTK library for more accurate linguistic tokenization or a simple split by whitespace for faster processing.

## `__init__`

```python
def __init__(self, threshold: float, use_tokenizer: bool):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | float | Required | The minimum ratio of alphabetic words required for the text to pass the filter. |
| **use_tokenizer** | bool | Required | If `True`, uses the NLTK tokenizer. If `False`, splits text by whitespace. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='alpha_words_filter_label'):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance used for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be filtered. |
| **output_key** | str | 'alpha_words_filter_label' | The name of the output column where the filter result (1 for pass, 0 for fail) is stored. |

## 🧠 Example Usage

```python
# Example Usage information is not available.
```

#### 🧾 Output Format

The operator adds a new column (specified by `output_key`) to the input data, containing a binary label (1 if the text passes the filter, 0 otherwise). It then returns a DataFrame containing only the rows that passed the filter.

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_fields* | - | All original fields from the input data are preserved. |
| `alpha_words_filter_label` | int | The result of the filter check: 1 indicates the text passed, 0 indicates it failed. The final output only contains rows where this value is 1. |

**Example Input:**

```json
{
    "text": "This is a sample sentence with 9 words."
}
```

**Example Output (assuming it passes a threshold):**

```json
{
    "text": "This is a sample sentence with 9 words.",
    "alpha_words_filter_label": 1
}
```
