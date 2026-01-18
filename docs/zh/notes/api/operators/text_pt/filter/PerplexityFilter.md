---
title: PerplexityFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/filter/perplexityfilter/
---

## 📘 概述

`PerplexityFilter` 是一个基于困惑度（Perplexity）的数据过滤算子。它利用 Hugging Face 的预训练语言模型计算文本的困惑度分数，并根据设定的最小和最大阈值筛选数据。困惑度越低，通常表示文本的流畅性和可理解性越高。

## `__init__`函数

```python
def __init__(self, min_score: float = 10.0, max_score: float = 500.0, model_name: str = 'gpt2', device='cuda')
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 10.0 | 困惑度分数的最小阈值，低于此值的数据将被丢弃。 |
| **max_score** | float | 500.0 | 困惑度分数的最大阈值，高于此值的数据将被丢弃。 |
| **model_name** | str | 'gpt2' | 用于计算困惑度的 Hugging Face 模型名称或本地路径。 |
| **device** | str | 'cuda' | 模型运行的设备，例如 'cuda' 或 'cpu'。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PerplexityScore')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要计算困惑度的文本字段。 |
| **output_key** | str | 'PerplexityScore' | 输出列名，用于存储计算出的困惑度分数字段。 |

## 🧠 示例用法

```python
from dataflow.operators.text_pt.filter import PerplexityFilter
from dataflow.utils.storage import FileStorage

# 准备数据和存储
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# 初始化并运行过滤器
perplexity_filter = PerplexityFilter(
    min_score=10.0,
    max_score=500.0,
    model_name='gpt2',
    device='cuda'
)
perplexity_filter.run(
    storage.step(),
    input_key='raw_content',
    output_key='PerplexityScore'
)
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入数据中的原有字段。 |
| PerplexityScore | float | 模型为 `input_key` 中每个文本计算出的困惑度分数。 |

**示例输入:**
```json
{
"raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)..."
}
```
**示例输出 (如果通过筛选):**
```json
{
"raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)...",
"PerplexityScore": 49.2016410828
}
```
