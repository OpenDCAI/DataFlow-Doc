---
title: DeitaQualitySampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/eval/deitaqualitysampleevaluator/
---

# 📘 DeitaQualitySampleEvaluator
`DeitaQualitySampleEvaluator` is an operator designed to evaluate the quality of instruction-response pairs. It utilizes the `hkust-nlp/deita-quality-scorer` model to generate a quality score ranging from 1 to 6 for each sample.

## `__init__` function
```python
def __init__(self, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **device** | str | 'cuda' | The device to run the model on, e.g., 'cuda' or 'cpu'. |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded Hugging Face model. |
| **max_length** | int | 512 | The maximum sequence length for the model input. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_output_key: str = 'output', output_key: str = 'DeitaQualityScore')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading the input DataFrame and writing the results. |
| **input_instruction_key** | str | 'instruction' | The column name in the input DataFrame that contains the instruction text. |
| **input_output_key** | str | 'output' | The column name in the input DataFrame that contains the response text. |
| **output_key** | str | 'DeitaQualityScore' | The column name to store the generated quality score in the output DataFrame. |

## 🧠 Example Usage
```python

```

#### 🧾 Default output format (Output Format)
| Field | Type | Description |
| :--- | :--- | :--- |
| instruction | str | The input instruction text. |
| output | str | The input response text. |
| DeitaQualityScore | float | The generated quality score, a value between 1 and 6. |
