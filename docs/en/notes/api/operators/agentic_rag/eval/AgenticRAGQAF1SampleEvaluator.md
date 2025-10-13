---
title: AgenticRAGQAF1SampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/agentic_rag/eval/agenticragqaf1sampleevaluator/
---

# 📘 Overview
The `AgenticRAGQAF1SampleEvaluator` is an operator designed to evaluate the F1 score between a predicted answer and one or more reference (ground truth) answers. It normalizes the text before comparison to ensure a fair evaluation based on token overlap.

## `__init__` function
```python
def __init__(self)
```
### init parameters
This operator does not require any parameters during initialization.

### Prompt Template Descriptions

## `run` function
```python
def run(self, 
        storage: DataFlowStorage, 
        input_prediction_key:str ="refined_answer",
        input_ground_truth_key:str ="golden_doc_answer",
        output_key:str ="F1Score",
        )
```
Executes the main evaluation logic. It reads a DataFrame from storage, computes the F1 score for each row, and writes the DataFrame with the new score column back to storage.

#### Parameters
| Name | Type | Default Value | Description |
| :----------------------- | :---------------- | :-------------------- | :------------------------------------------------------------------ |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading and writing data. |
| **input_prediction_key** | str | "refined_answer" | The column name in the input DataFrame that contains the predicted answers. |
| **input_ground_truth_key** | str | "golden_doc_answer" | The column name that contains the ground truth answer(s). Can be a single string or a list of strings. |
| **output_key** | str | "F1Score" | The column name where the calculated F1 scores will be stored. |

## 🧠 Example Usage

#### 🧾 Default Output Format
| Field | Type | Description |
| :-------------------- | :--------- | :------------------------------------- |
| refined_answer | str | The predicted answer text. |
| golden_doc_answer | str/list | The ground truth answer or list of answers. |
| F1Score | float | The calculated F1 score. |

**Example Input:**
```json
{
"refined_answer":"The Eiffel Tower is in Paris.",
"golden_doc_answer": ["Paris is the location of the Eiffel Tower."]
}
```
**Example Output:**
```json
{
"refined_answer":"The Eiffel Tower is in Paris.",
"golden_doc_answer": ["Paris is the location of the Eiffel Tower."],
"F1Score": 1.0
}
```
