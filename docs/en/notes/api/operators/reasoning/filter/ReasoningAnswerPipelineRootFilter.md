---
title: ReasoningAnswerPipelineRootFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/reasoning/filter/reasoninganswerpipelinerootfilter/
---

## 📘 ReasoningAnswerPipelineRootFilter
`ReasoningAnswerPipelineRootFilter` is the root node of the answer processing pipeline. It is responsible for distributing the input data to different processing branches based on whether a ground truth (GT) label is present.

## `__init__`
```python
__init__(self)
```
### init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **-** | - | - | No parameters. |

### Prompt Template Descriptions



## `run`
```python
run(self, storage, input_answer_key="output", input_gt_key="golden_answer")
```
This function executes the main logic of the operator. It reads a DataFrame, splits it into two based on the presence of a ground truth key, and writes them back to storage.

#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance for reading and writing data. |
| **input_answer_key** | str | "output" | The column name for the model's generated answer. |
| **input_gt_key** | str | "golden_answer" | The column name for the ground truth (GT) label, used to split the data. |

## 🧠 Example Usage


#### 🧾 Default Output Format (Output Format)
This operator splits the input data into two potential output files, preserving the original schema.

*   **Output with GT**: A file containing rows where the `input_gt_key` column has a valid value.
*   **Output without GT**: A file containing rows where the `input_gt_key` column is missing or empty. In this output, the `input_gt_key` column is added and set to `None`.
