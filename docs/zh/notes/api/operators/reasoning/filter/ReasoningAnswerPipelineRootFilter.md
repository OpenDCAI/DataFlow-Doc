---
title: ReasoningAnswerPipelineRootFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/filter/reasoninganswerpipelinerootfilter/
---

## 📘 概述 [ReasoningAnswerPipelineRootFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
答案处理流程根节点，负责将输入数据根据有无真实标签（Ground Truth）分发到不同的处理分支。如果真实标签列不存在或为空，算子会尝试从模型输出的答案列中提取标签。最终，数据被拆分为带有真实标签和不带真实标签两部分，分别写入不同的输出。

## `__init__`函数
```python
@OPERATOR_REGISTRY.register()
class ReasoningAnswerPipelineRootFilter(OperatorABC):
    def __init__(self):
```
无其它参数。


## run函数
```python
def run(storage, input_answer_key="output", input_gt_key="golden_answer")
```
执行算子主逻辑，从存储中读取输入 DataFrame，根据是否存在真实标签（GT）将其拆分为两个 DataFrame，并将结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_answer_key** | str | "output" | 输入的模型生成答案列名。当真实标签缺失时，会尝试从此列提取答案作为标签。 |
| **input_gt_key** | str | "golden_answer" | 输入的真实标签（Ground Truth）列名，用于区分数据。 |

## 🧠 示例用法
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

#### 🧾 默认输出格式（Output Format）
该算子不改变原始数据的列结构，而是根据 `input_gt_key` 列是否存在有效值，将数据流拆分为两个输出。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入数据的所有原始字段。 |
| [input_gt_key] | str | 经过处理的真实标签列。对于没有初始标签的数据，可能会从`input_answer_key`列中提取并填充。 |
