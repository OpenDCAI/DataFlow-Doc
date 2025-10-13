---
title: LowercaseRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/lowercaserefiner/
---

## 📘 概述
`LowercaseRefiner` 是一个文本处理算子，其主要功能是将指定文本字段中的所有大写字母转换为小写字母，从而实现文本格式的统一。

## `__init__`函数
该算子在初始化时无需传入任何参数。

```python
def __init__(self)
```

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称          | 类型              | 默认值 | 说明                                     |
| :------------ | :---------------- | :----- | :--------------------------------------- |
| **storage**   | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str               | 必需   | 输入列名，指定需要转换为小写的文本字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
算子会修改输入 DataFrame 中 `input_key` 指定的列，并保留所有其他列。

示例输入：
```json
{
"text": "This is an EXAMPLE text to DEMONSTRATE the functionality.",
"other_field": 123
}
```
示例输出：
```json
{
"text": "this is an example text to demonstrate the functionality.",
"other_field": 123
}
```
