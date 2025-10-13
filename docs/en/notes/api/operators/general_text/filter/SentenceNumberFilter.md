---
title: SentenceNumberFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/sentencenumberfilter/
---

## 📘 Overview

**SentenceNumberFilter** is an operator designed to filter text based on whether the number of sentences it contains falls within a specified range. It uses regular expressions to identify and count sentences based on common sentence-ending punctuation.

## `__init__` function

```python
def __init__(self, min_sentences: int=3, max_sentences: int=7500)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_sentences** | int | 3 | The minimum number of sentences required for a text to pass the filter. |
| **max_sentences** | int | 7500 | The maximum number of sentences allowed for a text to pass the filter. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'sentence_number_filter_label')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing the dataframe. |
| **input_key** | str | Required | The name of the input column containing the text to be analyzed. |
| **output_key** | str | "sentence_number_filter_label" | The name of the new column where the filter result (1 for pass, 0 for fail) is stored before filtering. |

## 🧠 Example Usage

```python

```

#### 🧾 Output Format

The operator adds a new column (specified by `output_key`) to the dataframe, which contains a boolean flag (1 for pass, 0 for fail). It then filters the dataframe, and the final output stored in the storage contains only the rows that passed the filter (i.e., where the `output_key` column has a value of 1).

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_key* | str | The original input text. |
| *output_key* | int | A value of 1, indicating the row passed the sentence count filter. |

**Example Input Data (in storage):**
```json
{"text": "This is a single sentence. It will not pass the default filter."}
{"text": "This is the first sentence. Here is the second sentence. And finally, the third sentence. This text should pass."}
```
**Example Output Data (in storage, with default `__init__` settings):**
```json
{"text": "This is the first sentence. Here is the second sentence. And finally, the third sentence. This text should pass.", "sentence_number_filter_label": 1}
```
