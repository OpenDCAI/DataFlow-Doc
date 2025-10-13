---
title: BleuSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/bleusampleevaluator/
---

## 📘 概述

[BleuSampleEvaluator]() 是一个用于评估文本质量的算子。它通过计算生成文本与参考文本之间的BLEU（Bilingual Evaluation Understudy）分数来衡量二者的相似度。BLEU分数主要通过分析n-gram（连续n个词的序列）的重叠度来评估翻译或文本生成的准确性和流畅性。

## `__init__`函数

```python
def __init__(self, n=4, eff="average", special_reflen=None)
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :-- | :--- | :--- |
| **n** | int | 4 | 用于计算BLEU分数的最大n-gram长度。 |
| **eff** | str | "average" | 参考文本长度的计算方式。可选值为 "shortest"、"average" 或 "longest"。 |
| **special_reflen** | int | None | 如果指定，将使用该值作为特殊的参考文本长度，而不是根据实际参考文本计算。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, reference_key: str, output_key: str='BleuScore')
```

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要评估的生成文本字段。 |
| **reference_key** | str | 必需 | 参考列名，对应标准的参考文本字段。 |
| **output_key** | str | "BleuScore" | 输出列名，用于存储计算出的BLEU分数。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :-- | :--- |
| ... | ... | 输入的原始字段。 |
| BleuScore | float | 模型生成的BLEU分数。 |
