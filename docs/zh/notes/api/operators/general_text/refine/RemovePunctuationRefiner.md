---
title: RemovePunctuationRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removepunctuationrefiner/
---

## 📘 概述
`RemovePunctuationRefiner` 是一个文本处理算子，用于移除指定文本字段中的所有标点符号。它使用 Python 内置的 `string.punctuation` 集合作为标点库，对输入的 DataFrame 进行处理。

## __init__函数
```python
def __init__(self)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :----- | :--- | :----- | :--- |
| **无** | -    | -      | 该算子在初始化时无需传入参数。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称        | 类型            | 默认值 | 说明                               |
| :---------- | :-------------- | :----- | :--------------------------------- |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str             | 必需   | 输入列名，对应需要去除标点的文本字段。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
该算子会就地修改输入 DataFrame 中 `input_key` 指定的列，移除其中的标点符号。
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| [input_key] | str | 移除了标点符号的原始文本。 |

示例输入：
```json
{
"text": "你好，世界！这是一个测试。"
}
```
示例输出（假设 `input_key` 为 "text"）：
```json
{
"text": "你好世界这是一个测试"
}
```
