---
title: RemoveStopwordsRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removestopwordsrefiner/
---

## 📘 Overview

The `RemoveStopwordsRefiner` is an operator designed to remove English stopwords (e.g., high-frequency words with little meaning like "the", "is", "in") from text. It utilizes the NLTK library's stopwords corpus to filter out these words, thereby improving the feature density of the text for downstream tasks.

## __init__ function

```python
def __init__(self, model_cache_dir: str = './dataflow_cache')
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the NLTK stopwords data. |

## Prompt Template Descriptions

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be processed. |

## 🧠 Example Usage
