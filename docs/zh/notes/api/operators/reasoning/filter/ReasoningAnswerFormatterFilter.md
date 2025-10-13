---
title: ReasoningAnswerFormatterFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/filter/reasoninganswerformatterfilter/
---

## 📘 概述
`ReasoningAnswerFormatterFilter` 是一个答案格式化过滤器算子，用于检查生成的答案格式是否符合预定规范（例如，数学答案是否包含 `\boxed{}` 标记），并筛选出格式正确的数据。

## \_\_init\_\_函数
```python
def __init__(self)
```
### init参数说明
该函数没有参数。

## run函数
```python
def run(storage, input_key="generated_cot")
```
执行算子主逻辑，从存储中读取数据，根据答案格式进行筛选，并将符合格式要求的数据写回存储。

#### 参数
| 名称        | 类型            | 默认值          | 说明                                 |
| :---------- | :-------------- | :-------------- | :----------------------------------- |
| **storage** | DataFlowStorage | 必需            | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str             | "generated_cot" | 输入列名，对应待检查格式的答案字段。 |

## 🧠 示例用法
