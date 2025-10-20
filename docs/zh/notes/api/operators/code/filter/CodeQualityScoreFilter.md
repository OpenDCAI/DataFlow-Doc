---
title: CodeQualityScoreFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/filter/codequalityscorefilter/
---

## 📘 概述

[CodeQualityScoreFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filters/code_quality_score_filter.py) 是一个代码质量分数过滤算子，它根据由大语言模型（LLM）驱动的评估器（`CodeQualitySampleEvaluator`）生成的质量分数来筛选代码样本。该算子会从代码的正确性、完整性、清晰度、最佳实践和效率等多个维度进行评估，并过滤掉分数低于指定阈值的样本。

## __init__函数

```python
def __init__(self, llm_serving: LLMServingABC, min_score: int = 7, max_score: int = 10)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行代码质量评估。 |
| **min_score** | int | 7 | 最小质量分数阈值，分数低于此值的样本将被过滤。 |
| **max_score** | int | 10 | 最大质量分数阈值，分数在此值范围内的样本将被保留。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'quality_score_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要评估的代码字段。 |
| **output_key** | str | "quality\_score\_filter\_label" | 输出列名，用于存储过滤结果的标签（1表示保留，0表示过滤）。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入的原始字段。 |
| quality\_score | int | 模型生成的代码质量分数。 |
| quality\_feedback | str | 模型生成的关于代码质量的具体反馈。 |
| quality\_score\_filter\_label | int | 过滤标签，1表示样本通过筛选，0表示被过滤。 |

示例输入：

```json
{
    "instruction": "编写一个Python函数，计算两个数的和。",
    "code_solution": "def add(a, b):\n  return a + b"
}
```

示例输出：

```json
{
    "instruction": "编写一个Python函数，计算两个数的和。",
    "code_solution": "def add(a, b):\n  return a + b",
    "quality_score": 10,
    "quality_feedback": "代码正确、简洁且遵循了Python的最佳实践。",
    "quality_score_filter_label": 1
}
```
