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

```
#### 🧾 Default Output Format (Output Format)
The operator adds a new column with the calculated score and then filters the rows based on the `min_score` and `max_score` thresholds.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | Original columns from the input data. |
| SuperfilteringScore | float | The calculated score by the Superfiltering scorer. The dataframe is filtered to only include rows where this score is between `min_score` and `max_score`. |
