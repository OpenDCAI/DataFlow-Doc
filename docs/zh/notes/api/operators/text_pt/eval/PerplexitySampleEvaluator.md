---
title: PerplexitySampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/eval/perplexitysampleevaluator/
---

## 📘 概述

[PerplexitySampleEvaluator]() 是一个基于 Hugging Face 语言模型计算文本困惑度（Perplexity）的评估算子。困惑度是衡量语言模型预测样本好坏程度的指标，其值越低，通常表示文本的流畅性和可理解性越高。该算子可用于评估生成文本的质量。

## __init__函数

```python
def __init__(self, model_name: str = 'gpt2', device='cuda'):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **model_name** | str | 'gpt2' | Hugging Face Hub 上的模型名称或本地路径，用于计算困惑度。 |
| **device** | str | 'cuda' | 模型运行的设备，例如 'cuda' 或 'cpu'。若不指定，则优先使用 CUDA。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str = 'raw_content', output_key: str = 'PerplexityScore'):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "raw_content" | 输入列名，对应待评估文本内容的字段。 |
| **output_key** | str | "PerplexityScore" | 输出列名，对应生成的困惑度分数字段。 |

## 🧠 示例用法

```python
from dataflow.operators.text_pt.eval import PerplexitySampleEvaluator
from dataflow.utils.storage import FileStorage

# 准备数据和存储
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# 初始化并运行算子
perplexity_evaluator = PerplexitySampleEvaluator(model_name='gpt2')
perplexity_evaluator.run(
    storage.step(),
    input_key='raw_content',
    output_key='PerplexityScore'
)
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| raw_content | str | 输入的待评估文本。 |
| PerplexityScore | float | 模型计算出的困惑度分数。 |

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
  "PerplexityScore": 49.2016410828
}
```
