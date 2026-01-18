---
title: TextbookSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/eval/textbooksampleevaluator/
---

## 📘 概述 [TextbookSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluator/textbook_sample_evaluator.py) 是一个基于FastText分类器评估文本教育价值的算子。它将文本质量分为低（Low）、中（Mid）、高（High）三个等级，并分别映射为1.0、3.0、5.0的分数。该算子主要用于从大规模数据中筛选出适合作为教材或教育材料的高质量文本内容。

## \_\_init\_\_函数

```python
def __init__(self, model_cache_dir='./dataflow_cache')
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **model_cache_dir** | str | './dataflow_cache' | 模型缓存目录，用于存储从 Hugging Face Hub 下载的 FastText 模型文件。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='TextbookScore')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估的文本字段。 |
| **output_key** | str | "TextbookScore" | 输出列名，对应生成的教育价值分数字段。 |

## 🧠 示例用法

```python
from dataflow.operators.text_pt.eval import TextbookSampleEvaluator
from dataflow.utils.storage import FileStorage

# 准备数据和存储
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# 初始化并运行算子
textbook_evaluator = TextbookSampleEvaluator()
textbook_evaluator.run(
    storage.step(),
    input_key='raw_content',
    output_key='TextbookScore'
)
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| [input\_key] | str | 输入的待评估文本。 |
| [output\_key] | float | 模型生成的教育价值分数。该分数是基于模型预测的低、中、高三个等级的置信度加权计算得出的。 |

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
  "TextbookScore": 2.9629482031
}
```
