---
title: HashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/hashdeduplicatefilter/
---

## 📘 概述 [HashDeduplicateFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/hash_deduplicate_filter.py)
HashDeduplicateFilter 是一个精确去重算子，通过计算指定文本字段的哈希值来识别和过滤重复数据。该算子支持多种高效的哈希算法，包括 md5、sha256 和 xxh3，以适应不同的性能和安全性需求。

## __init__函数
```python
def __init__(self, hash_func: str = 'md5')
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :---------- | :---- | :------ | :------------------------------------------------ |
| **hash_func** | str | 'md5' | 哈希函数名称。可选 'md5'、'sha256' 或 'xxh3'。 |

## Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| ----------------- | -------- | ---------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :----------- | :---------------- | :-------------------------------| :----------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_keys** | list | None | 用于计算哈希值的多个字段列表。与 `input_key` 二选一。 |
| **input_key** | str | None | 用于计算哈希值的单个字段名。与 `input_keys` 二选一。 |
| **output_key** | str | 'minhash_deduplicated_label' | 输出列名，用于标记数据是否重复（1表示唯一，0表示重复）。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :------------------------------- | :---- | :------------------------------------------------------------------- |
| ... | ... | 输入数据中的原始字段。 |
| [output_key] | int | 去重标记。1 表示该数据为首次出现，0 表示为重复数据。默认字段名为 `minhash_deduplicated_label`。 |

示例输入（假设 `input_key`="content"）:
```json
{"id": 1, "content": "第一条独特的评论。"}
{"id": 2, "content": "这是一条重复的评论。"}
{"id": 3, "content": "第二条独特的评论。"}
{"id": 4, "content": "这是一条重复的评论。"}
```
示例输出（最终存储的数据仅包含唯一项）:
```json
{"id": 1, "content": "第一条独特的评论。", "minhash_deduplicated_label": 1}
{"id": 2, "content": "这是一条重复的评论。", "minhash_deduplicated_label": 1}
{"id": 3, "content": "第二条独特的评论。", "minhash_deduplicated_label": 1}
```
