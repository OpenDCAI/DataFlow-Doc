---
title: ReasoningAnswerGroundTruthFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/filter/reasoninganswergroundtruthfilter/
---

# 📘 Overview

[ReasoningAnswerGroundTruthFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/...) is an operator designed to filter data by comparing a generated answer against a ground truth answer. It supports both exact string matching and mathematical equivalence verification. Rows where the answers match are retained, while non-matching rows are discarded.

## `__init__`

```python
def __init__(self, compare_method: Literal["math_verify", "exact"] = "math_verify"):
```

| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **compare_method** | str | "math_verify" | The comparison method. `"math_verify"` checks for mathematical equivalence, while `"exact"` performs a strict string comparison. |

## `run`

```python
def run(self, storage: DataFlowStorage, input_test_answer_key: str = "generated_cot", input_gt_answer_key: str = "golden_answer"):
```

| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading input data and writing the filtered output. |
| **input_test_answer_key** | str | "generated_cot" | The column name in the input data that contains the generated answer to be verified. |
| **input_gt_answer_key** | str | "golden_answer" | The column name in the input data that contains the ground truth answer for comparison. |

## 🧠 Example Usage

```python

```

#### 🧾 Output Format

The operator filters the input DataFrame, keeping only the rows where the answer in `input_test_answer_key` matches the answer in `input_gt_answer_key` according to the specified `compare_method`. The output schema is identical to the input schema.

**Example Input:**
```json
[
    {
        "instruction": "What is 15 plus 20?",
        "generated_cot": "The sum is 35.",
        "golden_answer": "35"
    },
    {
        "instruction": "What is the capital of France?",
        "generated_cot": "The capital is Lyon.",
        "golden_answer": "Paris"
    }
]
```

**Example Output (with `compare_method='math_verify'`):**
```json
[
    {
        "instruction": "What is 15 plus 20?",
        "generated_cot": "The sum is 35.",
        "golden_answer": "35"
    }
]
```
