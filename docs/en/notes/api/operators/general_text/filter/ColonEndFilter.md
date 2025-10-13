---
title: ColonEndFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/filter/colonendfilter/
---

## 📘 Overview
The `ColonEndFilter` is an operator designed to check if a given text ends with a colon (`:`). It is typically used to filter out incomplete questions or prompts from a dataset. The operator adds a label to each entry indicating whether it passes the check and then returns a new DataFrame containing only the entries that do not end with a colon.

## `__init__`
```python
def __init__(self)
```
### init parameters
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | This operator does not require any parameters during initialization. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = None)
```
Executes the main logic of the operator. It reads a DataFrame from storage, checks each text entry in the specified `input_key` column to see if it ends with a colon, adds a new column with the check result, and writes the filtered DataFrame back to storage.

#### Parameters
| Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance responsible for reading and writing data. |
| **input_key** | str | Required | The name of the input column containing the text to be checked. |
| **output_key**| str | None | The name of the output column where the filter result (1 for pass, 0 for fail) is stored. If not provided, it defaults to a name generated from the class name (e.g., "colonendfilter_label"). |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator adds a new column (specified by `output_key`) to the input data and filters the rows.

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_key* | str | The original input text from the specified column. |
| *output_key* | int | The result of the filter check. `1` if the text does not end with a colon, `0` otherwise. The final output only contains rows where this value is `1`. |

**Example Input:**
```json
{"text": "Explain the theory of relativity"}
{"text": "List the following items:"}
```

**Example Output:**
The output DataFrame will only contain the rows that passed the filter.
```json
{
    "text": "Explain the theory of relativity",
    "colonendfilter_label": 1
}
```
