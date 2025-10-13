---
title: LexicalDiversityFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/lexicaldiversityfilter/
---

## 📘 Overview
The `LexicalDiversityFilter` is an operator that filters data based on lexical diversity scores. It measures lexical diversity using MTLD (Moving-Average Type-Token Ratio) and HDD (Hypergeometric Distribution Diversity) methods. Texts with scores outside a specified min/max range are discarded, while higher scores indicate more diverse vocabulary usage.

## __init__ function
```python
def __init__(self, min_scores: dict = {'mtld': 50, 'hdd': 0.8}, max_scores: dict = {'mtld': 99999, 'hdd': 1.0})
```
### init Parameter Descriptions
| Parameter Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **min_scores** | dict | `{'mtld': 50, 'hdd': 0.8}` | A dictionary of minimum score thresholds for each metric. |
| **max_scores** | dict | `{'mtld': 99999, 'hdd': 1.0}` | A dictionary of maximum score thresholds for each metric. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| --- | --- | --- | --- |
| | | | |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_keys=['mtld', 'hdd'])
```
#### Parameters
| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be analyzed. |
| **output_keys** | list | `['mtld', 'hdd']` | A list of the metric keys to use for calculating scores and filtering. |

## 🧠 Example Usage
```python

```
