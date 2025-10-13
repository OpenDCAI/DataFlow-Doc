---
title: ReasoningAnswerModelJudgeFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/filter/reasoninganswermodeljudgefilter/
---

## 📘 Overview [ReasoningAnswerModelJudgeFilter]
This operator evaluates the correctness of answers by comparing the semantic consistency between the current answer and the reference answer. It uses a large language model for semantic understanding and judgment, ultimately returning a binary classification result for each answer.

## `__init__` function
```python
def __init__(self,
            system_prompt: str = "You are a helpful assistant specialized in evaluating answer correctness.",
            llm_serving: LLMServingABC = None,
            prompt_template = AnswerJudgePrompt | DIYPromptABC,
            keep_all_samples: bool = False,
            ):
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **system_prompt** | str | "You are a helpful assistant..." | System prompt to define the behavior of the LLM. |
| **llm_serving** | LLMServingABC | None | An instance of the large language model serving class, responsible for executing inference. |
| **prompt_template** | AnswerJudgePrompt \| DIYPromptABC | AnswerJudgePrompt() | The prompt template object used to construct the evaluation prompt. |
| **keep_all_samples** | bool | False | If `True`, all samples are kept in the output. If `False`, only samples judged as correct are kept. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_question_key: str = "question", input_answer_key: str = "answer", input_reference_key: str = "reference_answer")
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading and writing data. |
| **input_question_key** | str | "question" | The column name in the input data that contains the question. |
| **input_answer_key** | str | "answer" | The column name in the input data that contains the answer to be judged. |
| **input_reference_key**| str | "reference_answer" | The column name in the input data that contains the ground truth or reference answer. |

## 🧠 Example Usage
```python

```

#### 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| question | str | The original input question text. (Or content from `input_question_key`) |
| answer | str | The original answer text to be judged. (Or content from `input_answer_key`) |
| reference_answer | str | The original reference answer text. (Or content from `input_reference_key`) |
| ... | | Other original columns from the input are preserved. |
| **answer_match_result** | bool | The result of the judgment: `True` if the answer is considered correct, `False` otherwise. |
