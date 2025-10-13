---
title: PerspectiveSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/perspectivesampleevaluator/
---

## 📘 概述

[PerspectiveSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluators/perspective_api_evaluator.py) 是一个评估算子，它使用 Perspective API 为输入的文本分配毒性分数。分数越高，表明文本的毒性越高。

## `__init__`函数

```python
def __init__(self, serving: PerspectiveAPIServing = None):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- |
| **serving** | PerspectiveAPIServing | 必需 | Perspective API 服务实例，用于执行评估。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PerspectiveScore'):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估的文本字段。 |
| **output_key** | str | "PerspectiveScore" | 输出列名，对应生成的毒性分数字段。 |

## 🧠 示例用法

```python
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| ... | ... | 输入数据中的原始字段。 |
| [output\_key] | float | 模型生成的毒性分数（0到1之间）。 |

示例输入：

```json
{
  "text": "You are a stupid idiot."
}
```

示例输出（假设 `input_key="text"` 且 `output_key="PerspectiveScore"`）：

```json
{
  "text": "You are a stupid idiot.",
  "PerspectiveScore": 0.95
}
```
