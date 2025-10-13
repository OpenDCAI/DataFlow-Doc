---
title: WordNumberFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/wordnumberfilter/
---

## 📘 Overview
The `WordNumberFilter` is an operator designed to filter out text entries based on their word count, keeping only those that fall within a specified range.

## `__init__`
```python
def __init__(self, min_words: int=20, max_words: int=100000)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_words** | int | 20 | The minimum number of words required for a text to be kept. |
| **max_words** | int | 100000 | The maximum number of words allowed for a text to be kept. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
|---|---|---|---|
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='word_number_filter_label')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be filtered. |
| **output_key** | str | 'word_number_filter_label' | The name of the new column where the word count for each text will be stored. |

## 🧠 Example Usage
```python
```
