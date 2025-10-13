---
title: ReasoningAnswerExtractionQwenMathEvalGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/generate/reasoninganswerextractionqwenmathevalgenerator/
---

## 📘 ReasoningAnswerExtractionQwenMathEvalGenerator
`ReasoningAnswerExtractionQwenMathEvalGenerator` is an operator that extracts and normalizes mathematical expressions from answers, performing string cleaning, unit processing, and format standardization.

## `__init__`
```python
__init__(self, dataset_name:str = None)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **dataset_name** | str | None | The name of the dataset, which may be used to customize the extraction logic. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |


## `run`
```python
run(self, storage: DataFlowStorage, response_key:str = "pseudo_correct_solution_example", extraction_key:str = "extraction")
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **response_key** | str | "pseudo_correct_solution_example" | The column name in the input DataFrame that contains the model's response to be processed. |
| **extraction_key** | str | "extraction" | The column name for the output where the extracted answer will be stored. |

## 🧠 Example Usage
```python
```

#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input data. |
| extraction | str | The extracted and normalized mathematical expression. |

**Example Input:**
```json
{
  "question": "What is the final answer to 2+2?",
  "pseudo_correct_solution_example": "To solve this, we perform addition. 2 + 2 = 4. The final answer is \\boxed{4}."
}
```
**Example Output:**
```json
{
  "question": "What is the final answer to 2+2?",
  "pseudo_correct_solution_example": "To solve this, we perform addition. 2 + 2 = 4. The final answer is \\boxed{4}.",
  "extraction": "4"
}
```
