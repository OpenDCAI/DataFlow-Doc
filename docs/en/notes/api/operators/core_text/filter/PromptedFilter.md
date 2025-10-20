---
title: PromptedFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/filter/promptedfilter/
---

## 📘 Overview
`PromptedFilter` is an operator that uses an LLM to assign numeric scores to input data. It then filters out samples, keeping only those whose scores fall within a specified range (`min_score` to `max_score`, inclusive). By default, the scoring scale is 1–5, but users can define custom evaluation criteria and scales using a `system_prompt`.

## `__init__` function
```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "Please evaluate the quality of this data on a scale from 1 to 5."):
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | The large language model serving instance used for scoring the data. |
| **system_prompt** | str | "Please evaluate the quality of this data on a scale from 1 to 5." | The system prompt that defines the evaluation criteria and scoring rules for the LLM. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "eval", min_score=5, max_score=5):
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | "raw_content" | The name of the input column containing the text to be evaluated. |
| **output_key** | str | "eval" | The name of the output column where the generated score will be stored. |
| **min_score** | int | 5 | The minimum score (inclusive) for a sample to be kept. |
| **max_score** | int | 5 | The maximum score (inclusive) for a sample to be kept. |

## 🧠 Example Usage
```python

```

#### 🧾 Default output format（Output Format）
The operator outputs a filtered DataFrame containing only the rows that meet the score criteria. The output includes all original columns plus a new column with the score.

| Field | Type | Description |
| :--- | :--- | :--- |
| (original fields) | - | All fields from the input data are preserved. |
| eval | int | The numeric score assigned by the LLM. The column name is determined by `output_key`. |

**Example Input:**
```json
[
    {"raw_content": "This is an excellent, well-written document."},
    {"raw_content": "This is a poor quality text with many errors."}
]
```
**Example Output (with default `min_score=5`, `max_score=5`):**
```json
[
    {"raw_content": "This is an excellent, well-written document.", "eval": 5}
]
```
