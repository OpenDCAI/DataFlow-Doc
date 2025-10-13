---
title: TreeinstructFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/filter/treeinstructfilter/
---

## 📘 概述

[TreeinstructFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filters/treeinstruct_filter.py) 是一个基于 TreeinstructScore 打分器对数据进行过滤的算子。它通过生成语法树的节点数来衡量指令的复杂性，节点越多表示指令越复杂。该算子适用于筛选特定复杂度范围内的指令数据，以平衡数据集的难度分布，从而优化模型训练效果。

## `__init__`函数

```python
def __init__(self, min_score: int = 7, max_score: int = 100, llm_serving: LLMServingABC = None):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :-------------- | :------------- | :------- | :--------------------------------------- |
| **min_score** | int | 7 | 保留样本的最小语法树节点数阈值。 |
| **max_score** | int | 100 | 保留样本的最大语法树节点数阈值。 |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行打分。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :---------------- | :------- | :------- | :------- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'TreeinstructScore'):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :---------- | :---------------- | :------------------ | :------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应指令字段。 |
| **output_key**| str | "TreeinstructScore" | 输出列名，对应生成的语法树节点数字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :------------------ | :--- | :------------------- |
| [input_key] | str | 输入的指令文本。 |
| [output_key] | int | 模型生成的语法树节点数。 |

示例输入：

```json
{
  "instruction": "请解释一下什么是人工智能，并列举三个实际应用案例。"
}
```

示例输出（假设该指令的节点数分值为 15）：

```json
{
  "instruction": "请解释一下什么是人工智能，并列举三个实际应用案例。",
  "TreeinstructScore": 15
}
```
