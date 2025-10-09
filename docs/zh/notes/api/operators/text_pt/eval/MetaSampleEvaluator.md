---
title: MetaSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/eval/metasampleevaluator/
---

## 📘 概述 [MetaSampleEvaluator]
`MetaSampleEvaluator` 是一个通过大语言模型（LLM）评估文本多个元属性的算子。它能够根据用户定义的维度，对文本的结构、多样性、流畅性、安全性、教育价值以及内容准确性等方面进行打分。

## `__init__`函数
```python
def __init__(self, 
             llm_serving: LLMServingABC = None,
             dimensions: list[dict] = example_dimensions,
            ):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，需实现LLMServingABC接口。 |
| **dimensions** | list[dict] | example_dimensions | 评估维度列表。每个维度是一个字典，包含维度名称、描述和示例列表。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估文本的字段。 |

## 🧠 示例用法


## 🧾 默认输出格式（Output Format）
算子执行后，会在输入的 DataFrame 基础上追加每个评估维度的得分列。
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| ... | - | 输入的原始字段。 |
| Text Structure | float | 文本结构维度的得分。 |
| Diversity & Complexity | float | 多样性与复杂性维度的得分。 |
| Fluency & Understandability | float | 流畅性与可理解性维度的得分。 |
| Safety | float | 安全性维度的得分。 |
| Educational Value | float | 教育价值维度的得分。 |
| Content Accuracy & Effectiveness | float | 内容准确性与有效性维度的得分。 |
