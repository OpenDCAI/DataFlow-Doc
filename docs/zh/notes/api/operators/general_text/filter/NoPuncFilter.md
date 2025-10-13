---
title: NoPuncFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/nopuncfilter/
---

## 📘 概述 [NoPuncFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
该算子用于过滤文本，确保文本中的句子长度不超过设定的阈值。它会遍历文本中的每个句子，计算其单词数量，并过滤掉包含超长句子的条目。

## __init__函数
```python
def __init__(self, threshold: int=112)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :---------- | :--- | :---- | :----------------------------- |
| **threshold** | int | 112 | 句子最大单词数的阈值。 |

### Prompt模板说明

<!-- Prompt模板说明待补充 -->

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='no_punc_filter_label')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :----------- | :---------------- | :------------------------- | :------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检查的文本字段。 |
| **output_key** | str | 'no_punc_filter_label' | 输出列名，用于存储过滤结果的标签。 |

## 🧠 示例用法
```python
# 示例用法代码待补充
```

#### 🧾 默认输出格式（Output Format）
算子执行后，会在原始数据中增加一个`output_key`指定的列（默认为`no_punc_filter_label`），其值为1代表数据通过了过滤检查。最终，算子会筛选出所有检查通过的数据行并写回存储。
| 字段 | 类型 | 说明 |
| :----------------------- | :---- | :----------------------------------------------------------- |
| ... | ... | 输入的原始字段。 |
| no_punc_filter_label | int | 过滤结果标签。值为1表示该行文本中所有句子的长度均未超过阈值。 |
