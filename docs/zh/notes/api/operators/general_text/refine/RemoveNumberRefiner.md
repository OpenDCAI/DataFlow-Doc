---
title: RemoveNumberRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removenumberrefiner/
---

## 📘 概述

[RemoveNumberRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refiner/remove_number_refiner.py) 是一个文本清理算子，用于从指定的文本字段中移除所有数字字符（0-9）。它通过遍历文本中的每个字符并过滤掉数字来实现这一功能，从而保留纯文本内容。该算子适用于数据预处理阶段，特别是当需要处理不含数字的自然语言文本时。

## `__init__`函数

```python
def __init__(self)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| 无 | - | - | 该算子在初始化时无需任何参数。 |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，指定要处理的包含文本的字段。 |

## Prompt模板说明



## 🧠 示例用法



#### 🧾 默认输出格式（Output Format）

该算子会直接修改 `input_key` 指定的列，将处理后的文本写回原位。

| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| {input_key} | str | 经过处理的文本，其中的数字字符已被移除。 |

示例输入：
```json
{
  "text_column": "这是包含数字123和字母abc的文本。"
}
```
示例输出：
```json
{
  "text_column": "这是包含数字和字母abc的文本。"
}
```
