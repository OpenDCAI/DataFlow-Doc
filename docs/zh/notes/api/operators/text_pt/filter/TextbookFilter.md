---
title: TextbookFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/filter/textbookfilter/
---

## 📘 概述

[TextbookFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filters/textbook_filter.py) 是一个基于[TextbookScorer](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/scorers/textbook_scorer.py)打分器对数据进行过滤的算子。它使用FastText分类器来评估文本的教育价值，判断文本是否适合作为教材内容。该分类器经过专门训练，能够识别具有教育意义、结构清晰、知识准确的文本，非常适用于构建高质量的教育类数据集。

## __init__函数

```python
def __init__(self, min_score=0.99, max_score=1, model_cache_dir:str='./dataflow_cache')
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 0.99 | 保留样本的最小教育价值分数阈值。 |
| **max_score** | float | 1 | 保留样本的最大教育价值分数阈值。 |
| **model_cache_dir** | str | './dataflow_cache' | 用于存储FastText模型的缓存目录。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='TextbookScore')
```

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要评分的文本字段。 |
| **output_key** | str | "TextbookScore" | 输出列名，对应生成的教育价值分数字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

算子会向DataFrame中添加一个新列（默认为 `TextbookScore`），并根据 `min_score` 和 `max_score` 过滤数据行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| (input_key) | str | 输入的原始文本。 |
| TextbookScore | float | 模型生成的教育价值分数。 |

**示例输入：**

```json
{
    "text": "The Pythagorean theorem states that in a right-angled triangle, the square of the length of the hypotenuse is equal to the sum of the squares of the other two sides."
}
```

**示例输出（假设该样本通过过滤）：**

```json
{
    "text": "The Pythagorean theorem states that in a right-angled triangle, the square of the length of the hypotenuse is equal to the sum of the squares of the other two sides.",
    "TextbookScore": 0.995
}
```
