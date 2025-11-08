---
title: FunctionGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/conversations/generate/functiongenerator/
---

## 📘 Overview

[FunctionGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) is an operator that generates a list of functions based on a composition task and its associated sub-tasks using a large language model (LLM). It automatically constructs a prompt from the input tasks and calls the LLM service to produce executable or representative function code.

## `__init__` function

```python
def __init__(self, llm_serving: LLMServingABC):
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | The large language model serving instance used for generation. |

### Prompt Template Descriptions

| Prompt Template Name | Main Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_composition_task_key: str, input_sub_tasks_keys: list[str], output_key: str = "functions")
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance responsible for reading and writing data. |
| **input_composition_task_key** | str | Required | The input column name corresponding to the composition task. |
| **input_sub_tasks_keys** | list[str] | Required | The list of input column names corresponding to the sub-tasks. |
| **output_key** | str | "functions" | The output column name for the generated functions. |

## 🧠 Example Usage

```python
from dataflow.operators.conversations import FunctionGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class FunctionGeneratorExample:
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

        self.generator = FunctionGenerator(
            llm_serving=self.llm_serving
        )

    def forward(self):
        self.generator.run(
            storage=self.storage.step(),
            input_composition_task_key="composition_task",
            input_sub_tasks_keys=["atom_task", "parallel_task", "subsequent_task"],
            output_key="functions"
        )

if __name__ == "__main__":
    pl = FunctionGeneratorExample()
    pl.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_fields* | - | All fields from the input data are preserved. |
| functions | str | The generated functions as a string. (Note: The field name is determined by the `output_key` parameter). |

**Example Input:**

```json
{
  "composition_task": "Find the airline offering the cheapest fare within a budget of $500 for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd.",
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.",
  "subsequent_task": "What is the airline offering the cheapest fare within the budget for this round-trip flight?"
}
```

**Example Output:**

```json
{
  "composition_task": "Find the airline offering the cheapest fare within a budget of $500 for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd.",
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.",
  "subsequent_task": "What is the airline offering the cheapest fare within the budget for this round-trip flight?",
  "functions": "```json\n[\n    {\n        \"sub_task\": \"Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.\",\n        \"func_list\": [\n            {\n                \"name\": \"searchFlights\",\n                \"description\": \"Retrieves available flight options for a given route and dates.\",\n                \"parameters\": {\n                    \"departure_city\": {\n                        \"type\": \"string\",\n                        \"description\": \"The city from which the flight will depart.\"\n                    },\n                    \"arrival_city\": {\n                        \"type\": \"string\",\n                        \"description\": \"The city to which the flight will arrive.\"\n                    },\n                    \"departure_date\": {\n                        \"type\": \"string\",\n                        \"description\": \"The date of the departure flight, in YYYY-MM-DD format.\"\n                    },\n                    \"return_date\": {\n                        \"type\": \"string\",\n                        \"description\": \"The date of the return flight, in YYYY-MM-DD format.\"\n                    },\n                    \"max_budget\": {\n                        \"type\": \"number\",\n                        \"description\": \"The maximum budget for the flight, in USD.\"\n                    }\n                },\n                \"required\": [\"departure_city\", \"arrival_city\", \"departure_date\", \"return_date\", \"max_budget\"],\n                \"responses\": {\n                    \"flights\": {\n                        \"type\": \"array\",\n                        \"description\": \"A list of flights within the specified budget, each containing flight details.\"\n                    }\n                }\n            }\n        ]\n    },\n    {\n        \"sub_task\": \"What is the airline offering the cheapest fare within the budget for this round-trip flight?\",\n        \"func_list\": []\n    }\n]\n```"
}
```
