---
title: Task2VecDatasetEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/task2vecdatasetevaluator/
---

## 📘 Overview
[Task2VecDatasetEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluator/task2vec_dataset_evaluator.py) is an operator that evaluates dataset diversity using the Task2Vec method. It quantifies diversity by calculating the cosine distance matrix of sample embeddings extracted from the dataset. This operator is useful for understanding the variety and complexity of tasks represented within a given set of text data.

## `__init__` function
```python
def __init__(self, device='cuda', sample_nums=10, sample_size=1, method: Optional[str]='montecarlo', model_cache_dir='./dataflow_cache')
```
### init Parameters
| Parameter | Type | Default | Description |
| :------------------ | :---- | :-------------------- | :------------------------------------------------------------------------------------ |
| **device** | str | 'cuda' | The computing device to use for model inference (e.g., 'cuda' or 'cpu'). |
| **sample_nums** | int | 10 | The total number of sampling iterations to perform for the diversity calculation. |
| **sample_size** | int | 1 | The number of text samples to draw in each sampling iteration. |
| **method** | str | 'montecarlo' | The embedding method to use. Valid options are 'montecarlo' and 'variational'. |
| **model_cache_dir** | str | './dataflow_cache' | The directory where pre-trained models (GPT-2) are cached. |

### Prompt Template Descriptions
(This operator does not use prompt templates.)

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :--------- | :--------------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance from which to read the input DataFrame. |
| **input_key** | str | Required | The name of the column in the DataFrame that contains the input text samples to be evaluated. |

## 🧠 Example Usage
```python

```

#### 🧾 Output Format
| Field | Type | Description |
| :------------------------ | :-------------- | :-------------------------------------------------- |
| Task2VecDiversityScore | float | The calculated diversity score for the dataset. |
| ConfidenceInterval | tuple (float, float) | The confidence interval for the diversity score. |

**Example Input:**
An input file `data.jsonl` read by the `storage` object, where `input_key` is `"text"`:
```json
{"text": "What is the capital of France?"}
{"text": "Solve the equation x^2 - 5x + 6 = 0."}
{"text": "Summarize the plot of 'To Kill a Mockingbird'."}
{"text": "Translate 'hello world' to Spanish."}
```
**Example Output:**
A dictionary containing the diversity score and confidence interval.
```json
{
    "Task2VecDiversityScore": 0.8532,
    "ConfidenceInterval": [0.7912, 0.9152]
}
```
