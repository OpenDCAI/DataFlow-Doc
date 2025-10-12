---
title: NgramHashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/ngramhashdeduplicatefilter/
---

## 📘 概述

`NgramHashDeduplicateFilter` 算子结合n-gram技术与哈希算法识别相似文本，实现近似去重。它将文本分割为多个n-gram片段，计算每个片段的哈希值，通过比较哈希集合的相似度来判断文本相似性。

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
from dataflow.operators.general_text import NgramHashDeduplicateFilter
from dataflow.utils.storage import FileStorage

class NgramHashDeduplicateFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/ngramhash_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = NgramHashDeduplicateFilter(
            n_gram=3,
            hash_func='md5',
            diff_size=1
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='minhash_deduplicated_label'
        )

if __name__ == "__main__":
    test = NgramHashDeduplicateFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

算子会在输出的 DataFrame 中添加一个由 `output_key` 指定的新列，用于标记数据是否唯一（1为唯一），并仅保留唯一的行。

| 字段 | 类型 | 说明 |
| :------------------------------- | :---- | :--------------------------------- |
| [原始字段] | - | 输入的原始字段将全部保留。 |
| [output_key] | int | 去重标签，值为1表示该行为唯一数据。 |

### 📋 示例输入

```json
{"text": "这是第一个测试文本，用于检测去重功能。"}
{"text": "这是第一个测试文本，用于检测去重功能。"}
{"text": "这是完全不同的第二个测试文本。"}
```

### 📤 示例输出

```json
{"text": "这是第一个测试文本，用于检测去重功能。", "minhash_deduplicated_label": 1}
{"text": "这是完全不同的第二个测试文本。", "minhash_deduplicated_label": 1}
```

### 📊 结果分析

**样本1（第一个文本）**：
- 将文本分为 3 段 n-gram
- 计算每段的 MD5 哈希值
- 哈希集合为首次出现
- **保留**（唯一样本）

**样本2（重复文本）**：
- 哈希集合与样本1完全相同
- 哈希交集大小 ≥ diff_size (1)
- **被过滤**（重复）

**样本3（不同文本）**：
- 哈希集合与前面样本差异较大
- 哈希交集大小 < diff_size
- **保留**（唯一样本）

**工作原理**：
1. 将文本平均分为 `n_gram` 段
2. 对每段计算哈希值（支持 md5、sha256、xxh3）
3. 比较哈希集合的交集大小
4. 交集 < `diff_size` 视为不同文本

**应用场景**：
- 快速文本去重
- 大规模数据集预处理
- 检测近似重复内容
- 网页内容去重

**注意事项**：
- `n_gram` 越大，分段越多，精度越高
- `diff_size` 越小，去重越严格
- 支持三种哈希函数：md5（快）、sha256（安全）、xxh3（最快）
- 适合字符级别的相似度检测
