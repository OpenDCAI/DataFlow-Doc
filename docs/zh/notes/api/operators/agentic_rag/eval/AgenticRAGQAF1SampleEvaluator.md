---
title: AgenticRAGQAF1SampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/agentic_rag/eval/agenticragqaf1sampleevaluator/
---

## 📘 概述
`AgenticRAGQAF1SampleEvaluator` 是一个评估算子，用于计算预测答案与一个或多个参考答案之间的 F1 分数。

## `__init__`函数
```python
def __init__(self)
```
### init参数说明
该算子初始化时无需传入参数。
### Prompt模板说明

## run函数
```python
def run(self, 
        storage: DataFlowStorage, 
        input_prediction_key:str ="refined_answer",
        input_ground_truth_key:str ="golden_doc_answer",
        output_key:str ="F1Score",
        )
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_prediction_key** | str | "refined_answer" | 输入的预测答案所在的列名。 |
| **input_ground_truth_key** | str | "golden_doc_answer" | 输入的标准答案所在的列名。 |
| **output_key** | str | "F1Score" | 输出的F1分数结果所在的列名。 |

## 🧠 示例用法
