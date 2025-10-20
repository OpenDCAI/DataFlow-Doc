---
title: BenchDatasetEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/eval/benchdatasetevaluator/
---

## 📘 Overview
The `BenchDatasetEvaluator` is an operator designed to compare predicted answers with ground-truth answers. It supports two evaluation modes: "match" for exact string/mathematical comparison suitable for questions with definitive answers, and "semantic" which uses an LLM to evaluate semantic similarity for open-ended questions. It calculates accuracy and saves the statistical results to a specified path.

## `__init__` function
```python
def __init__(self,
            eval_result_path: str = None,
            compare_method: Literal["match", "semantic"] = "match",
            system_prompt: str = "You are a helpful assistant specialized in evaluating answer correctness.",
            llm_serving: LLMServingABC = None,
            prompt_template = None
            ):
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **eval\_result\_path** | str | None | Path to save the evaluation result JSON file. If `None`, a timestamped path is generated automatically. |
| **compare\_method** | Literal["match", "semantic"] | "match" | The method for comparing answers. "match" uses mathematical verification; "semantic" uses an LLM. |
| **system\_prompt** | str | "You are a helpful..." | The system prompt to use when `compare_method` is "semantic". |
| **llm\_serving** | LLMServingABC | None | The LLM serving instance, required when `compare_method` is "semantic". |
| **prompt\_template** | PromptABC | None | The prompt template object, used when `compare_method` is "semantic". Defaults to `AnswerJudgePrompt` if not provided. |

## Prompt Template Descriptions
| Prompt Template Name | Main Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function
```python
def run(
        self,
        storage:DataFlowStorage,
        input_test_answer_key: str = "generated_cot",
        input_gt_answer_key: str = "golden_answer",
        input_question_key: str = None,
        ) -> list:
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input\_test\_answer\_key** | str | "generated\_cot" | The column name in the input data that contains the predicted answer. |
| **input\_gt\_answer\_key** | str | "golden\_answer" | The column name in the input data that contains the ground-truth answer. |
| **input\_question\_key** | str | None | The column name containing the question text. Required if `compare_method` is "semantic". |

## 🧠 Example Usage
```python
# The user did not provide enough information to create a working example.
```
#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :--- | :--- | :--- |
| *input\_columns* | any | All columns from the input data are preserved. |
| **answer\_match\_result** | bool | The result of the comparison, `True` if the answers match, `False` otherwise. |

**Example Input:**
```json
{
    "instruction": "What is 2 + 2?",
    "generated_cot": "The answer is 4.",
    "golden_answer": "4"
}
```
**Example Output:**
```json
{
    "instruction": "What is 2 + 2?",
    "generated_cot": "The answer is 4.",
    "golden_answer": "4",
    "answer_match_result": true
}
```
