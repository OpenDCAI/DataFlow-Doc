---
title: ReasoningDifficultyDatasetEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/eval/reasoningdifficultydatasetevaluator/
---

## 📘 概述

`ReasoningDifficultyDatasetEvaluator` 是一个用于分析数据集难度分布的算子。它会统计数据集中不同难度级别的样本数量，并以字典形式返回统计结果，帮助用户了解数据集的整体难度构成。

## `__init__`函数

```python
@OPERATOR_REGISTRY.register()
class ReasoningDifficultyDatasetEvaluator(OperatorABC):
    def __init__(self):
```
该函数没有参数。

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_diffulty_key: str = "difficulty_score"):
```

### run参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取数据。 |
| **input_diffulty_key** | str | "difficulty_score" | 输入列名，对应难度分数字段。 |

## 🧠 示例用法
```python
from dataflow.operators.reasoning import ReasoningDifficultyDatasetEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC

class ReasoningDifficultyDatasetEvaluatorTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = ReasoningDifficultyDatasetEvaluator()
        
    def forward(self):
        self.evaluator.run(
            storage = self.storage.step(),
            input_diffulty_key = "difficulty_score",
        )

if __name__ == "__main__":
    pl = ReasoningDifficultyDatasetEvaluatorTest()
    pl.forward()
```

#### 🧾 返回值 (Return Value)

该算子返回一个字典，其中键（key）为数据集中的难度级别，值（value）为对应难度级别的样本数量。

示例返回值：
```json
{
  "Easy": 150,
  "Medium": 200,
  "Hard": 80
}
```
