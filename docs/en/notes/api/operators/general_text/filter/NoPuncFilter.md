---
title: NoPuncFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/nopuncfilter/
---

## 📘 Overview
`NoPuncFilter` is an operator that filters text by ensuring no sentence within the text exceeds a specified word count threshold. It identifies and flags texts containing overly long sentences.

## `__init__` function
```python
def __init__(self, threshold: int=112):
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | int | 112 | The maximum word count threshold for a sentence. Texts containing any sentence exceeding this word count will be filtered out. |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='no_punc_filter_label')
```
#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :------------------------ | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The column name of the input text to be filtered. |
| **output_key** | str | "no_punc_filter_label" | The column name for the output label, which indicates if the text passes the filter. |

## Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
|---|---|---|---|
| | | | |

## 🧠 Example Usage
```python

```
#### 🧾 Default Output Format
The operator adds a new column (specified by `output_key`) to the input data to store the filter result.

| Field | Type | Description |
| :-------------- | :---- | :---------- |
| [input_key] | str | The original input text. |
| no_punc_filter_label | int | The filter result. `1` if the text passes the check (no sentence exceeds the threshold), `0` otherwise. |

**Example Input:**
```json
{
"text":"This is the first sentence. This is the second sentence, which is also well within the length limit."
}
```
**Example Output:**
```json
{
"text":"This is the first sentence. This is the second sentence, which is also well within the length limit.",
"no_punc_filter_label": 1
}
```
