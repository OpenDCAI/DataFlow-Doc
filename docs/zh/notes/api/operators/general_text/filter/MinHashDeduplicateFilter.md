---
title: MinHashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/minhashdeduplicatefilter/
---

好的，这是根据您提供的代码和模板生成的 `MinHashDeduplicateFilter` 算子的教程 Markdown 代码。

***

## 📘 概述

[MinHashDeduplicateFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filters/minhash_deduplicate_filter.py) 是一个结合 MinHash 与 LSH（局部敏感哈希）实现高效近似去重的算子。它将文本转换为 MinHash 签名，然后使用 LSH 快速查找相似的文本簇，从而实现大规模数据集的高效近似去重。

## `__init__`函数

```python
def __init__(self, num_perm=128, threshold=0.9, use_n_gram=True, ngram=5)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :------------- | :---- | :--------- | :----------------------------- |
| **num_perm** | int | 128 | 用于生成 MinHash 签名的哈希函数（排列）数量。 |
| **threshold** | float | 0.9 | Jaccard 相似度阈值，超过此阈值的文本将被视为重复项。 |
| **use_n_gram** | bool | True | 是否使用 n-gram 对文本进行分词来生成集合。 |
| **ngram** | int | 5 | 当 `use_n_gram` 为 True 时，n-gram 的 n 值。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :---------------- | :------- | :------- | :------- |
|                   |          |          |          |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :----------------------------- | :----------------------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_keys** | list | None | 需要进行去重检查的多个输入列名列表。算子会将这些列的内容合并后计算哈希值。 |
| **input_key** | str | None | 需要进行去重检查的单个输入列名。`input_key` 和 `input_keys` 必须提供其中一个。 |
| **output_key** | str | "minhash_deduplicated_label" | 输出列名，用于标记数据是否为唯一项（`1` 表示唯一，保留）。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

算子会向原始数据中添加一个标记列（默认为 `minhash_deduplicated_label`），并过滤掉被识别为重复的数据行。

| 字段 | 类型 | 说明 |
| :--------------------------- | :---- | :---------------------------------- |
| ... | ... | 原始输入数据中的所有字段。 |
| minhash_deduplicated_label | int | 去重标记，值为 `1` 的行表示是唯一的，被保留下来。 |

**示例输入：**

```json
[
    {"id": 1, "text": "这是一个用于测试的示例文本。"},
    {"id": 2, "text": "这是一个用于测试的示例文本"},
    {"id": 3, "text": "这是完全不同的另一段文本。"}
]
```

**示例输出：**

```json
[
    {"id": 1, "text": "这是一个用于测试的示例文本。", "minhash_deduplicated_label": 1},
    {"id": 3, "text": "这是完全不同的另一段文本。", "minhash_deduplicated_label": 1}
]
```
