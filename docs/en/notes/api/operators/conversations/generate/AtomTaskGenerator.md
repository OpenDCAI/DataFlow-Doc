---
title: AtomTaskGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/conversations/generate/atomtaskgenerator/
---

## 📘 Overview

The `AtomTaskGenerator` is an operator that generates an atomic task based on a given input scenario. It utilizes a Large Language Model (LLM) service to understand the scenario and formulate a corresponding atomic task.

## `__init__` function

```python
def __init__(self, llm_serving: LLMServingABC)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | LLM serving object that implements the `LLMServingABC` interface. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_scenario_key: str, output_key: str = "atom_task")
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_scenario_key** | str | Required | Input column name, corresponding to the scenario field. |
| **output_key** | str | "atom_task" | Output column name, corresponding to the generated atomic task field. |

## 🧠 Example Usage

```python
from dataflow.operators.conversations import AtomTaskGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class AtomTaskGeneratorExample:
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

        self.generator = AtomTaskGenerator(
            llm_serving=self.llm_serving
        )

    def forward(self):
        self.generator.run(
            storage=self.storage.step(),
            input_scenario_key="scenario",
            output_key="atom_task"
        )

if __name__ == "__main__":
    pl = AtomTaskGeneratorExample()
    pl.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_scenario_key* | str | The input scenario text. The actual field name is determined by the `input_scenario_key` parameter. |
| atom_task | str | The generated atomic task. The actual field name is determined by the `output_key` parameter. |

**Example Input:**
(Assuming `input_scenario_key` is "scenario")

```json
{
  "scenario": "Attempting to book a flight."
}
```

**Example Output:**

```json
{
  "scenario": "Attempting to book a flight.",
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less."
}
```
