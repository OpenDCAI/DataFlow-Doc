---
title: BertSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/bertsampleevaluator/
---

## 📘 Overview

The `BertSampleEvaluator` is an operator designed to evaluate the similarity between generated text and reference text using BERTScore. It leverages contextual embeddings from BERT-based models to compute precision, recall, and F1 scores, providing a semantic-level assessment of text quality.

## __init__

```python
def __init__(self, lang='en', model_cache_dir='./dataflow_cache')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **lang** | str | 'en' | The language of the text to be evaluated (e.g., 'en', 'zh'). |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded BERT model. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run

```python
def run(self, storage: DataFlowStorage, input_key: str, reference_key: str, output_key: str='BertScore')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The column name corresponding to the generated text field. |
| **reference_key** | str | Required | The column name corresponding to the reference text field. |
| **output_key** | str | 'BertScore' | The column name for the output score field. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| ... (original fields) | - | The original fields from the input data. |
| BertScore | float | The calculated F1 similarity score between the generated and reference text. |
