---
title: MinHashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/minhashdeduplicatefilter/
---

## 📘 概述

`MinHashDeduplicateFilter` 是一个结合 MinHash 与 LSH（局部敏感哈希）实现高效近似去重的算子。它将文本转换为 MinHash 签名，然后使用 LSH 快速查找相似的文本簇，从而实现大规模数据集的高效近似去重。

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
from dataflow.operators.general_text import MinHashDeduplicateFilter
from dataflow.utils.storage import FileStorage

class MinHashDeduplicateFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/minhash_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = MinHashDeduplicateFilter(
            num_perm=128,
            threshold=0.9,
            use_n_gram=True,
            ngram=5
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='minhash_deduplicated_label'
        )

if __name__ == "__main__":
    test = MinHashDeduplicateFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

算子会向原始数据中添加一个标记列（默认为 `minhash_deduplicated_label`），并过滤掉被识别为重复的数据行。

| 字段 | 类型 | 说明 |
| :--------------------------- | :---- | :---------------------------------- |
| minhash_deduplicated_label | int | 去重标记，值为 `1` 的行表示是唯一的，被保留下来。 |

### 📋 示例输入

```json
{"id": 1, "text": "这是一个用于测试的示例文本。今天天气很好，阳光明媚。"}
{"id": 2, "text": "这是一个用于测试的示例文本。今天天气很好，阳光明媚。"}
{"id": 3, "text": "这是完全不同的另一段文本。内容和前面完全无关。"}
{"id": 4, "text": "这是一个用于测试的示例文本。今天的天气很好，阳光很明媚。"}
```

### 📤 示例输出

```json
{"id": 1, "text": "这是一个用于测试的示例文本。今天天气很好，阳光明媚。", "minhash_deduplicated_label": 1}
{"id": 3, "text": "这是完全不同的另一段文本。内容和前面完全无关。", "minhash_deduplicated_label": 1}
{"id": 4, "text": "这是一个用于测试的示例文本。今天的天气很好，阳光很明媚。", "minhash_deduplicated_label": 1}
```

### 📊 结果分析

**样本1（id=1）**：
- 文本：这是一个用于测试的示例文本。今天天气很好，阳光明媚。
- **保留**（第一个样本，作为基准）

**样本2（id=2）**：
- 文本：这是一个用于测试的示例文本。今天天气很好，阳光明媚。
- 与样本1完全相同
- Jaccard 相似度：1.0 > 0.9
- **被过滤**（与样本1重复）

**样本3（id=3）**：
- 文本：这是完全不同的另一段文本。内容和前面完全无关。
- 与前面样本完全不同
- Jaccard 相似度 < 0.9
- **保留**（唯一文本）

**样本4（id=4）**：
- 文本：这是一个用于测试的示例文本。今天的天气很好，阳光很明媚。
- 与样本1高度相似，但有轻微差异（"的"字、"很"字）
- 使用 5-gram 分析后相似度 < 0.9
- **保留**（相似度未超过阈值）

**工作原理**：
1. 使用 MinHash 算法为每个文本生成签名（128个哈希值）
2. 使用 LSH（局部敏感哈希）快速查找相似文本簇
3. 通过 5-gram 切分文本，计算 Jaccard 相似度
4. 相似度超过阈值（0.9）的样本被识别为重复

**应用场景**：
- 大规模数据集去重
- 网页内容去重
- 新闻文章去重
- 用户生成内容去重

**注意事项**：
- `num_perm` 越大，精度越高，但计算开销越大
- `threshold` 越接近 1，去重越严格
- `use_n_gram=True` 时使用字符级 n-gram，适合中文
- `use_n_gram=False` 时使用空格分词，适合英文
- LSH 提供近似匹配，速度快但可能漏掉部分重复
