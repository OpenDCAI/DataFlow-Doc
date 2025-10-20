---
title: PromptedEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/eval/promptedevaluator/
---

## 📘 PromptedEvaluator
PromptedEvaluator is an operator that uses a Large Language Model (LLM) to rate data quality based on a system prompt. It writes the resulting score (an integer from 1 to 5) back to the DataFrame, which is then persisted via a storage object.

## __init__
```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "Please evaluate the quality of this data on a scale from 1 to 5."):
```
### init parameters
| Parameter | Type | Default Value | Description |
| :------------------ | :-------------- | :------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| **llm_serving** | LLMServingABC | Required | The Large Language Model serving instance used for evaluation. |
| **system_prompt** | str | "Please evaluate the quality of this data on a scale from 1 to 5." | The system prompt used to instruct the LLM on how to perform the evaluation. |

### Prompt Template Descriptions

## run
```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "eval")
```
#### Parameters
| Name | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | "raw_content" | The column name in the input data that contains the text to be evaluated. |
| **output_key** | str | "eval" | The column name where the generated evaluation score will be written. |

## 🧠 Example Usage
