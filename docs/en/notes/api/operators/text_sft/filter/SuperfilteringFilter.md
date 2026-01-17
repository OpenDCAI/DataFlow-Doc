---
title: SuperfilteringFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/filter/superfilteringfilter/
---

## 📘 SuperfilteringFilter
The `SuperfilteringFilter` is an operator designed to filter out low-quality data using the Superfiltering scorer. It evaluates the difficulty of following instructions by calculating a perplexity ratio with a GPT-2 model; a lower ratio indicates that the instruction is easier for the model to understand and execute. This is suitable for selecting instruction data that is appropriate for specific model capabilities, thereby improving the efficiency and effectiveness of model training.

## `__init__`
```python
def __init__(self, min_score=0.0, max_score=1.0, device='cuda', model_cache_dir='./dataflow_cache', max_length=512):
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 0.0 | Minimum score threshold for retaining samples. |
| **max_score** | float | 1.0 | Maximum score threshold for retaining samples. |
| **device** | str | 'cuda' | The device on which the model will run. |
| **model_cache_dir** | str | './dataflow_cache'| The directory for caching the model. |
| **max_length** | int | 512 | The maximum length of the text. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_input_key: str = 'input', input_output_key: str = 'output', output_key: str = "SuperfilteringScore"):
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_instruction_key**| str | 'instruction' | The column name for the instruction field. |
| **input_input_key** | str | 'input' | The column name for the input field. |
| **input_output_key** | str | 'output' | The column name for the output field. |
| **output_key** | str | "SuperfilteringScore" | The column name for the generated filter score. |

## 🧠 Example Usage
```python
from dataflow.operators.text_sft.filter import SuperfilteringFilter
from dataflow.utils.storage import FileStorage

# Prepare storage with instruction-output pairs
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# Initialize and run the filter
superfiltering_filter = SuperfilteringFilter(
    min_score=0.0,
    max_score=1.0,
    device="cuda",
    model_cache_dir="./dataflow_cache",
    max_length=512,
)
superfiltering_filter.run(
    storage.step(),
    input_instruction_key="instruction",
    input_input_key="input",
    input_output_key="output",
    output_key="SuperfilteringScore",
)
```

#### 🧾 Default Output Format (Output Format)
The operator adds a new column with the calculated score and then filters the rows based on the `min_score` and `max_score` thresholds.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input data. |
| SuperfilteringScore | float | The calculated score by the Superfiltering scorer. The dataframe is filtered to only include rows where this score is between `min_score` and `max_score`. |

**Example Input:**
```json
{
  "instruction": "Can you provide a list of healthy habits to maintain a healthy lifestyle? Please format your response as an HTML page with bullet points.",
  "output": "Here's an HTML page with bullet points for healthy habits:\n<html>\n  <body>\n    <h3>Healthy Habits:</h3>\n    <ul>\n      <li>Eating a balanced diet with plenty of fruits and vegetables.</li>\n      <li>Engaging in regular physical activity, such as walking, running, or cycling.</li>\n      <li>Getting enough sleep each night, ideally 7-8 hours.</li>\n      <li>Staying hydrated by drinking plenty of water throughout the day.</li>\n      <li>Limiting alcohol consumption and avoiding smoking.</li>\n      <li>Managing stress through relaxation techniques like meditation or yoga.</li>\n      <li>Regularly visiting a healthcare provider for check-ups and preventative care.</li>\n    </ul>\n  </body>\n</html>"
}
```

**Example Output (if it passes the filter):**
```json
{
  "instruction": "Can you provide a list of healthy habits to maintain a healthy lifestyle? Please format your response as an HTML page with bullet points.",
  "output": "Here's an HTML page with bullet points for healthy habits:\n<html>\n  <body>\n    <h3>Healthy Habits:</h3>\n    <ul>\n      <li>Eating a balanced diet with plenty of fruits and vegetables.</li>\n      <li>Engaging in regular physical activity, such as walking, running, or cycling.</li>\n      <li>Getting enough sleep each night, ideally 7-8 hours.</li>\n      <li>Staying hydrated by drinking plenty of water throughout the day.</li>\n      <li>Limiting alcohol consumption and avoiding smoking.</li>\n      <li>Managing stress through relaxation techniques like meditation or yoga.</li>\n      <li>Regularly visiting a healthcare provider for check-ups and preventative care.</li>\n    </ul>\n  </body>\n</html>",
  "SuperfilteringScore": 0.8576479985
}
```
