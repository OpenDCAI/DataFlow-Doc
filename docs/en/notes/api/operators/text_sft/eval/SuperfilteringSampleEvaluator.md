---
title: SuperfilteringSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/eval/superfilteringsampleevaluator/
---

## 📘 Overview
The `SuperfilteringSampleEvaluator` is an operator that evaluates the difficulty of following instructions using the Superfiltering method. It calculates the ratio of conditional perplexity to independent perplexity based on the GPT-2 model. Higher scores indicate greater difficulty in following the instruction. This method assesses instruction clarity and follow difficulty by comparing response perplexity under instruction conditions with independent response perplexity.

## `__init__`
```python
__init__(self, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda' or 'cpu'). |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded Hugging Face model. |
| **max_length** | int | 512 | The maximum sequence length for the tokenizer and model. |

### Prompt Template Descriptions

## `run`
```python
run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_input_key: str = None, input_output_key: str = 'output', output_key: str = 'SuperfilteringScore')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading from and writing to. |
| **input_instruction_key** | str | 'instruction' | The column name in the input dataframe that contains the instruction text. |
| **input_input_key** | str | None | The column name for the optional input text accompanying the instruction. |
| **input_output_key** | str | 'output' | The column name for the response text to be evaluated. |
| **output_key** | str | 'SuperfilteringScore' | The column name where the calculated Superfiltering score will be stored. |

## 🧠 Example Usage
```python
from dataflow.operators.text_sft.eval import SuperfilteringSampleEvaluator
from dataflow.utils.storage import FileStorage

# Prepare storage with instruction-output pairs
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# Initialize and run the evaluator
evaluator = SuperfilteringSampleEvaluator(
    device="cuda",
    model_cache_dir="./dataflow_cache",
    max_length=512,
)
evaluator.run(
    storage.step(),
    input_instruction_key="instruction",
    input_input_key=None,
    input_output_key="output",
    output_key="SuperfilteringScore",
)
```

## 🧾 Output Format
The operator adds a new column (specified by `output_key`) to the input dataframe.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input dataframe are preserved. |
| **SuperfilteringScore** | float | The calculated perplexity ratio. Higher values indicate greater instruction following difficulty. |

**Example Input:**
```json
{
  "instruction": "Can you provide a list of healthy habits to maintain a healthy lifestyle? Please format your response as an HTML page with bullet points.",
  "output": "Here's an HTML page with bullet points for healthy habits:\n<html>\n  <body>\n    <h3>Healthy Habits:</h3>\n    <ul>\n      <li>Eating a balanced diet with plenty of fruits and vegetables.</li>\n      <li>Engaging in regular physical activity, such as walking, running, or cycling.</li>\n      <li>Getting enough sleep each night, ideally 7-8 hours.</li>\n      <li>Staying hydrated by drinking plenty of water throughout the day.</li>\n      <li>Limiting alcohol consumption and avoiding smoking.</li>\n      <li>Managing stress through relaxation techniques like meditation or yoga.</li>\n      <li>Regularly visiting a healthcare provider for check-ups and preventative care.</li>\n    </ul>\n  </body>\n</html>"
}
```

**Example Output:**
```json
{
  "instruction": "Can you provide a list of healthy habits to maintain a healthy lifestyle? Please format your response as an HTML page with bullet points.",
  "output": "Here's an HTML page with bullet points for healthy habits:\n<html>\n  <body>\n    <h3>Healthy Habits:</h3>\n    <ul>\n      <li>Eating a balanced diet with plenty of fruits and vegetables.</li>\n      <li>Engaging in regular physical activity, such as walking, running, or cycling.</li>\n      <li>Getting enough sleep each night, ideally 7-8 hours.</li>\n      <li>Staying hydrated by drinking plenty of water throughout the day.</li>\n      <li>Limiting alcohol consumption and avoiding smoking.</li>\n      <li>Managing stress through relaxation techniques like meditation or yoga.</li>\n      <li>Regularly visiting a healthcare provider for check-ups and preventative care.</li>\n    </ul>\n  </body>\n</html>",
  "SuperfilteringScore": 0.8576479985
}
```
