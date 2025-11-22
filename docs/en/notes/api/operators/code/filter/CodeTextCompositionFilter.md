---
title: CodeTextCompositionFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/filter/codetextcompositionfilter/
---

## 📘 Overview

`CodeTextCompositionFilter` is an operator that filters code samples based on their character composition scores. It is designed to remove binary files, encrypted content, and other non-readable text to ensure data quality.

## `__init__`
```python
def __init__(self, min_score: float = 1.0, max_score: float = 1.0)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 1.0 | The minimum composition score for a sample to be kept. |
| **max_score** | float | 1.0 | The maximum composition score for a sample to be kept. |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'text_composition_filter_label')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text and language data. |
| **output_key** | str | 'text_composition_filter_label' | The name of the output column where the filter label (1 for pass, 0 for fail) will be stored. |

## 📖 Prompt Template Descriptions

## 🧠 Example Usage
```python

```

#### 🧾 Output Format
The operator filters the input DataFrame and adds a new column indicating the filter result.

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_fields* | - | The original fields from the input data. |
| *output_key* | int | A label indicating if the sample passed the filter (1). The default field name is `text_composition_filter_label`. |
