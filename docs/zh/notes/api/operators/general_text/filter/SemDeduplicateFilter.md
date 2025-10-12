---
title: SemDeduplicateFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/semdeduplicatefilter/
---

## 📘 概述

`SemDeduplicateFilter` 是一个基于BERT语义相似度的去重算子，用于识别并过滤掉内容相似但表述不同的重复数据。通过计算文本嵌入向量间的余弦相似度，该算子能够高效地执行近似去重操作，保留数据集中的唯一样本，从而提高数据多样性。它支持对单个或多个字段组合进行去重。

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

```python
from dataflow.operators.general_text import SemDeduplicateFilter
from dataflow.utils.storage import FileStorage

class SemDeduplicateFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/sem_deduplicate_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = SemDeduplicateFilter(
            eps=0.05,
            model_name='sentence-transformers/all-MiniLM-L6-v2',
            model_cache_dir='./dataflow_cache',
            device='cuda'
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='minhash_deduplicated_label'
        )

if __name__ == "__main__":
    test = SemDeduplicateFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段                       | 类型 | 说明                                                         |
| :------------------------- | :--- | :----------------------------------------------------------- |
| minhash_deduplicated_label | int  | 去重标记，1 表示该样本为唯一并被保留。该算子过滤后的输出数据中，此字段值恒为1。 |

### 📋 示例输入

```json
{"text": "The weather is sunny today."}
{"text": "It is a bright and sunny day."}
{"text": "I need to buy some apples."}
```

### 📤 示例输出

```json
{"text": "The weather is sunny today.", "minhash_deduplicated_label": 1}
{"text": "It is a bright and sunny day.", "minhash_deduplicated_label": 1}
{"text": "I need to buy some apples.", "minhash_deduplicated_label": 1}
```

### 📊 结果分析

**样本1（"The weather is sunny today."）**：
- 计算 BERT 嵌入向量
- 首次出现，作为基准
- **保留**（唯一样本）

**样本2（"It is a bright and sunny day."）**：
- 与样本1语义相关（都关于晴天）
- 计算余弦相似度 < 0.95（1 - eps）
- **保留**（相似度未达到重复阈值）

**样本3（"I need to buy some apples."）**：
- 与前面样本语义完全不同
- 余弦相似度很低
- **保留**（唯一样本）

**工作原理**：
1. 使用 BERT 模型将文本转换为嵌入向量
2. 计算嵌入向量间的余弦相似度
3. 相似度 > (1 - eps) 视为语义重复
4. 默认 eps=0.05，即相似度 > 0.95 视为重复

**应用场景**：
- 语义去重（内容相似但表述不同）
- 问答数据集去重
- 新闻文章去重
- 用户反馈去重

**注意事项**：
- 使用 `sentence-transformers/all-MiniLM-L6-v2` 模型
- 需要GPU加速（推荐）
- 比字符级去重更准确，但计算开销更大
- `eps` 越小，去重越严格
- 首次运行需要下载模型
