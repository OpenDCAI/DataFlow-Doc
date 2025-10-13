---
title: LoremIpsumFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/loremipsumfilter/
---

## 📘 Overview

The `LoremIpsumFilter` is an operator designed to detect and filter out text that contains placeholder content like "lorem ipsum" based on a specified threshold.

## `__init__`

```python
def __init__(self, threshold: float=3e-8)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 3e-8 | The threshold for the ratio of "lorem ipsum" occurrences to the total text length. If the ratio exceeds this value, the text is filtered out. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='loremipsum_filter_label')
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance used for reading and writing the dataframe. |
| **input_key** | str | Required | The name of the column containing the text to be analyzed and filtered. |
| **output_key** | str | "loremipsum_filter_label" | The name of the new column that will be added to store the filter result (1 for pass, 0 for fail). |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

The operator adds a new column (specified by `output_key`) to the dataframe, which contains a label indicating whether the text passed the filter. It then filters the dataframe, so the final output only contains the rows that passed the check (where the label is 1).

| Field | Type | Description |
| :--- | :--- | :--- |
| *[input_key]* | str | The original input text from the specified input column. |
| *[output_key]* | int | The filter label. In the final output dataframe, this value will always be 1, as failed rows are removed. |

**Example Input:**

```json
{"text": "This is a valid sentence that should pass the filter."}
{"text": "lorem ipsum dolor sit amet, consectetur adipiscing elit."}
```

**Example Output (in storage):**

```json
{"text": "This is a valid sentence that should pass the filter.", "loremipsum_filter_label": 1}
```
