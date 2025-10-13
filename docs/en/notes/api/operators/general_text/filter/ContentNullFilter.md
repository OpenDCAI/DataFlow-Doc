---
title: ContentNullFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/contentnullfilter/
---

## 📘 Overview

The `ContentNullFilter` is an operator designed to filter out entries that have null, empty, or whitespace-only content in a specified column, ensuring data quality and validity.

## __init__ function
```python
def __init__(self)
```
This function does not take any arguments.

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='content_null_filter_label')
```
#### Parameters
| Name | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be checked. |
| **output_key** | str | 'content_null_filter_label' | The name for the new column that stores the filter result (1 for valid, 0 for invalid) before filtering is applied. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format (Output Format)
The operator filters the input data, so only rows that pass the null/empty check will be present in the output. A new column (specified by `output_key`) is added to show the filter result (which will always be `1` in the final output data).

| Field | Type | Description |
| :-------------- | :---- | :---------- |
| *original_fields* | * | The original fields from the input data are preserved. |
| content_null_filter_label | int | The result of the filter check. For all rows in the output, this will be `1`. |

**Example Input:**
```json
{
"text":"This is a valid piece of text."
}
```
**Example Output:**
```json
{
"text":"This is a valid piece of text.",
"content_null_filter_label": 1
}
```
*(Note: An input like `{"text": " "}` or `{"text": null}` would be removed and not appear in the output.)*
