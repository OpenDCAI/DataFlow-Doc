---
title: NgramSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/ngramsampleevaluator/
---

## 📘 Overview

[NgramSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluator/sample/ngram_sample_evaluator.py) is a sample evaluator that evaluates text redundancy by calculating the n-gram repetition ratio. It measures text originality by comparing the ratio of unique n-grams to the total number of n-grams.

## __init__

```python
__init__(self, ngrams=5)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **ngrams** | int | 5 | Length of the n-grams to use for calculation. |

## Prompt Template Descriptions

## run

```python
run(self, storage: DataFlowStorage, input_key: str, output_key: str='NgramScore')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the column containing the text to be evaluated. |
| **output_key** | str | 'NgramScore' | The name of the column where the output score will be stored. |

## 🧠 Example Usage

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input data. |
| **NgramScore** | float | N-gram repetition ratio score (0-1, where a higher score indicates less repetition). |
