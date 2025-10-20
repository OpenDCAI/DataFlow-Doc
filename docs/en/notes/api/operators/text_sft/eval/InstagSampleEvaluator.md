---
title: InstagSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/eval/instagsampleevaluator/
---

## 📘 Overview InstagSampleEvaluator
The `InstagSampleEvaluator` is an operator designed to evaluate the content diversity and intention tags of instructions using the `OFA-Sys/InsTagger` model. It analyzes the instruction text to generate relevant tags. The number of tags serves as an indicator of content diversity.

## __init__
```python
def __init__(self, model_cache_dir='./dataflow_cache', device='cuda', max_new_tokens=1024, temperature=0, do_sample=False, num_return_sequences=1, return_dict_in_generate=True)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded model. |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda', 'cpu'). |
| **max_new_tokens** | int | 1024 | The maximum number of new tokens to generate. |
| **temperature** | float | 0 | The value used to modulate the next token probabilities. |
| **do_sample** | bool | False | Whether to use sampling; set to `False` for greedy decoding. |
| **num_return_sequences** | int | 1 | The number of sequences to return for each input. |
| **return_dict_in_generate** | bool | True | Whether to return a dictionary in the generation output. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Features |
| :--- | :--- | :--- | :--- |
| | | | |

## run
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', output_key: str = 'InstagScore')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_instruction_key** | str | 'instruction' | The name of the input column containing the instruction text. |
| **output_key** | str | 'InstagScore' | The name of the output column to store the generated scores. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator adds a new column to the input dataframe containing the calculated scores.

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_columns* | - | The original columns from the input data are preserved. |
| **InstagScore** | int | The calculated content diversity score (number of tags). The column name is determined by the `output_key` parameter. |
