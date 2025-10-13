---
title: TextNormalizationRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/textnormalizationrefiner/
---

## 📘 Overview [TextNormalizationRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
This operator normalizes date formats and currency formats in text to standard representations. It unifies date formats to 'YYYY-MM-DD' and currency formats to 'amount USD' to improve data consistency.

## `__init__` function
```python
def __init__(self)
```
### init parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | No initialization parameters. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| -------------------- | ----------- | -------------------- | ------------------- |
| **-** | - | - | - |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The data flow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be normalized. |

## 🧠 Example Usage
```python
# Blank
```
