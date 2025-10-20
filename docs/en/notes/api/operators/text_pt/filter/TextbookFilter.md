---
title: TextbookFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/filter/textbookfilter/
---

# 📘 TextbookFilter

## 概述
`TextbookFilter` is an operator that filters data based on scores from the TextbookScorer. It uses a FastText classifier to assess the educational value of text, determining if it is suitable as educational material. The classifier is trained to identify text with educational significance, a clear structure, and accurate knowledge, making it suitable for building educational datasets.

## __init__
```python
def __init__(self, min_score=0.99, max_score=1, model_cache_dir:str='./dataflow_cache')
```

### init Parameters
| Parameter | Type | Default | Description |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **min_score** | float | 0.99 | The minimum educational value score threshold for retaining samples. |
| **max_score** | int | 1 | The maximum educational value score threshold for retaining samples. |
| **model_cache_dir** | str | './dataflow_cache' | The directory for caching the scoring model. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| -------------------- | ----------- | -------------------- | ------------------- |
|                      |             |                      |                     |


## run
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='TextbookScore')
```
Executes the main logic of the operator. It reads an input DataFrame from storage, calculates the educational value score for the specified text column, adds the score as a new column, and writes back a new DataFrame containing only the rows that fall within the `[min_score, max_score]` range.

#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The column name of the input text to be evaluated. |
| **output_key** | str | "TextbookScore" | The column name for the generated educational value score. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator filters the input data and adds a new column containing the educational score. Only rows where the score is between `min_score` and `max_score` are kept.

| Field | Type | Description |
| :-------------- | :---- | :---------- |
| ... | ... | Original columns from the input data. |
| **TextbookScore** | float | The educational value score calculated for the text in `input_key`. The name of this field is determined by the `output_key` parameter. |

**Example Input:**
```json
{
    "text": "The mitochondria is the powerhouse of the cell."
}
{
    "text": "ummm i think maybe its like a cell thingy"
}
```
**Example Output (assuming `min_score=0.9` and the first entry scores 0.95 and the second scores 0.2):**
```json
{
    "text": "The mitochondria is the powerhouse of the cell.",
    "TextbookScore": 0.95
}
```
