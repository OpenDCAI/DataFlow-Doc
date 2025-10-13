---
title: ReasoningTokenDatasetEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/eval/reasoningtokendatasetevaluator/
---

## 📘 概述

[ReasoningTokenDatasetEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个用于评估数据集中 Token 信息的算子。它负责统计问题和回答文本的 Token 数量，并提供最小值、最大值、平均值和中位数等关键统计指标。该算子通过指定的 Tokenizer 对文本进行编码，帮助用户了解数据集的文本长度分布特征。

## __init__函数

```python
def __init__(self)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :----- | :--- | :----- | :--- |
|        |      |        | 无   |

## run函数

```python
def run(self, storage: DataFlowStorage, input_question_key: str, input_answer_key: str, model_name_or_path: str)
```

执行算子主逻辑，从存储中读取输入 DataFrame，统计问题和回答的 Token 信息，并返回包含统计结果的字典。

#### 参数

| 名称                 | 类型              | 默认值 | 说明                                                     |
| :------------------- | :---------------- | :----- | :------------------------------------------------------- |
| **storage**          | DataFlowStorage   | 必需   | 数据流存储实例，负责读取数据。                           |
| **input_question_key** | str               | 必需   | 输入数据中问题列的列名。                                 |
| **input_answer_key**   | str               | 必需   | 输入数据中答案列的列名。                                 |
| **model_name_or_path** | str               | 必需   | 用于分词的 tokenizer 模型名称或其在 Hugging Face 上的路径。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段                  | 类型  | 说明                         |
| :-------------------- | :---- | :--------------------------- |
| questions_zeros_count | int   | 问题 Token 数量为 0 的样本数。 |
| answers_zeros_count   | int   | 回答 Token 数量为 0 的样本数。 |
| questions_min         | int   | 问题 Token 数量的最小值。      |
| questions_max         | int   | 问题 Token 数量的最大值。      |
| questions_mean        | float | 问题 Token 数量的平均值。      |
| questions_median      | float | 问题 Token 数量的中位数。      |
| answers_min           | int   | 回答 Token 数量的最小值。      |
| answers_max           | int   | 回答 Token 数量的最大值。      |
| answers_mean          | float | 回答 Token 数量的平均值。      |
| answers_median        | float | 回答 Token 数量的中位数。      |

示例输出：

```json
{
    "questions_zeros_count": 0,
    "answers_zeros_count": 0,
    "questions_min": 10,
    "questions_max": 256,
    "questions_mean": 85.5,
    "questions_median": 78.0,
    "answers_min": 50,
    "answers_max": 1024,
    "answers_mean": 350.2,
    "answers_median": 320.0
}
```
