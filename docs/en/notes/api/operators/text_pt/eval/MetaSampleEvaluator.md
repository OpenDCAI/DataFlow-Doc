---
title: MetaSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/eval/metasampleevaluator/
---

## 📘 Overview

The `MetaSampleEvaluator` is an operator designed to evaluate the quality of text based on a set of user-defined dimensions. It uses a Large Language Model (LLM) to score the text across various meta-attributes, such as text structure, diversity, complexity, safety, and more.

## __init__ function

```python
def __init__(self, 
             llm_serving: LLMServingABC = None,
             dimensions: list[dict] = example_dimensions,
            ):
```

### init Parameters

| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | A Large Language Model serving instance, required for executing the evaluation. |
| **dimensions** | list[dict] | example_dimensions | A list of dictionaries defining the evaluation dimensions. Each dictionary must contain `dimension_name`, `description`, and `example_list`. |

## Prompt Template Descriptions

| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str):
```

#### Parameters

| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be evaluated. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_key* | str | The original input text from the specified input column. |
| Text Structure | float | Score for the text's structure. |
| Diversity & Complexity | float | Score for the text's diversity and complexity. |
| Fluency & Understandability | float | Score for the text's fluency and understandability. |
| Safety | float | Score for the text's safety. |
| Educational Value | float | Score for the text's educational value. |
| Content Accuracy & Effectiveness | float | Score for the content's accuracy and effectiveness. |

**Example Input (assuming `input_key="text"`):**

```json
{
"text": "The Pythagorean theorem states that in a right-angled triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides."
}
```

**Example Output:**

```json
{
"text": "The Pythagorean theorem states that in a right-angled triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides.",
"Text Structure": 5.0,
"Diversity & Complexity": 4.0,
"Fluency & Understandability": 5.0,
"Safety": 5.0,
"Educational Value": 5.0,
"Content Accuracy & Effectiveness": 5.0
}
```
