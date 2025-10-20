---
title: SimHashDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/simhashdeduplicatefilter/
---

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
from dataflow.operators.general_text import SimHashDeduplicateFilter
from dataflow.utils.storage import FileStorage

class SimHashDeduplicateFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/simhash_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = SimHashDeduplicateFilter(
            fingerprint_size=64,
            bound=0.1
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='minhash_deduplicated_label'
        )

if __name__ == "__main__":
    test = SimHashDeduplicateFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

该算子会向 DataFrame 中添加一个新的标签列（由 `output_key` 参数指定），并过滤掉重复的行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| **minhash_deduplicated_label** | int | 去重标签。值为1表示该样本是唯一的（被保留），值为0则表示是重复项（在最终输出的DataFrame中被移除）。 |

### 📋 示例输入

```json
{"text": "Hello world, this is a test message."}
{"text": "Hello world, this is a test message."}
{"text": "Completely different text goes here."}
```

### 📤 示例输出

```json
{"text": "Hello world, this is a test message.", "minhash_deduplicated_label": 1}
{"text": "Completely different text goes here.", "minhash_deduplicated_label": 1}
```

### 📊 结果分析

**样本1（第一条消息）**：
- 生成 64 位 SimHash 指纹
- 首次出现，作为基准
- **保留**（唯一样本）

**样本2（重复消息）**：
- 生成相同的 SimHash 指纹
- 汉明距离 = 0，相似度 = 1.0
- 相似度 1.0 > (1 - 0.1) = 0.9
- **被过滤**（重复）

**样本3（不同文本）**：
- 生成不同的 SimHash 指纹
- 汉明距离较大，相似度 < 0.9
- **保留**（唯一样本）

**工作原理**：
1. 对每个文本生成固定长度的 SimHash 指纹
2. 计算指纹间的汉明距离
3. 汉明距离 / 指纹长度 = 差异度
4. 相似度 = 1 - 差异度
5. 相似度 ≥ (1 - bound) 视为重复

**应用场景**：
- 大规模文本快速去重
- 近似重复检测
- 网页内容去重
- 文档相似度检测

**注意事项**：
- `fingerprint_size` 越大，精度越高，计算越慢
- `bound=0.1` 表示相似度 > 90% 视为重复
- 比 MinHash 更快，但精度稍低
- 适合字符级别的相似度检测
- 对文本顺序敏感
