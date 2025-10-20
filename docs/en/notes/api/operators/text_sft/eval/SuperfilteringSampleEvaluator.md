---
title: SuperfilteringSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/eval/superfilteringsampleevaluator/
---

## 📘 Overview
The `SuperfilteringSampleEvaluator` is an operator that evaluates the difficulty of following instructions using the Superfiltering method. It calculates the ratio of conditional perplexity to independent perplexity based on the GPT-2 model. Higher scores indicate greater difficulty in following the instruction. This method assesses instruction clarity and follow difficulty by comparing response perplexity under instruction conditions with independent response perplexity.

## `__init__`
```python
__init__(self, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda' or 'cpu'). |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded Hugging Face model. |
| **max_length** | int | 512 | The maximum sequence length for the tokenizer and model. |

### Prompt Template Descriptions

## `run`
```python
run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_input_key: str = None, input_output_key: str = 'output', output_key: str = 'SuperfilteringScore')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading from and writing to. |
| **input_instruction_key** | str | 'instruction' | The column name in the input dataframe that contains the instruction text. |
| **input_input_key** | str | None | The column name for the optional input text accompanying the instruction. |
| **input_output_key** | str | 'output' | The column name for the response text to be evaluated. |
| **output_key** | str | 'SuperfilteringScore' | The column name where the calculated Superfiltering score will be stored. |

## 🧠 Example Usage

#### 🧾 Output Format
The operator adds a new column (specified by `output_key`) to the input dataframe.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input dataframe are preserved. |
| **SuperfilteringScore** | float | The calculated perplexity ratio. Higher values indicate greater instruction following difficulty. |
