---
title: NgramHashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/ngramhashdeduplicatefilter/
---

## 📘 概述

[NgramHashDeduplicateFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/deduplicate/ngram_hash_deduplicate_filter.py) 算子结合n-gram技术与哈希算法识别相似文本，实现近似去重。它将文本分割为多个n-gram片段，计算每个片段的哈希值，通过比较哈希集合的相似度来判断文本相似性。

## `__init__`函数

```python
def __init__(self, n_gram: int = 3, hash_func: str = 'md5', diff_size : int = 1)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :---------- | :---- | :------ | :------------------------------------------- |
| **n_gram** | int | 3 | 将文本分割的片段数量。 |
| **hash_func** | str | 'md5' | 哈希函数类型，支持'md5'、'sha256'和'xxh3'。 |
| **diff_size** | int | 1 | 哈希集合差异阈值，小于此值将被判定为相似文本。 |

## Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :----------- | :---------------- | :------------------------------- | :----------------------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_keys** | list | None | 用于去重的输入列名列表。与 `input_key` 参数二选一。 |
| **input_key** | str | None | 用于去重的单个输入列名。与 `input_keys` 参数二选一。 |
| **output_key** | str | 'minhash_deduplicated_label' | 输出的去重标签列名。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

算子会在输出的 DataFrame 中添加一个由 `output_key` 指定的新列，用于标记数据是否唯一（1为唯一），并仅保留唯一的行。

| 字段 | 类型 | 说明 |
| :------------------------------- | :---- | :--------------------------------- |
| [原始字段] | - | 输入的原始字段将全部保留。 |
| [output_key] | int | 去重标签，值为1表示该行为唯一数据。 |
