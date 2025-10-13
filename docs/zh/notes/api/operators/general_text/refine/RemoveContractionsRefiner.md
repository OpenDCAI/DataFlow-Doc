---
title: RemoveContractionsRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removecontractionsrefiner/
---

## 📘 概述 [RemoveContractionsRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refine/remove_contractions_refiner.py)
该算子用于扩展文本中的英语缩写词，将缩写形式转换为完整形式（例如将"can't"扩展为"cannot"）。 使用`contractions`库进行缩写词扩展，提高文本标准化程度。

## `__init__`函数
```python
def __init__(self)
```
### init参数说明
该函数无参数。

### Prompt模板说明

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称          | 类型              | 默认值 | 说明                                     |
| :------------ | :---------------- | :----- | :--------------------------------------- |
| **storage**   | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str               | 必需   | 输入列名，对应需要处理缩写词的文本字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
该算子会直接修改输入 `DataFrame` 中由 `input_key` 指定的列，将包含缩写词的文本替换为扩展后的完整形式。输出的数据格式与输入格式保持一致，仅在指定列的值上有所更新。

示例输入：
```json
{
"text": "I can't believe it's not butter. He'll be there soon."
}
```
示例输出：
```json
{
"text": "I cannot believe it is not butter. He will be there soon."
}
```
