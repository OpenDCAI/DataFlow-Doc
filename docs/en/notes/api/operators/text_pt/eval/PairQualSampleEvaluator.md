---
title: PairQualSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/eval/pairqualsampleevaluator/
---

## 📘 Overview
`PairQualSampleEvaluator` is a text quality scoring operator based on the BGE model, trained on GPT pairwise comparison data, supporting both English and Chinese.

## `__init__` function
```python
def __init__(self, model_cache_dir:str='./dataflow_cache', device="cuda", lang='en', max_length=512)
```
| Parameter | Type | Default Value | Description |
| :------------------ | :---- | :-------------------- | :--------------------------------------------------------- |
| **model_cache_dir** | str | './dataflow_cache' | The directory to cache the downloaded model. |
| **device** | str | "cuda" | The device to run the model on (e.g., "cuda" or "cpu"). |
| **lang** | str | 'en' | The language of the model to use. Supports 'en' or 'zh'. |
| **max_length** | int | 512 | The maximum sequence length for the tokenizer. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| -------------------- | ----------- | -------------------- | ------------------- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='PairQualScore')
```
| Parameter | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be evaluated. |
| **output_key** | str | 'PairQualScore' | The name of the output column where the quality scores will be stored. |

## 🧠 Example Usage
```python
```
#### 🧾 Default Output Format
| Field | Type | Description |
| :-------------- | :---- | :------------------------------------------------------------ |
| *input_key* | str | The original input text from the specified input column. |
| PairQualScore | float | The calculated quality score, ranging from 0 to 1. |

Example Input:
```json
{
"instruction":"This is a high-quality piece of text that should receive a good score."
}
```
Example Output:
```json
{
"instruction":"This is a high-quality piece of text that should receive a good score.",
"PairQualScore": 0.958
}
```
