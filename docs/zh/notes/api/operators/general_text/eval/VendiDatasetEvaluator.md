---
title: VendiDatasetEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/vendidatasetevaluator/
---

## 📘 概述

`VendiDatasetEvaluator` 是一个用于评估数据集多样性的算子。它通过计算 VendiScore 来实现这一功能，利用预训练的 BERT 和 SimCSE 模型生成文本嵌入，并基于这些嵌入计算最终的多样性分数。

## __init__函数

```python
def __init__(self, device='cuda')
```

### init参数说明

| 参数名      | 类型 | 默认值   | 说明         |
| :---------- | :--- | :------- | :----------- |
| **device**  | str  | `'cuda'` | 计算设备。 |

### Prompt模板说明

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称        | 类型              | 默认值 | 说明                           |
| :---------- | :---------------- | :----- | :----------------------------- |
| **storage** | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str               | 必需   | 输入列名，对应需要评估的文本字段。   |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

| 字段                | 类型  | 说明             |
| :------------------ | :---- | :--------------- |
| BERTVendiScore      | float | 基于BERT的多样性得分。 |
| SimCSEVendiScore    | float | 基于SimCSE的多样性得分。 |

示例输出：

```json
{
    "BERTVendiScore": 98.55,
    "SimCSEVendiScore": 85.20
}
```
