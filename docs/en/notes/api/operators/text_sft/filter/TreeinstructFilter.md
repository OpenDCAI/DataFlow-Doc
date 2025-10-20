---
title: TreeinstructFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/filter/treeinstructfilter/
---

## 📘 Overview

The `TreeinstructFilter` operator filters data based on scores from the `TreeinstructScore` evaluator. It measures instruction complexity by the number of nodes in the generated syntax tree; more nodes indicate more complex instructions. This is suitable for selecting instruction data within specific complexity ranges, balancing dataset difficulty distribution, and optimizing model training effectiveness.

## `__init__`

```python
def __init__(self, min_score: int = 7, max_score: int = 100, llm_serving: LLMServingABC = None)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | int | 7 | The minimum score threshold for retaining samples. |
| **max_score** | int | 100 | The maximum score threshold for retaining samples. |
| **llm_serving** | LLMServingABC | None | The Large Language Model serving instance. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| --- | --- | --- | --- |
| | | | |

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'TreeinstructScore')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The input column name, corresponding to the instruction field. |
| **output_key** | str | "TreeinstructScore" | The output column name, corresponding to the generated score field. |

## 🧠 Example Usage

```python

```

#### 🧾 Output Format

The operator adds a new column (specified by `output_key`) with the complexity score to the input data and then filters the rows based on the `min_score` and `max_score` thresholds.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original fields from the input data. |
| TreeinstructScore | int | The calculated complexity score based on the syntax tree node count. |

**Example Input:**
```json
[
    {"instruction": "What is the capital of France?"},
    {"instruction": "Provide a detailed explanation of the process of photosynthesis, including the chemical equations and the roles of chlorophyll and sunlight."},
    {"instruction": "1 + 1"}
]
```

**Example Output (assuming `min_score=7`, `max_score=100`):**
```json
[
    {
        "instruction": "Provide a detailed explanation of the process of photosynthesis, including the chemical equations and the roles of chlorophyll and sunlight.",
        "TreeinstructScore": 25
    }
]
```
*(Note: The score of 25 is illustrative. The actual score for the low-complexity questions would fall below the `min_score` of 7, causing them to be filtered out.)*
