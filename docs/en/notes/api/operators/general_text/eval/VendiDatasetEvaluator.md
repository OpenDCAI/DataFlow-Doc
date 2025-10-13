---
title: VendiDatasetEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/vendidatasetevaluator/
---

# 📘 VendiDatasetEvaluator

The `VendiDatasetEvaluator` is an operator designed to assess the diversity of a dataset by calculating the VendiScore. It utilizes pre-trained language models like BERT and SimCSE to generate text embeddings and then computes a diversity score based on the eigenvalues of the kernel matrix derived from these embeddings. This provides a quantitative measure of diversity for a given set of text data.

## `__init__`
```python
def __init__(self, device='cuda')
```
| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **device** | str | 'cuda' | The computing device to use for model inference (e.g., 'cuda' for GPU, 'cpu' for CPU). |

## Prompt Template Descriptions
| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | An instance of DataFlowStorage, responsible for reading the input dataframe. |
| **input_key** | str | Required | The name of the column in the input dataframe that contains the text samples to be evaluated. |

## 🧠 Example Usage
```python

```

## 🧾 Default Output Format (Output Format)
The operator returns a dictionary containing the calculated VendiScores.

| Field | Type | Description |
| :--- | :--- | :--- |
| BERTVendiScore | float | The VendiScore calculated using embeddings from the 'bert-base-uncased' model. |
| SimCSEVendiScore | float | The VendiScore calculated using embeddings from the 'princeton-nlp/unsup-simcse-bert-base-uncased' model. |

**Example Input (from a dataframe with `input_key="text"`):**
```json
{"text": "The cat sat on the mat."}
{"text": "A dog barked at the moon."}
{"text": "Birds chirp in the morning."}
```
**Example Output:**
```json
{
    "BERTVendiScore": 2.85,
    "SimCSEVendiScore": 2.91
}
```
