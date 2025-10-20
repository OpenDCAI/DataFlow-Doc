---
title: CodeQualitySampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/eval/codequalitysampleevaluator/
---

## 📘 Overview
`CodeQualitySampleEvaluator` is an operator that evaluates the quality of a generated code snippet against its source instruction. It uses an LLM to provide both a numerical score and textual feedback, acting as an automated code reviewer.

## __init__ function
```python
def __init__(self, llm_serving: LLMServingABC, prompt_template=None):
```
### init parameter description
| Parameter | Type | Default Value | Description |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | `LLMServingABC` | Required | An instance of a language model serving class, used to execute the evaluation. |
| **prompt_template** | `PromptABC`, `str`, or `None` | `CodeQualityEvaluatorPrompt()` | The prompt template object used to structure the input for the LLM. Supports built-in templates or custom strings. If `None`, defaults to `CodeQualityEvaluatorPrompt`. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| -------------------- | --------------- | -------------------- | ------------------- |
|                      |                 |                      |                     |
|                      |                 |                      |                     |
|                      |                 |                      |                     |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_score_key: str = "quality_score", output_feedback_key: str = "quality_feedback")
```
#### Parameters
| Name | Type | Default Value | Description |
| :-------------------- | :---------------- | :-------------------- | :----------------- |
| **storage** | `DataFlowStorage` | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | `str` | Required | The name of the input column. This column should contain a dictionary with `instruction` and `code` keys. |
| **output_score_key** | `str` | `"quality_score"` | The name of the output column where the numerical quality score will be stored. |
| **output_feedback_key**| `str` | `"quality_feedback"`| The name of the output column where the textual feedback will be stored. |

## 🧠 Example Usage
```python

```
#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :-------------------- | :---- | :---------- |
| *input_fields* | any | The original fields from the input data are preserved. |
| quality_score | int | The numerical quality score assigned by the LLM (e.g., from 1 to 10). |
| quality_feedback | str | The detailed textual feedback on the code's quality provided by the LLM. |

**Example Input:**
*(Note: The operator processes a DataFrame. The JSON below represents a single row.)*
```json
{
  "generated_instruction": "Create a Python function that calculates the factorial of a non-negative integer.",
  "generated_code": "def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)"
}
```
**Example Output:**
```json
{
  "generated_instruction": "Create a Python function that calculates the factorial of a non-negative integer.",
  "generated_code": "def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)",
  "quality_score": 10,
  "quality_feedback": "The code is correct, efficient, and properly handles the base case (n=0). The recursive implementation is clear and follows standard Python conventions for this problem."
}
```
