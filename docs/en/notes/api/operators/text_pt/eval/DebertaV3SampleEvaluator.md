---
title: DebertaV3SampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/eval/debertav3sampleevaluator/
---

## 📘 Overview

The `DebertaV3SampleEvaluator` is a text quality classifier based on the Nvidia Deberta V3 model. It is used to evaluate the quality of a given text and return a classification result.

## `__init__`
```python
def __init__(self, model_name, model_cache_dir='./dataflow_cache', device='cuda')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **model_name** | str | Required | The name of the pretrained model to use. |
| **model_cache_dir** | str | './dataflow_cache' | The directory where the model is cached. |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda', 'cpu'). |

## Prompt Template Descriptions

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='Debertav3Score')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be evaluated. |
| **output_key** | str | 'Debertav3Score' | The name of the output column to store the classification result. |

## 🧠 Example Usage

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | any | Original columns from the input DataFrame. |
| Debertav3Score | str | The quality classification result from the model. The actual column name is determined by the `output_key`. |
