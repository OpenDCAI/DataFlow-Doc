---
title: InstagFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/filter/instagfilter/
---

## 📘 Overview

`InstagFilter` is a filtering operator based on `InstagScorer`. It uses a pre-trained Instag model to analyze instructions, returning the number of tags to evaluate content diversity. The filter range is controlled by `min_score` and `max_score` parameters, where more tags indicate greater content diversity.

## `__init__`

```python
def __init__(self, min_score=0.0, max_score=1.0, model_cache_dir='./dataflow_cache', device='cuda', max_new_tokens=1024)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 0.0 | The minimum score for an instruction to pass the filter. |
| **max_score** | float | 1.0 | The maximum score for an instruction to pass the filter. |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the pre-trained scorer model. |
| **device** | str | 'cuda' | The computing device to run the model on (e.g., 'cuda', 'cpu'). |
| **max_new_tokens** | int | 1024 | The maximum number of new tokens to generate during scoring. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`

```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', output_key: str = 'InstagScore')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_instruction_key** | str | 'instruction' | The column name for the input instructions to be scored. |
| **output_key** | str | 'InstagScore' | The column name for the generated score output. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original input fields. |
| InstagScore | float | The diversity score calculated by the Instag model. |
