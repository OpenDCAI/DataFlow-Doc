---
title: NgramSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/ngramsampleevaluator/
---

## 📘 概述

[NgramSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个用于评估文本冗余度的算子。它通过计算文本中 n-gram 的重复比例，来衡量文本的原创性和多样性。

## `__init__`函数

```python
def __init__(self, ngrams=5)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **ngrams** | int | 5 | n-gram 的长度。 |

## 📘 Prompt模板说明

(空白)

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='NgramScore')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估的文本字段。 |
| **output_key** | str | 'NgramScore' | 输出列名，对应生成的 n-gram 得分字段。 |

## 🧠 示例用法

(空白)

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| [input_key] | str | 输入的原始文本。 |
| NgramScore | float | 计算出的 n-gram 得分（0到1之间，越高表示重复度越低）。 |

**示例输入：**
```json
{
"text":"This is a test sentence for testing purposes. This is a test sentence for testing purposes."
}
```
**示例输出：**
```json
{
"text":"This is a test sentence for testing purposes. This is a test sentence for testing purposes.",
"NgramScore": 0.5833333333333334
}
```
