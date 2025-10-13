---
title: BleuSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/bleusampleevaluator/
---

## 📘 Overview
The `BleuSampleEvaluator` is an operator designed to calculate the BLEU score, which evaluates the n-gram overlap between a generated text and a reference text. It supports n-grams from 1 to 4.

## `__init__` function
```python
def __init__(self, n=4, eff="average", special_reflen=None)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **n** | int | 4 | The maximum n-gram length to consider. |
| **eff** | str | "average" | The method for calculating the effective reference length. Valid options are "shortest", "average", and "longest". |
| **special_reflen** | int | None | If specified, this value is used as the reference length, overriding the `eff` calculation. |

### Prompt Template Descriptions
<br>

## `run` function
```python
def run(self, storage, input_key, reference_key, output_key='BleuScore')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance used for reading and writing data. |
| **input_key** | str | Required | The column name corresponding to the generated text. |
| **reference_key** | str | Required | The column name corresponding to the reference text. |
| **output_key** | str | 'BleuScore' | The column name where the output BLEU score will be stored. |

## 🧠 Example Usage
<br>
