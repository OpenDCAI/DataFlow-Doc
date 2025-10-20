---
title: PerplexitySampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/eval/perplexitysampleevaluator/
---

## 📘 Overview

The `PerplexitySampleEvaluator` is an operator designed to calculate the perplexity of a given text using a Hugging Face language model. Perplexity is a measurement of how well a probability model predicts a sample; in natural language processing, a lower perplexity score indicates that the text is more fluent and understandable according to the model.

## `__init__` function

```python
def __init__(self, model_name: str = 'gpt2', device='cuda')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **model_name** | str | 'gpt2' | The path or name of the Hugging Face model to be used for calculation. |
| **device** | str | 'cuda' | The device on which the model will run (e.g., 'cuda' or 'cpu'). |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str = 'raw_content', output_key: str = 'PerplexityScore')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | 'raw_content' | The name of the input column containing the text to be evaluated. |
| **output_key** | str | 'PerplexityScore' | The name of the output column where the calculated perplexity score will be stored. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| raw_content | str | The input text. |
| PerplexityScore | float | The calculated perplexity score for the input text. Lower is better. |

**Example Input:**

```json
{
  "raw_content": "The quick brown fox jumps over the lazy dog."
}
```

**Example Output:**

```json
{
  "raw_content": "The quick brown fox jumps over the lazy dog.",
  "PerplexityScore": 35.82
}
```
