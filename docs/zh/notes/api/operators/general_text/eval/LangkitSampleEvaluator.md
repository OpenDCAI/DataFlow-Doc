---
title: LangkitSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/langkitsampleevaluator/
---

好的，这是根据您提供的代码和模板生成的 `LangkitSampleEvaluator` 算子的中文教程 Markdown。

---

## 📘 概述

`LangkitSampleEvaluator` 是一个文本质量评估算子，它使用 Langkit 工具包来计算文本的各项统计指标，从而帮助评估文本的结构复杂性和可读性。该算子能够提取多种语言学特征，包括句子长度、词汇多样性、情感倾向等。

## __init__函数

```python
def __init__(self)
```

该算子在初始化时无需传入参数。

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```
执行算子主逻辑，从存储中读取输入 DataFrame，对指定列的文本进行 Langkit 评估，并将评估结果（多个分数）作为新列添加回 DataFrame 并写入存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，指定需要评估的文本所在的列。 |

## Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :------------------------------ | :---- | :--------------------------------- |
| {input_key} | str | 原始输入的文本列。 |
| LangkitNumSentencesScore | int | 句子数量。 |
| LangkitNumWordsScore | int | 单词数量。 |
| LangkitAvgWordLengthScore | float | 平均单词长度。 |
| LangkitFleschReadingEaseScore | float | 可读性评分（Flesch公式）。 |
| LangkitSentimentScore | float | 情感倾向（-1到1之间）。 |

**示例输入：**

```json
{
    "text_column": "Dataflow is a powerful tool for building complex data processing pipelines. It simplifies development and enhances reusability."
}
```

**示例输出：**

```json
{
    "text_column": "Dataflow is a powerful tool for building complex data processing pipelines. It simplifies development and enhances reusability.",
    "LangkitNumSentencesScore": 2,
    "LangkitNumWordsScore": 20,
    "LangkitAvgWordLengthScore": 6.1,
    "LangkitFleschReadingEaseScore": 42.63,
    "LangkitSentimentScore": 0.4
}
```
