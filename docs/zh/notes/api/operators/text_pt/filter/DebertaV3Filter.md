---
title: DebertaV3Filter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/filter/debertav3filter/
---

## 📘 概述

[DebertaV3Filter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/debertav3_filter.py) 是一个基于 Deberta V3 模型的文本质量过滤算子。它利用 Nvidia 的质量分类器对输入文本进行评分（如 'High', 'Medium', 'Low'），并根据预设的允许分数列表来筛选数据，保留符合质量要求的样本。

## __init__函数
```python
def __init__(self, allowed_scores : list = ['Medium', 'High'], model_name='nvidia/quality-classifier-deberta', model_cache_dir='./dataflow_cache', device='cuda', batch_size=16):
```
### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :---- | :---------------------------------- | :---------------------------------- |
| **allowed_scores** | list | `['Medium', 'High']` | 允许通过的分数列表。 |
| **model_name** | str | `'nvidia/quality-classifier-deberta'` | Deberta V3 质量分类器模型名称。 |
| **model_cache_dir** | str | `'./dataflow_cache'` | 模型缓存目录。 |
| **device** | str | `'cuda'` | 运行设备（例如 'cuda' 或 'cpu'）。 |
| **batch_size** | int | `16` | 批处理大小。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'Debertav3Score')
```
执行算子主逻辑，从存储中读取输入 DataFrame，对指定列进行质量评分，并根据 `allowed_scores` 过滤数据，最后将结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :---------- | :---------------- | :------------------ | :----------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要进行质量评估的文本字段。 |
| **output_key**| str | `'Debertav3Score'` | 输出列名，对应生成的质量分数字段。 |

## 🧠 示例用法

```python
from dataflow.operators.text_pt.filter import DebertaV3Filter
from dataflow.utils.storage import FileStorage

# 准备数据和存储
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# 初始化并运行过滤器
deberta_filter = DebertaV3Filter(
    allowed_scores=['Medium', 'High'],
    model_name='nvidia/quality-classifier-deberta',
    model_cache_dir='./dataflow_cache',
    device='cuda',
    batch_size=16
)
deberta_filter.run(
    storage.step(),
    input_key='raw_content',
    output_key='Debertav3Score'
)
```

#### 🧾 默认输出格式（Output Format）

算子执行后，会在输入的 DataFrame 中增加一个由 `output_key` 指定的列，用于存放质量分数。最终输出的 DataFrame 只包含分数在 `allowed_scores` 列表中的行。

| 字段 | 类型 | 说明 |
| :--------------------------------- | :---- | :--------------------------------------------------------- |
| ... | ... | （输入 DataFrame 的原始字段） |
| **Debertav3Score** (或自定义的`output_key`) | str | 模型生成的质量分数（例如 'High', 'Medium', 'Low'）。 |

**示例输入:**
```json
{
    "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)..."
}
```
**示例输出 (假设评分为'High'且'High'在`allowed_scores`中):**
```json
{
    "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)...",
    "Debertav3Score": "High"
}
```
