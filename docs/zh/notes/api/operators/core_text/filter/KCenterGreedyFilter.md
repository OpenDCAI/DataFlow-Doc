---
title: KCenterGreedyFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/filter/kcentergreedyfilter/
---

## 📘 概述
`KCenterGreedyFilter` 算子用于从大量的文档片段中，通过 K-Center-Greedy 算法选取具有代表性的一部分文档片段，常用于后续生成种子QA对等任务，以确保样本的多样性。

## __init__函数
```python
def __init__(self, num_samples: int, embedding_serving : LLMServingABC = None)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **num_samples** | int | 必需 | 希望从数据集中选取的文档片段数量。 |
| **embedding_serving** | LLMServingABC | None | 嵌入模型服务实例，用于将文本片段转换为向量表示。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage:DataFlowStorage, input_key: str = "content")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "content" | 输入列名，对应包含文档片段内容的字段。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
算子执行后，会筛选输入数据并保留 `num_samples` 个最具代表性的行。输出的数据格式与输入格式完全相同，但行数减少。
