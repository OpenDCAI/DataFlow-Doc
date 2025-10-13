---
title: PerspectiveFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/perspectivefilter/
---

## 📘 概述

[PerspectiveFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/perspective_filter.py) 是一个基于 Perspective API 的数据过滤算子，用于评估文本的毒性，并根据设定的得分阈值筛选数据。得分越高，表示文本的毒性越高。

## __init__函数

```python
def __init__(self, min_score: float = 0.0, max_score: float = 0.5):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :-------------- | :---- | :------ | :------------------------------------------------------- |
| **min_score** | float | 0.0 | 最小毒性得分阈值。保留得分大于或等于此值的文本。 |
| **max_score** | float | 0.5 | 最大毒性得分阈值。保留得分小于或等于此值的文本。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :---------------- | :------- | :------- | :------- |
|                   |          |          |          |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PerspectiveScore'):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :------------------- | :------------------------------------ |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估毒性的文本字段。 |
| **output_key** | str | "PerspectiveScore" | 输出列名，对应生成的毒性得分字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :----------------- | :---- | :--------------------- |
| [input_key] | str | 输入的待评估文本。 |
| [output_key] | float | 模型生成的毒性分数值。 |

**示例输入：**

```json
{
    "text": "You are a wonderful person."
}
```

**示例输出 (假设该条目通过过滤):**

```json
{
    "text": "You are a wonderful person.",
    "PerspectiveScore": 0.105
}
```
