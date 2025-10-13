---
title: NgramFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/ngramfilter/
---

## 📘 概述

[NgramFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/ngram_filter.py) 是一个基于N-gram分数的文本过滤算子。它通过计算文本中n-gram的重复比例来评估文本的冗余度，并根据设定的分数阈值过滤掉冗余度较高或过低的文本。得分越高表示重复比例越低，文本质量通常越高。

## `__init__`函数

```python
__init__(self, min_score=0.8, max_score=1, ngrams=5)
```

### init参数说明

| 参数名          | 类型  | 默认值 | 说明                                     |
| :-------------- | :---- | :----- | :--------------------------------------- |
| **min_score**   | float | 0.8    | 最小n-gram得分阈值，低于此值的文本将被过滤。 |
| **max_score**   | int   | 1      | 最大n-gram得分阈值，高于此值的文本将被过滤。 |
| **ngrams**      | int   | 5      | 用于计算重复率的n-gram大小。             |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :-------------- | :------- | :------- | :------- |
|                 |          |          |          |

## `run`函数

```python
run(self, storage: DataFlowStorage, input_key: str, output_key: str='NgramScore')
```

#### 参数

| 名称          | 类型            | 默认值         | 说明                                       |
| :------------ | :-------------- | :------------- | :----------------------------------------- |
| **storage**   | DataFlowStorage | 必需           | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str             | 必需           | 输入列名，对应待评估冗余度的文本字段。     |
| **output_key**| str             | "NgramScore"   | 输出列名，对应生成的n-gram分数字段。       |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

算子会向数据中添加一个`output_key`（默认为`NgramScore`）字段，并仅保留分数在`[min_score, max_score]`范围内的数据行。

| 字段         | 类型  | 说明                         |
| :----------- | :---- | :--------------------------- |
| ...          | ...   | 输入数据中的原始字段。       |
| NgramScore   | float | 模型生成的N-gram分数。       |

示例输入：

```json
{
"text":"今天天气真不错，阳光明媚，万里无云，适合出门散步。"
}
```

示例输出 (假设该条目通过了过滤)：

```json
{
"text":"今天天气真不错，阳光明媚，万里无云，适合出门散步。",
"NgramScore": 0.95
}
```
