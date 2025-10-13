---
title: ReasoningAnswerFormatterFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/filter/reasoninganswerformatterfilter/
---

# 📘 ReasoningAnswerFormatterFilter

The `ReasoningAnswerFormatterFilter` is an operator designed to validate and filter answers based on their format. It primarily checks if a generated answer conforms to a specific structure, such as including the final answer within a `\boxed{}` notation, which is common in mathematical problems.

## `__init__` function

```python
def __init__(self)
```
This operator does not require any parameters during initialization.

### Prompt Template Descriptions
| Prompt Template Name | Primary Purpose | Applicable Scenarios | Feature Description |
|---|---|---|---|
| | | | |

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str = "generated_cot")
```
Executes the main logic of the operator. It reads a dataframe from storage, filters rows based on the answer format in the specified `input_key` column, and writes the filtered dataframe back to storage.

#### Parameters
| Name | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading the input dataframe and writing the filtered result. |
| **input_key** | str | "generated_cot" | The name of the column containing the generated answer to be validated. |

## 🧠 Example Usage

#### 🧾 Output Format
The operator filters the input dataframe, retaining only the rows where the answer in the `input_key` column passes the format validation. The schema of the output dataframe is identical to the input dataframe, but it may contain fewer rows. The filtered data is written to a new file in the storage.
