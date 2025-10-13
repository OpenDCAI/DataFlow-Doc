---
title: HtmlEntityFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/htmlentityfilter/
---

# 📘 Overview
The `HtmlEntityFilter` is an operator designed to detect and filter out text that contains HTML entities (e.g., `&amp;`, `&lt;`, `&gt;`). This ensures that the processed text is free from markup language elements.

## \_\_init\_\_
```python
def __init__(self)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **No parameters** | | | |

## Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run
```python
def run(self, storage, input_key, output_key='html_entity_filter_label')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the column containing the text to be filtered. |
| **output_key** | str | 'html_entity_filter_label' | The name of the new column that will store the filter label (1 for valid, 0 for invalid). |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format (Output Format)
The operator filters the input DataFrame, so only the rows that do not contain HTML entities are kept in the output. A new column is added with the `output_key` name to indicate the result of the check (which will be `1` for all rows in the output).

| Field | Type | Description |
| :--- | :--- | :--- |
| `<input_key>` | str | The original input text from the row that passed the filter. |
| `<output_key>` | int | The filter label, which will always be 1 for rows in the output DataFrame. |

Example Input (in storage):
```json
{"text": "This is a test with &amp; an entity."}
{"text": "This is a clean text."}
```
Example Output (written to storage):
```json
{"text": "This is a clean text.", "html_entity_filter_label": 1}
```
