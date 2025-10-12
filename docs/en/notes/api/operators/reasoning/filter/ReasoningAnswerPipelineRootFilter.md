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

```python
from dataflow.operators.reasoning import ReasoningAnswerPipelineRootFilter
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC

class ReasoningAnswerPipelineRootFilterTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.operator = ReasoningAnswerPipelineRootFilter()   
        
    def forward(self):
        self.operator.run(
            storage = self.storage.step(),
            input_answer_key="output",
            input_gt_key="golden_answer"    
        )

if __name__ == "__main__":
    pl = ReasoningAnswerPipelineRootFilterTest()
    pl.forward()
```

#### 🧾 Default Output Format (Output Format)
This operator does not change the column structure of the original data, but splits the data flow into two outputs based on whether the `input_gt_key` column has valid values.

| Field | Type | Description |
| :--- | :--- | :--- |
| ... | ... | All original fields from the input data. |
| [input_gt_key] | str | The processed ground truth label column. For data without initial labels, it may be extracted and filled from the `input_answer_key` column. |
