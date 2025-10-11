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
from dataflow.operators.general_text import HashDeduplicateFilter
from dataflow.utils.storage import FileStorage

class HashDeduplicateFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/hash_deduplicate_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = HashDeduplicateFilter(hash_func='md5')
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = HashDeduplicateFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :------------------------------- | :---- | :------------------------------------------------------------------- |
| text | str | 原始输入文本字段 |
| minhash_deduplicated_label | int | 去重标记。1 表示该数据为首次出现，0 表示为重复数据 |

### 📋 示例输入

```json
{"text": "This is the first unique sentence."}
{"text": "This is a duplicate sentence."}
{"text": "This is a duplicate sentence."}
{"text": "This is the second unique sentence."}
```

### 📤 示例输出

```json
{"text": "This is the first unique sentence.", "minhash_deduplicated_label": 1}
{"text": "This is a duplicate sentence.", "minhash_deduplicated_label": 1}
{"text": "This is the second unique sentence.", "minhash_deduplicated_label": 1}
```

### 📊 结果分析

在本测试中，4条输入数据经过去重后保留了3条唯一数据：

**样本1（唯一）**：
- 文本："This is the first unique sentence."
- 首次出现
- **保留**（minhash_deduplicated_label=1）

**样本2（唯一）**：
- 文本："This is a duplicate sentence."
- 首次出现
- **保留**（minhash_deduplicated_label=1）

**样本3（重复）**：
- 文本："This is a duplicate sentence."
- 与样本2完全相同
- **过滤**（不在输出中）

**样本4（唯一）**：
- 文本："This is the second unique sentence."
- 首次出现
- **保留**（minhash_deduplicated_label=1）

**应用场景**：
- 数据集去重，移除完全相同的记录
- 提高数据多样性
- 减少存储空间和计算开销
- 避免训练数据中的重复样本

**哈希算法选择**：
- **md5**：平衡性能和碰撞率，适合大多数场景（默认）
- **sha256**：更高的安全性，碰撞率极低
- **xxh3**：最快的哈希速度，适合超大规模数据集

**注意事项**：
- 该算子执行精确去重，只有完全相同的文本才会被识别为重复
- 保留首次出现的记录，过滤后续重复的记录
- 支持单字段或多字段组合去重（通过`input_key`或`input_keys`）
- 哈希值不会存储在输出中，仅用于去重判断
