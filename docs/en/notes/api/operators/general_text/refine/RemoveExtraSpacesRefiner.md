---
title: RemoveExtraSpacesRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removeextraspacesrefiner/
---

## 📘 Overview

The `RemoveExtraSpacesRefiner` is an operator designed to clean and standardize text data by removing redundant whitespace. It replaces any sequence of multiple spaces with a single space and trims leading and trailing whitespace from the text.

## `__init__`

```python
def __init__(self)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | This operator does not require any parameters during initialization. |

## Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
|---|---|---|---|
| | | | |

## `run`

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be processed. |

## 🧠 Example Usage

```python

```

#### 🧾 Output Format

The operator modifies the specified `input_key` column in place within the DataFrame.

**Example Input:**
(Assuming `input_key="text"`)
```json
{
"text":"This   is a    test sentence with   extra spaces.  "
}
```
**Example Output:**
(The `text` field in the DataFrame is updated)
```json
{
"text":"This is a test sentence with extra spaces."
}
```
