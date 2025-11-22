---
title: CondorGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/generate/condorgenerator/
---

# 📘 CondorGenerator

`CondorGenerator` is an operator that generates Synthetic Fine-Tuning (SFT) data from scratch based on predefined knowledge tree tags. It operates in a two-stage process: first generating questions of varying difficulty levels, and then generating corresponding answers for each question.

## `__init__`
```python
def __init__(self, llm_serving: LLMServingABC = None, num_samples=15, use_task_diversity=True)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | The Large Language Model serving instance, used to execute inference and generation. |
| **num_samples** | int | 15 | Total number of samples to generate. It is recommended to keep this value below 5000 unless more tags are added. |
| **use_task_diversity** | bool | True | Whether to use task scenario diversity enhancement to enrich the generated questions. |

## Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance, responsible for writing the generated data. |

## 🧠 Example Usage
```python

```

#### 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| difficulty | str | Difficulty level of the question (e.g., "Easy", "Medium", "Hard"). |
| instruction | str | The generated question text. |
| output | str | The generated answer for the corresponding instruction. |
