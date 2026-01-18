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
from dataflow.operators.text_pt.eval import PerplexitySampleEvaluator
from dataflow.utils.storage import FileStorage

# Prepare data and storage
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# Initialize and run the operator
perplexity_evaluator = PerplexitySampleEvaluator(model_name='gpt2')
perplexity_evaluator.run(
    storage.step(),
    input_key='raw_content',
    output_key='PerplexityScore'
)
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input data. |
| PerplexityScore | float | The calculated perplexity score for the input text. Lower is better. |

**Example Input:**

```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios..."
}
```

**Example Output:**

```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios...",
  "PerplexityScore": 49.2016410828
}
```
