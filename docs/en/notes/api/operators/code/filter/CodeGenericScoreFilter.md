---
title: CodeGenericScoreFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/filter/codegenericscorefilter/
---

## 📘 CodeGenericScoreFilter
CodeGenericScoreFilter is a generic score-based filtering operator that filters datasets based on numerical score columns. It provides flexible comparison methods to remove samples that don't meet specified threshold criteria.

## \_\_init\_\_ function
```python
def __init__(self)
```
This operator does not require any parameters during initialization.

## run function
```python
def run(storage, input_key, output_key="generic_score_filter_label", score_threshold=8, filter_method="greater_equal")
```
#### Parameters
| Name | Type | Default | Description |
| :------------------ | :---------------- | :------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The column name containing the numerical score to be used for filtering. |
| **output_key** | str | "generic\_score\_filter\_label" | The column name for the output label. The operator will add this column with a value of 1 for rows that pass the filter. |
| **score\_threshold** | int | 8 | The numerical threshold value used for the comparison. |
| **filter\_method** | str | "greater\_equal" | The comparison method to use. Options are: "greater", "greater\_equal", "less", "less\_equal", "equal". |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| -------------------- | ----------- | ------------------ | ------------------- |
| | | | |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator filters the input DataFrame, keeping only the rows that satisfy the specified condition. It also adds a new label column (specified by `output_key`) to the kept rows.

| Field | Type | Description |
| :------------------------------- | :-------------- | :------------------------------------------------------------------------------------------------------- |
| *<existing_columns>* | any | Original columns from the input data. |
| *<input_key>* | int or float | The original score column used for filtering. |
| *<output_key>* | int | The filter label, which will be 1 for all rows in the output, indicating they passed the filter criteria. |

Example Input:
```json
{
"code_sample": "def calculate_sum(a, b): return a + b",
"code_quality_score": 9.5
}
```
Example Output (using `input_key="code_quality_score"` and default filter settings):
```json
{
"code_sample": "def calculate_sum(a, b): return a + b",
"code_quality_score": 9.5,
"generic_score_filter_label": 1
}
```
