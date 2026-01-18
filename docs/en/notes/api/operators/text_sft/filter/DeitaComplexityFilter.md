---
title: DeitaComplexityFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/filter/deitacomplexityfilter/
---

## 📘 Overview

The `DeitaComplexityFilter` is an operator designed to filter data based on complexity scores. It utilizes the Llama-based `DeitaComplexitySampleEvaluator` to assess the complexity of given instructions and retains only the data entries whose scores fall within a specified range `[min_score, max_score]`.

## `__init__` function

`__init__(self, min_score=3.0, max_score=5.0, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)`

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | `3.0` | The minimum complexity score threshold. Data with scores below this value will be filtered out. |
| **max_score** | float | `5.0` | The maximum complexity score threshold. Data with scores above this value will be filtered out. |
| **device** | str | `'cuda'` | The device on which the complexity scoring model will run (e.g., 'cuda', 'cpu'). |
| **model_cache_dir** | str | `'./dataflow_cache'` | The directory to store and cache the downloaded scoring model. |
| **max_length** | int | `512` | The maximum sequence length that the model can process. |

### Prompt Template Descriptions

## `run` function

`run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_output_key : str = 'output', output_key: str = "DeitaComplexityScore")`

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance used for reading the input DataFrame and writing the filtered output. |
| **input_instruction_key** | str | `'instruction'` | The name of the column in the input data containing the instruction text to be evaluated. |
| **input_output_key** | str | `'output'` | The name of the column in the input data containing the corresponding output/response text. |
| **output_key** | str | `'DeitaComplexityScore'` | The name of the new column that will be added to the DataFrame to store the calculated complexity score. |

## 🧠 Example Usage

```python
from dataflow.operators.text_sft.filter import DeitaComplexityFilter
from dataflow.utils.storage import FileStorage

# Prepare storage with instruction-output pairs
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# Initialize and run the filter
complexity_filter = DeitaComplexityFilter(
    min_score=2.0,
    max_score=5.0,
    device="cuda",
    model_cache_dir="./dataflow_cache",
)
complexity_filter.run(
    storage.step(),
    input_instruction_key="instruction",
    input_output_key="output",
    output_key="DeitaComplexityScore",
)
```

#### 🧾 Output Format
The operator adds a new column (default name `DeitaComplexityScore`) to the input data and filters the rows based on the score.

| Field | Type | Description |
| :--- | :---- | :---------- |
| instruction | str | The input instruction text. |
| output | str | The input response text. |
| DeitaComplexityScore | float | The calculated complexity score for the instruction. |

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
