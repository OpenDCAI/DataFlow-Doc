---
title: ReasoningAnswerNgramFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/filter/reasoninganswerngramfilter/
---

## 📘 Overview

The `ReasoningAnswerNgramFilter` is an operator designed to filter answers based on n-gram repetition scores. It effectively detects and removes responses that exhibit repetitive patterns, ensuring higher quality and more diverse generated content.

## `__init__`
```python
def __init__(self, min_score: float = 0.1, max_score: float = 1.0, ngrams: int = 5)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 0.1 | The minimum acceptable n-gram repetition score. |
| **max_score** | float | 1.0 | The maximum acceptable n-gram repetition score. |
| **ngrams** | int | 5 | The size of n-grams used for calculating repetition. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| --- | --- | --- | --- |

## `run`
```python
def run(self, storage: DataFlowStorage, input_question_key: str = "instruction", input_answer_key: str = "generated_cot")
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance responsible for reading and writing data. |
| **input_question_key** | str | "instruction" | The column name in the input data that contains the question text. |
| **input_answer_key** | str | "generated_cot" | The column name in the input data that contains the generated answer to be filtered. |

## 🧠 Example Usage

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
