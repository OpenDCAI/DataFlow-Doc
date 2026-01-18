---
title: DebertaV3SampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/eval/debertav3sampleevaluator/
---

## 📘 概述

`DebertaV3SampleEvaluator` 是一个基于 Nvidia Deberta V3 模型的质量分类器，用于评估输入文本的质量并返回相应的分类结果。该算子能够加载预训练的 Deberta V3 模型，对指定的文本列进行逐一样本评估，并将质量分数或类别标签添加为新的输出列。

## __init__函数

```python
def __init__(self, model_name, model_cache_dir='./dataflow_cache', device='cuda')
```

### init参数说明

| 参数名              | 类型 | 默认值              | 说明                               |
| :------------------ | :--- | :------------------ | :--------------------------------- |
| **model_name**      | str  | 必需                | Deberta V3 预训练模型的名称或路径。  |
| **model_cache_dir** | str  | `'./dataflow_cache'` | 用于存储下载模型的本地缓存目录。     |
| **device**          | str  | `'cuda'`            | 计算设备，例如 'cuda' 或 'cpu'。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --------------- | -------- | -------- | -------- |
|                 |          |          |          |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='Debertav3Score')
```

#### 参数

| 名称          | 类型              | 默认值             | 说明                                   |
| :------------ | :---------------- | :----------------- | :------------------------------------- |
| **storage**   | `DataFlowStorage` | 必需               | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | `str`             | 必需               | 输入列名，该列包含待评估的文本数据。     |
| **output_key**| `str`             | `'Debertav3Score'` | 输出列名，用于存储模型生成的质量评估结果。 |

## 🧠 示例用法

```python
from dataflow.operators.text_pt.eval import DebertaV3SampleEvaluator
from dataflow.utils.storage import FileStorage

# 准备数据和存储
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# 初始化并运行算子
deberta_evaluator = DebertaV3SampleEvaluator(
    model_name="Nvidia/deberta-v3-large-local"
)
deberta_evaluator.run(
    storage.step(),
    input_key='raw_content',
    output_key='Debertav3Score'
)
```

#### 🧾 默认输出格式（Output Format）

| 字段             | 类型 | 说明                   |
| :--------------- | :--- | :--------------------- |
| [input_key]      | str  | 输入的原始文本数据。     |
| [output_key]     | str  | 模型生成的质量评估类别。 |

示例输入：
```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios..."
}
```
示例输出：
```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios...",
  "Debertav3Score": "High"
}
```
