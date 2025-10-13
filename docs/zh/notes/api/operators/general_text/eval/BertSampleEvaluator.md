---
title: BertSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/bertsampleevaluator/
---

## 📘 概述
`BertSampleEvaluator` 是一个评估算子，用于使用 BERTScore 评估生成文本与参考文本之间的相似度。它基于上下文嵌入计算精确率（Precision）、召回率（Recall）和 F1 分数，从而提供对文本质量的量化评估。

## `__init__`函数
```python
def __init__(self, lang='en', model_cache_dir='./dataflow_cache')
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **lang** | str | 'en' | 指定要评估文本的语言，影响模型选择。 |
| **model_cache_dir** | str | './dataflow_cache' | 用于存储和加载预训练模型的本地缓存目录。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, reference_key: str, output_key: str='BertScore')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估的生成文本字段。 |
| **reference_key** | str | 必需 | 输入列名，对应用于比较的参考文本字段。 |
| **output_key** | str | 'BertScore' | 输出列名，对应生成的BERTScore F1分数字段。 |

## 🧠 示例用法
```python
```
#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| | | |

示例输入：

示例输出：
