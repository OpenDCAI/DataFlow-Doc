---
title: ColonEndFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/colonendfilter/
---

## 📘 概述
`ColonEndFilter` 是一个过滤算子，用于检查输入文本是否以冒号（`:`）结尾。该算子通常用于数据清洗阶段，过滤掉可能不完整的句子或问题。

## `__init__`函数
```python
def __init__(self)
```
### init参数说明
该算子在初始化时无需任何参数。

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = None)
```
执行算子主逻辑，从存储中读取输入 DataFrame，检查指定列的文本是否以冒号结尾，并将不以冒号结尾的数据行写回存储。

#### 参数
| 名称         | 类型              | 默认值 | 说明                                                         |
| :------------- | :---------------- | :------- | :----------------------------------------------------------- |
| **storage**    | DataFlowStorage   | 必需     | 数据流存储实例，负责读取与写入数据。                         |
| **input_key**  | str               | 必需     | 输入列名，指定要检查的文本字段。                             |
| **output_key** | str               | None     | 输出列名，用于存储过滤标签（1代表保留，0代表过滤）。若不指定，将自动生成。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
算子会向DataFrame中添加一个新的`output_key`列，其值为1（不以冒号结尾）或0（以冒号结尾），然后过滤掉值为0的行。最终输出的DataFrame只包含通过过滤的行。

示例输入DataFrame (`input_key="text"`):
```json
[
    {"id": 1, "text": "请解释一下什么是机器学习？"},
    {"id": 2, "text": "以下是几个关键概念："},
    {"id": 3, "text": "总结来说，模型表现良好。"}
]
```
示例输出DataFrame (假设`output_key="colonendfilter_label"`):
```json
[
    {"id": 1, "text": "请解释一下什么是机器学习？", "colonendfilter_label": 1},
    {"id": 3, "text": "总结来说，模型表现良好。", "colonendfilter_label": 1}
]
```
