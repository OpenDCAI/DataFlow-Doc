---
title: PairQualFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/filter/pairqualfilter/
---

## 📘 概述

`PairQualFilter` 是一个基于 `PairQualScorer` 打分器的质量过滤算子。它利用一个基于BGE模型和GPT成对比较训练的双语文本质量评分器，对输入数据进行打分，并根据设定的最小和最大分值阈值筛选出符合质量要求的数据。

## `__init__`函数

```python
def __init__(self, min_score=0, max_score=10000, model_cache_dir='./dataflow_cache', lang='en')
```

### init参数说明

| 参数名              | 类型 | 默认值               | 说明                                     |
| :------------------ | :--- | :------------------- | :--------------------------------------- |
| **min_score**       | int  | 0                    | 最小质量得分阈值，低于该值的数据将被过滤。 |
| **max_score**       | int  | 10000                | 最大质量得分阈值，高于该值的数据将被过滤。 |
| **model_cache_dir** | str  | './dataflow_cache'   | 模型缓存目录的路径。                     |
| **lang**            | str  | 'en'                 | 待处理文本的语言类型（例如 'en', 'zh'）。  |

## Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :-------------- | :------- | :------- | :------- |
|                 |          |          |          |
|                 |          |          |          |
|                 |          |          |          |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='PairQualScore')
```

#### 参数

| 名称         | 类型            | 默认值            | 说明                                         |
| :----------- | :-------------- | :---------------- | :------------------------------------------- |
| **storage**  | DataFlowStorage | 必需              | 数据流存储实例，负责读取与写入数据。         |
| **input_key**| str             | 必需              | 输入列名，对应需要进行质量评估的文本字段。   |
| **output_key** | str             | "PairQualScore"   | 输出列名，用于存储计算出的质量得分。         |

## 🧠 示例用法

```python
from dataflow.operators.text_pt.filter import PairQualFilter
from dataflow.utils.storage import FileStorage

# 准备数据和存储
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# 初始化并运行过滤器
pairqual_filter = PairQualFilter(
    min_score=0,
    max_score=10000,
    model_cache_dir='./dataflow_cache',
    lang='en'
)
pairqual_filter.run(
    storage.step(),
    input_key='raw_content',
    output_key='PairQualScore'
)
```

#### 🧾 默认输出格式（Output Format）

该算子会向DataFrame中添加一个得分列，并基于得分范围过滤数据。输出的DataFrame将包含所有原始列以及新增的得分列。

| 字段                      | 类型  | 说明                               |
| :------------------------ | :---- | :--------------------------------- |
| ... (原始字段)            | -     | 保留所有原始输入字段。             |
| **PairQualScore** (默认)  | float | PairQualScorer计算出的质量得分。   |

**示例输入:**
```json
{
    "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)..."
}
```

**示例输出:**
```json
{
    "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)...",
    "PairQualScore": 3.2509903908
}
```
