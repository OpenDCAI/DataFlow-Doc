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
```python
from dataflow.operators.conversations import SequentialTaskGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class SequentialTaskGeneratorExample:
    def __init__(self, llm_serving: LLMServingABC = None):
        self.storage = FileStorage(
            first_entry_file_name="input.jsonl",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )

        self.llm_serving = APILLMServing_request(
            api_url="",
            model_name="gpt-4o",
            max_workers=30
        )

        self.generator = SequentialTaskGenerator(
            llm_serving=self.llm_serving
        )

    def forward(self):
        self.generator.run(
            storage=self.storage.step(),
            input_task_key="atom_task",
            output_subsequent_task_key="subsequent_task",
            output_composition_task_key="composition_task"
        )

if __name__ == "__main__":
    pl = SequentialTaskGeneratorExample()
    pl.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| *{input\_task\_key}* | str | The original input atomic task. |
| subsequent\_task | str | The generated subsequent task. |
| composition\_task | str | The generated composition of the atomic and subsequent tasks. |

**Example Input:**

```json
{
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less."
}
```

**Example Output:**

```json
{
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.",
  "subsequent_task": "What is the airline offering the cheapest fare within the budget for this round-trip flight?",
  "composition_task": "Find the airline offering the cheapest fare within a budget of $500 for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd."
}
```
