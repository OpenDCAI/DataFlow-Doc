---
title: ReasoningAnswerJudgeMathVerifyFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/filter/reasoninganswerjudgemathverifyfilter/
---

```markdown
# 📘 ReasoningAnswerJudgeMathVerifyFilter

## 📘 Overview
The `ReasoningAnswerJudgeMathVerifyFilter` operator verifies the correctness of mathematical answers through symbolic computation, performing expression parsing and equivalence checking.

## __init__
```python
def __init__(self, config: dict)
```
### init parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **config** | dict | Required | A dictionary for configuration. |

## Prompt Template Descriptions


## run
```python
def run(storage: DataFlowStorage, input_key: str = "instruction", answer_key: str = "student_answer", gt_key: str = "correct_answer", result_key: str = "result")
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | "instruction" | The column name for the input question/instruction field. |
| **answer_key** | str | "student_answer" | The column name for the answer field to be verified. |
| **gt_key** | str | "correct_answer" | The column name for the ground truth answer field. |
| **result_key** | str | "result" | The output column name for the verification result (True/False). |

## 🧠 Example Usage

```
