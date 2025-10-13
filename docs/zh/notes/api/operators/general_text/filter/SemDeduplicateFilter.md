---
title: SemDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/semdeduplicatefilter/
---

## 📘 概述

[SemDeduplicateFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/quality/sem_deduplicate_filter.py) 是一个基于BERT语义相似度的去重算子，用于识别并过滤掉内容相似但表述不同的重复数据。通过计算文本嵌入向量间的余弦相似度，该算子能够高效地执行近似去重操作，保留数据集中的唯一样本，从而提高数据多样性。它支持对单个或多个字段组合进行去重。

## `__init__`函数

```python
class SemDeduplicateFilter(
    eps: float = 0.05, 
    model_name: str = 'sentence-transformers/all-MiniLM-L6-v2', 
    model_cache_dir: str = './dataflow_cache', 
    device: str = 'cuda'
)
```

### init参数说明

| 参数名              | 类型  | 默认值                                     | 说明                                                       |
| :------------------ | :---- | :----------------------------------------- | :--------------------------------------------------------- |
| **eps**             | float | 0.05                                       | 相似度阈值，值越小表示允许的相似度越低（即余弦相似度 > 1-eps 视为重复）。 |
| **model_name**      | str   | 'sentence-transformers/all-MiniLM-L6-v2'   | 用于生成文本嵌入的预训练模型名称。                         |
| **model_cache_dir** | str   | './dataflow_cache'                         | 模型缓存目录。                                             |
| **device**          | str   | 'cuda'                                     | 模型运行设备（如 'cuda' 或 'cpu'）。                       |

## Prompt模板说明

## `run`函数

```python
def run(
    storage: DataFlowStorage, 
    input_keys: list = None, 
    input_key: str = None, 
    output_key: str = 'minhash_deduplicated_label'
)
```

#### 参数

| 名称         | 类型            | 默认值                       | 说明                                                         |
| :----------- | :-------------- | :--------------------------- | :----------------------------------------------------------- |
| **storage**  | DataFlowStorage | 必需                         | 数据流存储实例，负责读取与写入数据。                         |
| **input_keys** | list          | None                         | 包含待去重文本的多个输入字段名列表，与 `input_key` 二选一。    |
| **input_key**  | str           | None                         | 包含待去重文本的单个输入字段名，与 `input_keys` 二选一。     |
| **output_key** | str           | 'minhash_deduplicated_label' | 输出列名，用于标记样本是否为重复（1 为非重复，0 为重复）。最终输出的数据中只包含值为1的样本。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

| 字段                       | 类型 | 说明                                                         |
| :------------------------- | :--- | :----------------------------------------------------------- |
| ...                        | ...  | 输入的原始字段。                                             |
| minhash_deduplicated_label | int  | 去重标记，1 表示该样本为唯一并被保留。该算子过滤后的输出数据中，此字段值恒为1。 |

示例输入：
```json
{"text": "The weather is sunny today."}
{"text": "It is a bright and sunny day."}
{"text": "I need to buy some apples."}
```

示例输出：
```json
{"text": "The weather is sunny today.", "minhash_deduplicated_label": 1}
{"text": "I need to buy some apples.", "minhash_deduplicated_label": 1}
```
