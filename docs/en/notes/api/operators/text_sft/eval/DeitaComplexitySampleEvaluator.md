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
from dataflow.operators.text_sft.eval import DeitaComplexitySampleEvaluator
from dataflow.utils.storage import FileStorage

# Prepare storage with instruction-output pairs
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# Initialize and run the evaluator
evaluator = DeitaComplexitySampleEvaluator(
    device="cuda",
    model_cache_dir="./dataflow_cache",
    max_length=512,
)
evaluator.run(
    storage.step(),
    input_instruction_key="instruction",
    input_output_key="output",
    output_key="DeitaComplexityScore",
)
```

## 🧾 Output Format

| Field | Type | Description |
| :----------------------- | :------ | :--------------------------------------------------- |
| **(input_fields)** | - | The original fields from the input data are preserved. |
| **DeitaComplexityScore** | float | The calculated complexity score for the instruction (typically from 1 to 6). |

**Example Input:**
```json
Example Input:
```json
{
  "instruction":"Provide a detailed comparison between the 'list' and 'tuple' data structures in Python, focusing on mutability, performance, and common use cases.",
  "output":"Certainly. The primary distinction between lists and tuples in Python lies in their mutability. Lists are mutable, meaning their elements can be added, removed, or modified after creation. Tuples are immutable; once created, their contents cannot be altered. This immutability makes tuples slightly more memory-efficient and faster to access."
}

```

Example Output:
```json
{
  "instruction":"Provide a detailed comparison between the 'list' and 'tuple' data structures in Python, focusing on mutability, performance, and common use cases.",
  "output":"Certainly. The primary distinction between lists and tuples in Python lies in their mutability. Lists are mutable, meaning their elements can be added, removed, or modified after creation. Tuples are immutable; once created, their contents cannot be altered. This immutability makes tuples slightly more memory-efficient and faster to access.",
  "DeitaComplexityScore":2.9713823783
}
```
