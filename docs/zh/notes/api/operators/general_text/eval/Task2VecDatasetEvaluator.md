---
title: Task2VecDatasetEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/task2vecdatasetevaluator/
---

## 📘 概述

`Task2VecDatasetEvaluator` 是一个用于评估数据集多样性的算子。它通过 Task2Vec 方法将数据集中的样本转换为嵌入向量，并计算这些嵌入向量之间的余弦距离矩阵来量化数据集的整体多样性。

## \_\_init\_\_函数

```python
def __init__(self, device='cuda', sample_nums=10, sample_size=1, method: Optional[str]='montecarlo', model_cache_dir='./dataflow_cache')
```

### init参数说明

| 参数名              | 类型 | 默认值             | 说明                                                   |
| :------------------ | :--- | :----------------- | :----------------------------------------------------- |
| **device**          | str  | 'cuda'             | 计算设备。                                             |
| **sample\_nums**    | int  | 10                 | 采样次数。                                             |
| **sample\_size**    | int  | 1                  | 每次采样的样本数量。                                   |
| **method**          | str  | 'montecarlo'       | 计算嵌入向量的方法，可选 'montecarlo' 或 'variational'。 |
| **model\_cache\_dir** | str  | './dataflow\_cache' | 用于存储预训练模型的缓存目录。                         |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :-------------- | :------- | :------- | :------- |
|                 |          |          |          |
|                 |          |          |          |
|                 |          |          |          |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称        | 类型            | 默认值 | 说明                           |
| :---------- | :-------------- | :----- | :----------------------------- |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。 |
| **input\_key**  | str             | 必需   | 输入列名，对应待评估的文本字段。   |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段                     | 类型  | 说明             |
| :----------------------- | :---- | :--------------- |
| Task2VecDiversityScore   | float | 数据集的多样性得分。 |
| ConfidenceInterval     | tuple | 多样性得分的置信区间。 |
