---
title: TreeinstructSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/eval/treeinstructsampleevaluator/
---

## 📘 Overview

The `TreeinstructSampleEvaluator` is an operator designed to measure the complexity of a given instruction by analyzing the size of its syntax tree. It leverages a large language model (LLM) to generate a syntax tree for the instruction and then calculates a complexity score based on the number of nodes in that tree. A higher node count signifies a more complex instruction.

## `__init__`

```python
def __init__(self, llm_serving: LLMServingABC = None)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | An instance of an LLM serving class that handles model inference. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`

```python
def run(self, storage: DataFlowStorage, input_instruction_key: str, output_key: str='TreeinstructScore')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_instruction_key** | str | Required | The column name in the input DataFrame that contains the instruction text. |
| **output_key** | str | "TreeinstructScore" | The column name for the generated complexity score. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| (original_fields) | any | The original fields from the input data are preserved. |
| TreeinstructScore | float | The calculated complexity score for the instruction. |

**Example Input:**

```json
{
    "instruction": "Write a Python function to calculate the factorial of a number."
}
```

**Example Output:**

```json
{
    "instruction": "Write a Python function to calculate the factorial of a number.",
    "TreeinstructScore": 18.0
}
```
