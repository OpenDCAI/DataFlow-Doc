---
title: ReasoningTokenDatasetEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/eval/reasoningtokendatasetevaluator/
---

## 📘 Overview

The `ReasoningTokenDatasetEvaluator` is an operator designed to analyze and report token statistics for question-and-answer datasets. It calculates key metrics such as minimum, maximum, mean, and median token counts for both questions and answers using a specified tokenizer. This is useful for understanding a dataset's complexity and distribution before further processing or model training.

## `__init__` function

```python
def __init__(self)
```

This function initializes the operator and does not take any parameters.

### Prompt Template Descriptions

| Prompt Template Name | Primary Use Case | Applicable Scenarios | Feature Description |
| -------------------- | ---------------- | -------------------- | ------------------- |
|                      |                  |                      |                     |
|                      |                  |                      |                     |
|                      |                  |                      |                     |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_question_key: str, input_answer_key: str, model_name_or_path: str)
```

Executes the main logic of the operator. It reads a DataFrame from storage, calculates token statistics for the specified question and answer columns, and returns a dictionary containing these statistics.

#### Parameters

| Name                 | Type              | Default  | Description                                                         |
| :------------------- | :---------------- | :------- | :------------------------------------------------------------------ |
| **storage**          | DataFlowStorage   | Required | The DataFlow storage instance used to read the input DataFrame.       |
| **input_question_key** | str               | Required | The column name in the DataFrame that contains the question text.   |
| **input_answer_key**   | str               | Required | The column name in the DataFrame that contains the answer text.     |
| **model_name_or_path** | str               | Required | The name or local path of the Hugging Face tokenizer to be used for tokenization. |

## 🧠 Example Usage

```python
# Blank as requested
```

#### 🧾 Default Output Format

The `run` function returns a dictionary containing the calculated token statistics.

| Field                 | Type    | Description                                                     |
| :-------------------- | :------ | :-------------------------------------------------------------- |
| questions_zeros_count | int     | The number of questions with zero tokens.                       |
| answers_zeros_count   | int     | The number of answers with zero tokens.                         |
| questions_min         | int     | The minimum token length observed in the questions.             |
| questions_max         | int     | The maximum token length observed in the questions.             |
| questions_mean        | float   | The average token length of the questions.                      |
| questions_median      | float   | The median token length of the questions.                       |
| answers_min           | int     | The minimum token length observed in the answers.               |
| answers_max           | int     | The maximum token length observed in the answers.               |
| answers_mean          | float   | The average token length of the answers.                        |
| answers_median        | float   | The median token length of the answers.                         |

Example output:
```json
{
    "questions_zeros_count": 0,
    "answers_zeros_count": 0,
    "questions_min": 5,
    "questions_max": 150,
    "questions_mean": 45.7,
    "questions_median": 42.0,
    "answers_min": 10,
    "answers_max": 512,
    "answers_mean": 128.3,
    "answers_median": 110.0
}
```
