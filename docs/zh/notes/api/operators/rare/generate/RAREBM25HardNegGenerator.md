---
title: RAREBM25HardNegGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/rare/generate/rarebm25hardneggenerator/
---

## 📘 概述 [RAREBM25HardNegGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
`RAREBM25HardNegGenerator` 是一个困难负样本挖掘算子，它使用 BM25 算法为给定的查询挖掘困难负样本。该算子会读取包含查询和正面文档的 DataFrame，并添加一个包含挖掘出的困难负样本列表的新列。

## \_\_init\_\_函数
```python
def __init__(self)
```
### init参数说明
该算子在初始化时无需传入参数。

### Prompt模板说明


## run函数
```python
def run(storage, input_question_key="question", input_text_key="text", output_negatives_key="hard_negatives", num_neg=3)
```
#### 参数
| 名称                   | 类型              | 默认值             | 说明                                       |
| :--------------------- | :---------------- | :------------------- | :----------------------------------------- |
| **storage**            | DataFlowStorage   | 必需                 | 数据流存储实例，负责读取与写入数据。         |
| **input_question_key** | str               | "question"           | 输入列名，对应查询字段。                   |
| **input_text_key**     | str               | "text"               | 输入列名，对应正面文档字段。               |
| **output_negatives_key**| str               | "hard_negatives"     | 输出列名，用于存储挖掘出的困难负样本列表。 |
| **num_neg**            | int               | 3                    | 每个查询需要挖掘的困难负样本数量。         |

## 🧠 示例用法
