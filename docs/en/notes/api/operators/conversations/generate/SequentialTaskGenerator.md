---
title: SequentialTaskGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/conversations/generate/sequentialtaskgenerator/
---

## 📘 Overview

`SequentialTaskGenerator` is an operator that generates a subsequent task and a composition of the two tasks based on an input atomic task, utilizing a large language model (LLM). It reads an atomic task, uses the LLM to create a logical next step (subsequent task), and then combines both into a new, more complex task (composition task).

## `__init__` function

```python
def __init__(self, llm_serving: LLMServingABC)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | A large language model serving instance for executing inference and generation. |

## Prompt Template Descriptions

## `run` function

```python
def run(self, storage: DataFlowStorage, input_task_key: str, output_subsequent_task_key: str = "subsequent_task", output_composition_task_key: str = "composition_task")
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_task_key** | str | Required | The column name in the input DataFrame that contains the atomic tasks. |
| **output_subsequent_task_key** | str | `"subsequent_task"` | The column name for the generated subsequent tasks in the output DataFrame. |
| **output_composition_task_key** | str | `"composition_task"` | The column name for the generated composition tasks in the output DataFrame. |

## 🧠 Example Usage

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| *{input\_task\_key}* | str | The original input atomic task. |
| subsequent\_task | str | The generated subsequent task. |
| composition\_task | str | The generated composition of the atomic and subsequent tasks. |

**Example Input:**
(Assuming `input_task_key` is `"atomic_task"`)

```json
{
  "atomic_task": "Write a summary of the plot of 'Hamlet'."
}
```

**Example Output:**

```json
{
  "atomic_task": "Write a summary of the plot of 'Hamlet'.",
  "subsequent_task": "Analyze the main character's motivations in 'Hamlet'.",
  "composition_task": "Write a summary of the plot of 'Hamlet' and then analyze the main character's motivations."
}
```
