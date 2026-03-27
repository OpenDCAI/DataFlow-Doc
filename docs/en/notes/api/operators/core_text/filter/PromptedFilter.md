---
title: PromptedFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/filter/promptedfilter/
---

## 📘 Overview
`PromptedFilter` is an operator that uses an LLM to assign numeric scores to input data. It then filters out samples, keeping only those whose scores fall within a specified range (`min_score` to `max_score`, inclusive). By default, the scoring scale is 1–5, but users can define custom evaluation criteria and scales using a `system_prompt`.

> **Data Validation:** Before evaluation, the operator automatically filters out rows where the `input_key` field contains invalid content (including `None`, `NaN`, empty strings, empty collections, etc.). Only rows with valid content are sent to the LLM for scoring. The number of skipped rows is logged for traceability.

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

## 🛡️ Data Validation

Before sending data to the LLM for evaluation, `PromptedFilter` performs input validation using the built-in `_has_valid_content` method. The following types of values are considered **invalid** and will be automatically skipped:

| Invalid Value Type | Example |
| :--- | :--- |
| `None` | `None` |
| `NaN` | `float('nan')` |
| Empty string | `""`, `"   "` |
| Empty collection | `[]`, `{}`, `()`, `set()` |
| Boolean `False` | `False` |

Only rows with valid content in the `input_key` column will be sent to the LLM for scoring. Rows with invalid content are silently excluded from the output. The number of skipped rows is recorded in the log.

## 🧠 Example Usage
```python

```

#### 🧾 Default output format（Output Format）
The operator outputs a filtered DataFrame containing only the rows that meet the score criteria. The output includes all original columns plus a new column with the score. Rows with empty or invalid `input_key` values are excluded before evaluation.

| Field | Type | Description |
| :--- | :--- | :--- |
| (original fields) | - | All fields from the input data are preserved. |
| eval | int | The numeric score assigned by the LLM. The column name is determined by `output_key`. |

**Example Input:**
```json
[
    {"raw_content": "This is an excellent, well-written document."},
    {"raw_content": "This is a poor quality text with many errors."},
    {"raw_content": ""},
    {"raw_content": null}
]
```
**Example Output (with default `min_score=5`, `max_score=5`):**
```json
[
    {"raw_content": "This is an excellent, well-written document.", "eval": 5}
]
```
> Note: The rows with empty string and `null` values in `raw_content` are automatically skipped and do not appear in the output.
