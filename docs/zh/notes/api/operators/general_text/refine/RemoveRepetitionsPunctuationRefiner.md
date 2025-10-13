---
title: RemoveRepetitionsPunctuationRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removerepetitionspunctuationrefiner/
---

## 📘 概述

[RemoveRepetitionsPunctuationRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refiner/remove_repetitions_punctuation_refiner.py) 算子用于移除文本中重复的标点符号，例如将"!!!"变为"!"，",,"变为","。它通过正则表达式匹配连续重复的标点符号，并将其替换为单个符号。

## \_\_init\_\_函数

```python
def __init__()
```

### init参数说明

该算子无需初始化参数。

## run函数

```python
def run(storage, input_key)
```

#### 参数

| 名称          | 类型              | 默认值 | 说明                                     |
| :------------ | :---------------- | :----- | :--------------------------------------- |
| **storage**   | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | str               | 必需   | 输入列名，对应需要处理重复标点的文本字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

该算子会就地修改输入DataFrame，将处理后的文本更新到`input_key`指定的列中。

| 字段        | 类型 | 说明                 |
| :---------- | :--- | :------------------- |
| `input_key` | str  | 移除了重复标点的文本。 |

**示例输入：**

```json
{
  "text": "你好世界!!! 这是一段测试文本,,"
}
```

**示例输出：**

```json
{
  "text": "你好世界! 这是一段测试文本,"
}
```
