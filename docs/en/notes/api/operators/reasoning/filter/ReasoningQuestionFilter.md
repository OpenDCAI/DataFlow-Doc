---
title: ReasoningQuestionFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/filter/reasoningquestionfilter/
---

## 📘 Overview [ReasoningQuestionFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/filter/reasoning_question_filter.py)

This operator checks the correctness of questions, including formatting, semantic validity, logical consistency, and whether the problem is solvable. It performs a four-stage evaluation using a large language model and retains qualified samples.

## __init__ function

```python
def __init__(self,
            system_prompt: str = "You are a helpful assistant.",
            llm_serving: LLMServingABC = None,
            prompt_template = MathQuestionFilterPrompt | GeneralQuestionFilterPrompt | DiyQuestionFilterPrompt | DIYPromptABC
            ):
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **system_prompt** | str | "You are a helpful assistant." | System prompt to define the behavior of the language model. |
| **llm_serving** | LLMServingABC | None | A large language model serving instance, required for executing inference. |
| **prompt_template** | PromptABC | MathQuestionFilterPrompt | The prompt template object used to construct the check prompts. Supports math, general, and custom templates. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| **MathQuestionFilterPrompt** | | | |
| **GeneralQuestionFilterPrompt** | | | |
| **DiyQuestionFilterPrompt** | | | |

## run function

```python
def run(self, storage: DataFlowStorage, input_key: str = "math_problem")
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | "math_problem" | The name of the input column that contains the questions to be filtered. |

## 🧠 Example Usage

```python

```
