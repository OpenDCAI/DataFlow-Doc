---
title: DeitaComplexitySampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/eval/deitacomplexitysampleevaluator/
---

# 📘 Overview
`DeitaComplexitySampleEvaluator` is an operator designed to assess the complexity of a given instruction. It utilizes the `hkust-nlp/deita-complexity-scorer` model to generate a complexity score, typically on a scale from 1 to 6. This helps in understanding the difficulty of instructions within a dataset.

## `__init__`
```python
def __init__(self, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)
```
| Parameter | Type | Default | Description |
| :---------------- | :---- | :-------------------- | :-------------------------------------------------------------------------------------------------- |
| **device** | str | 'cuda' | The device to run the model on, e.g., 'cuda' or 'cpu'. Defaults to 'cuda' if available. |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded model. |
| **max_length** | int | 512 | The maximum sequence length for the model input. |

## `run`
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_output_key: str = 'output', output_key: str = 'DeitaComplexityScore')
```
| Parameter | Type | Default | Description |
| :---------------------- | :---------------- | :----------------------- | :------------------------------------------------------------------ |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_instruction_key** | str | 'instruction' | The column name in the input DataFrame that contains the instruction text. |
| **input_output_key** | str | 'output' | The column name in the input DataFrame that contains the output text. |
| **output_key** | str | 'DeitaComplexityScore' | The column name in the output DataFrame where the generated score will be stored. |

## 🧠 Example Usage
```python
# The user does not have enough information to write this part.
```

## 🧾 Output Format

| Field | Type | Description |
| :----------------------- | :------ | :--------------------------------------------------- |
| **(input_fields)** | - | The original fields from the input data are preserved. |
| **DeitaComplexityScore** | float | The calculated complexity score for the instruction (typically from 1 to 6). |

#### Example Input:
```json
{
    "instruction": "Explain the theory of relativity in simple terms.",
    "output": "The theory of relativity, proposed by Albert Einstein, has two main parts: special relativity and general relativity. Special relativity deals with..."
}
```
#### Example Output:
```json
{
    "instruction": "Explain the theory of relativity in simple terms.",
    "output": "The theory of relativity, proposed by Albert Einstein, has two main parts: special relativity and general relativity. Special relativity deals with...",
    "DeitaComplexityScore": 4.85
}
```
