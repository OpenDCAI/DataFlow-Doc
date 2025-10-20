---
title: PandasOperator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/refine/pandasoperator/
---

## 📘 概述
`PandasOperator` 是一个数据处理算子，它允许用户通过一个或多个自定义函数来对 DataFrame 进行灵活的转换操作。每个函数都接收一个 DataFrame 作为输入，并返回一个处理后的 DataFrame，从而实现链式的数据处理流程。

## `__init__`函数
```python
def __init__(self, process_fn: list):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **process_fn** | list | 必需 | 一个包含一个或多个处理函数的列表。每个函数接收一个 DataFrame 并返回一个修改后的 DataFrame。 |

### Prompt模板说明

## `run`函数
```python
def run(self, storage: DataFlowStorage):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，用于读取输入的 DataFrame 并写入处理后的 DataFrame。 |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
该算子直接在 `DataFlowStorage` 中对名为 "dataframe" 的数据进行读写操作。输出的 DataFrame 结构取决于 `process_fn` 中定义的一系列转换操作。
