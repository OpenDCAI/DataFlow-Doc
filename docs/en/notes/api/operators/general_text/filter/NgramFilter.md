---
title: NgramFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/ngramfilter/
---

## 📘 Overview

[NgramFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/ngram_filter.py) is an operator designed to filter data based on scores from an NgramScorer. It evaluates text redundancy by calculating the n-gram repetition ratio; a higher score indicates lower repetition and thus less text redundancy. This is useful for cleaning datasets by removing overly repetitive or redundant text entries.

## `__init__`

```python
__init__(self, min_score=0.8, max_score=1, ngrams=5)
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 0.8 | The minimum n-gram score threshold for a record to be kept. |
| **max_score** | float | 1 | The maximum n-gram score threshold for a record to be kept. |
| **ngrams** | int | 5 | The value of 'n' for n-gram calculation. |

## `run`

```python
run(self, storage: DataFlowStorage, input_key: str, output_key: str='NgramScore')
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The column name of the text to be scored. |
| **output_key** | str | 'NgramScore' | The column name where the calculated N-gram score will be stored. |

## 🧠 Example Usage

## 🧾 Default Output Format (Output Format)

The operator filters the input DataFrame and adds a new column containing the N-gram score. Only rows where the score is within the `[min_score, max_score]` range are retained.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | | Original columns from the input data. |
| `[output_key]` | float | The calculated N-gram score for the text in the `input_key` column. |

**Example Input:**
```json
{
"text":"This is a sample sentence that has some repeated words. This is a sample sentence."
}
```
**Example Output (before filtering):**
The score is first calculated and added as a new column.
```json
{
"text":"This is a sample sentence that has some repeated words. This is a sample sentence.",
"NgramScore": 0.75
}
```
*Note: If `min_score` is 0.8 (the default), this entry would be filtered out from the final output.*
