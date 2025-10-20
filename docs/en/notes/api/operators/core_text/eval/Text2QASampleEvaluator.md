---
title: Text2QASampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/eval/text2qasampleevaluator/
---

## 📘 Overview

The `Text2QASampleEvaluator` is an operator designed to score and evaluate generated Question-Answer (QA) pairs. It assesses multiple quality dimensions, including question quality, answer alignment, answer verifiability, and downstream value, by leveraging a Large Language Model (LLM) to provide both a numerical grade and textual feedback for each dimension.

## `__init__` function

```python
def __init__(self, llm_serving: LLMServingABC)
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **llm\_serving** | LLMServingABC | Required | Large language model serving instance for executing inference and generation. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(
    self,
    storage: DataFlowStorage,
    input_question_key: str = "generated_question",
    input_answer_key: str = "generated_answer",
    output_question_quality_key: str = "question_quality_grades",
    output_question_quality_feedback_key: str = "question_quality_feedbacks",
    output_answer_alignment_key: str = "answer_alignment_grades",
    output_answer_alignment_feedback_key: str = "answer_alignment_feedbacks",
    output_answer_verifiability_key: str = "answer_verifiability_grades",
    output_answer_verifiability_feedback_key: str = "answer_verifiability_feedbacks",
    output_downstream_value_key: str = "downstream_value_grades",
    output_downstream_value_feedback_key: str = "downstream_value_feedbacks"
)
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input\_question\_key** | str | "generated\_question" | Input column name for the question field. |
| **input\_answer\_key** | str | "generated\_answer" | Input column name for the answer field. |
| **output\_question\_quality\_key**| str | "question\_quality\_grades" | Output column name for question quality scores. |
| **output\_question\_quality\_feedback\_key**| str | "question\_quality\_feedbacks" | Output column name for question quality feedback. |
| **output\_answer\_alignment\_key**| str | "answer\_alignment\_grades" | Output column name for answer alignment scores. |
| **output\_answer\_alignment\_feedback\_key**| str | "answer\_alignment\_feedbacks" | Output column name for answer alignment feedback. |
| **output\_answer\_verifiability\_key**| str | "answer\_verifiability\_grades"| Output column name for answer verifiability scores. |
| **output\_answer\_verifiability\_feedback\_key**| str | "answer\_verifiability\_feedbacks"| Output column name for answer verifiability feedback. |
| **output\_downstream\_value\_key**| str | "downstream\_value\_grades"| Output column name for downstream value scores. |
| **output\_downstream\_value\_feedback\_key**| str | "downstream\_value\_feedbacks"| Output column name for downstream value feedback. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format (Output Format)

| Field | Type | Description |
| :--- | :--- | :--- |
| generated\_question | str | Input question text. |
| generated\_answer | str | Input answer text. |
| question\_quality\_grades | float | Model-generated score for question quality. |
| question\_quality\_feedbacks | str | Model-generated feedback for question quality. |
| answer\_alignment\_grades | float | Model-generated score for answer alignment. |
| answer\_alignment\_feedbacks | str | Model-generated feedback for answer alignment. |
| answer\_verifiability\_grades | float | Model-generated score for answer verifiability. |
| answer\_verifiability\_feedbacks | str | Model-generated feedback for answer verifiability. |
| downstream\_value\_grades | float | Model-generated score for downstream value. |
| downstream\_value\_feedbacks | str | Model-generated feedback for downstream value. |

**Example Input:**

```json
{
  "generated_question": "What is the primary function of the mitochondria in a cell?",
  "generated_answer": "The mitochondria is known as the powerhouse of the cell because it generates most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
}
```

**Example Output:**

```json
{
  "generated_question": "What is the primary function of the mitochondria in a cell?",
  "generated_answer": "The mitochondria is known as the powerhouse of the cell because it generates most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
  "question_quality_grades": 5.0,
  "question_quality_feedbacks": "The question is clear, specific, and directly addresses a core concept in cell biology. It is well-formed and unambiguous.",
  "answer_alignment_grades": 5.0,
  "answer_alignment_feedbacks": "The answer directly and accurately addresses the question, explaining the main function of the mitochondria and providing context with the term 'powerhouse of the cell'.",
  "answer_verifiability_grades": 5.0,
  "answer_verifiability_feedbacks": "The provided answer is a well-established scientific fact that can be easily verified in any standard biology textbook or reliable scientific source.",
  "downstream_value_grades": 4.0,
  "downstream_value_feedbacks": "This is a fundamental knowledge question that is very useful for educational purposes, such as in a biology quiz or study guide. Its value is high in a learning context."
}
```
