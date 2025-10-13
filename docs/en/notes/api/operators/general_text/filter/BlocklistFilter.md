---
title: BlocklistFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/blocklistfilter/
---

## 📘 Overview
The `BlocklistFilter` is an operator designed to filter text based on language-specific blocklists. It identifies and removes rows containing words from a predefined list, with optional support for a tokenizer for more accurate word-level matching.

## `__init__` function
```python
def __init__(self, language:str = 'en', threshold:int = 1, use_tokenizer:bool = False)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **language** | str | 'en' | The language code for selecting the appropriate blocklist (e.g., 'en', 'zh'). |
| **threshold** | int | 1 | The maximum number of blocklisted words allowed. Texts with a count of blocklisted words above this threshold are filtered out. |
| **use_tokenizer**| bool | False | If `True`, a word tokenizer is used for matching. If `False`, text is split by whitespace. |

### Prompt Template Descriptions
| Name | Purpose | Scene | Features |
| :--- | :--- | :--- | :--- |
| | | | |

## `run` function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'blocklist_filter_label')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance used for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be filtered. |
| **output_key**| str | 'blocklist_filter_label' | The name of the output column that stores the filter result (a label of 1 indicates passing the filter). |

## 🧠 Example Usage
```python

```
#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :--- | :--- | :--- |
| [input_key] | str | The original input text. |
| [output_key] | int | The filter label, which is 1 for all rows that pass the filter. |

**Example Input:**
Assume the blocklist contains the word "badword". The input dataframe might look like this:
```json
[
    {"text": "This is a clean sentence."},
    {"text": "This sentence contains a badword."}
]
```
**Example Output:**
The operator filters out the row containing the blocklisted word and adds the output label column.
```json
[
    {
        "text": "This is a clean sentence.",
        "blocklist_filter_label": 1
    }
]
```
