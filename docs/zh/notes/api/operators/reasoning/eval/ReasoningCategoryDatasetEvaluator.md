---
title: ReasoningCategoryDatasetEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/eval/reasoningcategorydatasetevaluator/
---

## 📘 概述 [ReasoningCategoryDatasetEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
该算子用于统计数据集中的类别信息，包括主类别和次类别的分布情况。它计算每个类别的样本数量，并返回类别分布的统计结果。

## __init__函数
```python
def __init__(self)
```
该函数无输入参数。

## run函数
```python
def run(self, storage: DataFlowStorage, input_primary_category_key: str = "primary_category", input_secondary_category_key: str = "secondary_category")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :----------------------------- | :---------------- | :--------------------- | :--------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取数据。 |
| **input_primary_category_key** | str | "primary_category" | 输入的主类别列名。 |
| **input_secondary_category_key** | str | "secondary_category" | 输入的次类别列名。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| key | str | 主类别名称。 |
| value | dict | 包含该主类别样本总数（`primary_num`）及各次类别样本数的字典。 |

示例输入（存储在`storage`中的dataframe行）：
```json
{ "primary_category": "科学", "secondary_category": "物理" }
{ "primary_category": "科学", "secondary_category": "化学" }
{ "primary_category": "科学", "secondary_category": "物理" }
{ "primary_category": "人文", "secondary_category": "历史" }
```
示例输出：
```json
{
  "科学": {
    "primary_num": 3,
    "物理": 2,
    "化学": 1
  },
  "人文": {
    "primary_num": 1,
    "历史": 1
  }
}
```
