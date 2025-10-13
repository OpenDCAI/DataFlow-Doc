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

```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_fields* | - | All fields from the input data are preserved. |
| functions | str | The generated functions as a string. (Note: The field name is determined by the `output_key` parameter). |

**Example Input:**

```json
{
  "composition_task": "Develop a system to process customer orders.",
  "sub_tasks": [
    "Receive order from API",
    "Validate payment",
    "Update inventory",
    "Send confirmation email"
  ]
}
```

**Example Output:**

```json
{
  "composition_task": "Develop a system to process customer orders.",
  "sub_tasks": [
    "Receive order from API",
    "Validate payment",
    "Update inventory",
    "Send confirmation email"
  ],
  "functions": "def receive_order(api_data):\n    # Code to process order\n    pass\n\ndef validate_payment(order_id):\n    # Code to validate payment\n    pass\n\ndef update_inventory(product_id, quantity):\n    # Code to update inventory\n    pass\n\ndef send_confirmation_email(customer_email, order_details):\n    # Code to send email\n    pass"
}
```
