---
title: CCNetDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/filter/ccnetdeduplicatefilter/
---

## 📘 概述
`CCNetDeduplicateFilter` 是一个基于 CCNet 方法的数据去重算子。它通过计算指定字段内容的 SHA-1 哈希值，并比较哈希值的前N位来识别和过滤重复数据，实现精确去重。

## `__init__`函数
```python
def __init__(self, bit_length: int = 64)
```
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :-- | :-- | :--- |
| **bit_length** | int | 64 | 用于数据去重的哈希值的位数。 |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_keys: list = None, input_key: str = None, output_key: str = 'minhash_deduplicated_label')
```
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_keys** | list | None | 用于计算哈希的多个字段列表（与 `input_key` 二选一）。 |
| **input_key** | str | None | 用于计算哈希的单个字段名（与 `input_keys` 二选一）。 |
| **output_key** | str | 'minhash_deduplicated_label' | 输出的去重标记字段名。 |

## 🧠 示例用法
```python
from dataflow.operators.text_pt.filter import CCNetDeduplicateFilter
from dataflow.utils.storage import FileStorage

# 准备数据和存储
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# 初始化并运行去重过滤器
ccnet_filter = CCNetDeduplicateFilter(bit_length=64)
ccnet_filter.run(
    storage.step(),
    input_key='raw_content',
    output_key='minhash_deduplicated_label'
)
```

#### 🧾 默认输出格式（Output Format）
算子会向数据中添加一个新的 `output_key` 字段，用于标记数据是否重复。默认情况下，该字段为 `minhash_deduplicated_label`。标记为 `1` 的数据表示首次出现（唯一），标记为 `0` 的表示重复数据。最终，算子会过滤掉重复数据，只输出标记为 `1` 的唯一数据。

| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| (原输入字段) | - | 输入数据中包含的所有原始字段。 |
| minhash_deduplicated_label | int | 去重标记。值为 `1`，表示该条数据是唯一的。 |

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
  "minhash_deduplicated_label": 1
}
```
