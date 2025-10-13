---
title: ParaSeqTaskGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/conversations/generate/paraseqtaskgenerator/
---

## 📘 Overview

The `ParaSeqTaskGenerator` is an operator designed to generate complex task structures based on a simple atomic task. It utilizes a Large Language Model (LLM) to create three distinct types of related tasks: a parallel task, a subsequent task, and a composition of the two. This operator is useful for creating complex instruction datasets or for breaking down a large task into manageable, structured components.

## `__init__` function

```python
def __init__(self, llm_serving: LLMServingABC)
```

| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | The Large Language Model serving instance, used to execute inference and generation. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_task_key: str, output_parallel_task_key: str = "parallel_task",  output_subsequent_task_key: str = "subsequent_task", output_composition_task_key: str = "composition_task")
```

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_task_key** | str | Required | The input column name, corresponding to the atomic task field. |
| **output_parallel_task_key** | str | "parallel_task" | The output column name for the generated parallel task. |
| **output_subsequent_task_key** | str | "subsequent_task" | The output column name for the generated subsequent task. |
| **output_composition_task_key**| str | "composition_task" | The output column name for the generated composition task. |

## 🧠 Example Usage

#### 🧾 Default Output Format (Output Format)

The operator adds the new generated task columns to the original DataFrame.

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_task_key* | str | The original input atomic task text. |
| *output_parallel_task_key* | str | The generated parallel task. |
| *output_subsequent_task_key*| str | The generated subsequent task. |
| *output_composition_task_key*| str | The generated composition task combining the parallel and subsequent tasks. |
