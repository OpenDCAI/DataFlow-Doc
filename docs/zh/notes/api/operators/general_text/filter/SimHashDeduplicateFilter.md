---
title: SimHashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/simhashdeduplicatefilter/
---

好的，这是根据您提供的代码和模板生成的 `SimHashDeduplicateFilter` 算子的教程 Markdown。

***

## 📘 概述

`SimHashDeduplicateFilter` 是一个基于 SimHash 算法的近似文本去重算子。它通过将文本转换为固定长度的“指纹”，并计算指纹之间的汉明距离来高效识别相似内容。该算子相比语义去重速度更快，尤其适合在处理大规模数据集时，对字符级别相似的文本进行快速的预处理去重。

## __init__函数

```python
def __init__(self, fingerprint_size: int = 64, bound: float = 0.1)
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **fingerprint_size** | int | 64 | SimHash 指纹的长度（位数）。 |
| **bound** | float | 0.1 | 相似度距离阈值。当两个文本指纹的汉明距离与指纹长度的比值小于此阈值时，被视为重复。例如，默认值0.1表示相似度高于90%的文本将被视为重复。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_keys** | list | None | 包含待去重文本的多个输入列名列表。与 `input_key` 参数二选一。 |
| **input_key** | str | None | 包含待去重文本的单个输入列名。与 `input_keys` 参数二选一。 |
| **output_key** | str | 'minhash_deduplicated_label' | 输出结果标签的列名，用于标记样本是否为重复项。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

该算子会向 DataFrame 中添加一个新的标签列（由 `output_key` 参数指定），并过滤掉重复的行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入 DataFrame 的原始字段。 |
| **minhash_deduplicated_label** | int | 去重标签。值为1表示该样本是唯一的（被保留），值为0则表示是重复项（在最终输出的DataFrame中被移除）。 |
