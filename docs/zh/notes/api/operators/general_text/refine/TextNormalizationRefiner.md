---
title: TextNormalizationRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/textnormalizationrefiner/
---

## 📘 概述

[TextNormalizationRefiner]() 是一个文本规范化算子，用于统一文本数据中的日期和货币格式。该算子将多种常见的日期表示形式（如 `MM/DD/YYYY`、`Month DD, YYYY`）转换为标准的 `YYYY-MM-DD` 格式，并将美元货币表示（如 `$50`）转换为 `50 USD` 格式，从而提高数据的规整性和一致性。

## \_\_init\_\_函数

```python
def __init__(self)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :----- | :--- | :----- | :--- |
| **无** | -    | -      | 该算子无需初始化参数。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称          | 类型              | 默认值 | 说明                               |
| :------------ | :---------------- | :----- | :--------------------------------- |
| **storage**   | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str               | 必需   | 输入列名，对应待规范化的文本字段。   |

## Prompt模板说明

## 🧠 示例用法

## 🧾 默认输出格式（Output Format）

该算子会就地修改输入DataFrame中 `input_key` 指定的列，不会新增列。

| 字段        | 类型 | 说明                   |
| :---------- | :--- | :--------------------- |
| `input_key` | str  | 包含格式规范化后文本的列。 |

#### 示例输入：

```json
{
"text": "The event is scheduled for 25/12/2024, and the ticket price is $50."
}
```

#### 示例输出：

```json
{
"text": "The event is scheduled for 2024-12-25, and the ticket price is 50 USD."
}
```
