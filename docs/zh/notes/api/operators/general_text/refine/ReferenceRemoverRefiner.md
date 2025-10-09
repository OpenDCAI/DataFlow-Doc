---
title: ReferenceRemoverRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/referenceremoverrefiner/
---

## 📘 概述

`ReferenceRemoverRefiner` 是一个文本净化算子，用于删除文本中未闭合的引用标签和引用链接，包括`<ref>`标签和`{{cite}}`模板的各种完整和不完整形式，从而净化文本中的引用标记。

## __init__函数

```python
def __init__(self)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明                |
| :----- | :--- | :----- | :------------------ |
| 无     | -    | -      | 该算子初始化无需参数。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称        | 类型              | 默认值 | 说明                               |
| :---------- | :---------------- | :----- | :--------------------------------- |
| **storage** | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。   |
| **input_key** | str               | 必需   | 输入列名，对应需要净化处理的文本字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

| 字段        | 类型 | 说明                                                         |
| :---------- | :--- | :----------------------------------------------------------- |
| [input_key] | str  | 经过引用标记移除处理后的文本。字段名与 `input_key` 参数一致。 |

示例输入：

```json
{
  "text": "量子力学是一个物理学分支<ref name=\"griffiths\">Griffiths, David J. (2004), Introduction to Quantum Mechanics (2nd ed.), Prentice Hall</ref>，主要研究物质世界微观粒子运动规律{{cite book|...。"
}
```

示例输出：

```json
{
  "text": "量子力学是一个物理学分支，主要研究物质世界微观粒子运动规律。"
}
```
