---
title: FineWebEduFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/filter/finewebedufilter/
---

好的，这是根据您提供的代码和模板生成的 `FineWebEduFilter` 算子教程。

---

## 📘 概述

`FineWebEduFilter` 是一个基于 FineWeb-Edu 分类器的数据筛选算子。它首先对输入的文本数据进行教育价值评分，然后根据用户设定的分数阈值（`min_score` 和 `max_score`）筛选出符合条件的数据。该算子主要用于从大规模数据集中筛选出具有较高教育意义的文本内容。

## `__init__`函数

```python
def __init__(self, min_score: float = 2.5, max_score: float = 10000, model_cache_dir: str = './dataflow_cache', device: str = 'cuda')
```

### init参数说明

| 参数名              | 类型  | 默认值               | 说明                           |
| :------------------ | :---- | :------------------- | :----------------------------- |
| **min_score**       | float | 2.5                  | 最低分数阈值，低于此分数的样本将被过滤。 |
| **max_score**       | float | 10000                | 最高分数阈值，高于此分数的样本将被过滤。 |
| **model_cache_dir** | str   | './dataflow_cache'   | 用于存放评分模型的缓存目录。       |
| **device**          | str   | 'cuda'               | 指定运行模型的设备，如 'cuda' 或 'cpu'。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --------------- | -------- | -------- | -------- |
|                 |          |          |          |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='FinewebEduScore')
```

### 参数

| 名称          | 类型            | 默认值              | 说明                               |
| :------------ | :-------------- | :------------------ | :--------------------------------- |
| **storage**   | DataFlowStorage | 必需                | 数据流存储实例，负责读取与写入数据。   |
| **input_key** | str             | 必需                | 输入列名，对应需要评分的文本字段。     |
| **output_key**| str             | 'FinewebEduScore' | 输出列名，对应生成的教育价值分数字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

| 字段              | 类型  | 说明                         |
| :---------------- | :---- | :--------------------------- |
| ...               | ...   | 输入数据原有的其他字段。         |
| FinewebEduScore   | float | 模型生成的教育价值分数。       |
