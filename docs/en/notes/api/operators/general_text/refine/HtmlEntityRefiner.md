---
title: HtmlEntityRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/htmlentityrefiner/
---

## 📘 Overview

The `HtmlEntityRefiner` is an operator designed to remove HTML entities from text. It handles standard entities (e.g., `&nbsp;`, `&lt;`) as well as various non-standard formats, such as those using full-width ampersands or Chinese semicolons. Users can customize the list of HTML entities to be removed.

## `__init__`
```python
def __init__(self, html_entities: list = [
            "nbsp", "lt", "gt", "amp", "quot", "apos", "hellip", "ndash", "mdash", 
            "lsquo", "rsquo", "ldquo", "rdquo"
        ]):
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **html_entities** | list | `["nbsp", "lt", ...]` | A list of HTML entity names to be removed from the text. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str):
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be processed. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| `[input_key]` | str | The input text with the specified HTML entities removed. |
| `...` | any | Other columns from the input DataFrame remain unchanged. |

**Example Input:**
(Assuming the input data is in a DataFrame and `input_key` is set to `"text"`)
```json
{
"text":"This text contains an entity&nbsp;and another one&lt;."
}
```
**Example Output:**
```json
{
"text":"This text contains an entityand another one."
}
```
