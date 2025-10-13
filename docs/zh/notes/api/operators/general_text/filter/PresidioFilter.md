---
title: PresidioFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/presidiofilter/
---

好的，这是根据您提供的代码和模板生成的 `PresidioFilter` 算子的教程 Markdown。

***

## 📘 概述

`PresidioFilter` 是一个基于 PII (Personally Identifiable Information) 分数的数据过滤算子。它利用 Microsoft Presidio 模型识别并计算文本中的私人实体（如姓名、邮箱、电话号码等）数量，并根据设定的分数阈值范围对数据进行筛选。该算子主要用于数据隐私保护和合规性检查场景。

## __init__函数

```python
def __init__(self, min_score: int = 0, max_score: int = 5, lang='en', device='cuda', model_cache_dir='./dataflow_cache'):
```

### init参数说明

| 参数名              | 类型 | 默认值               | 说明                           |
| :------------------ | :--- | :--------------------- | :----------------------------- |
| **min_score**       | int  | 0                      | 保留样本的最小 PII 数量阈值。     |
| **max_score**       | int  | 5                      | 保留样本的最大 PII 数量阈值。     |
| **lang**            | str  | 'en'                   | 文本语言。                       |
| **device**          | str  | 'cuda'                 | 模型运行设备。                   |
| **model_cache_dir** | str  | './dataflow_cache' | 模型缓存目录。                   |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :------------------ | :------- | :------- | :------- |
|                     |          |          |          |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PresidioScore'):
```

#### 参数

| 名称          | 类型              | 默认值          | 说明                                 |
| :------------ | :---------------- | :---------------- | :----------------------------------- |
| **storage**   | DataFlowStorage   | 必需              | 数据流存储实例，负责读取与写入数据。   |
| **input_key** | str               | 必需              | 输入列名，对应需要检测 PII 的文本字段。 |
| **output_key**| str               | 'PresidioScore' | 输出列名，对应 PII 分数字段。        |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段          | 类型 | 说明                           |
| :------------ | :--- | :----------------------------- |
| ...           | ...  | 输入的原始字段。               |
| PresidioScore | int  | 模型生成的文本中 PII 实体的数量。 |

**示例输入：**

```json
{
"text":"My name is John Doe and my email is john.doe@example.com."
}
```

**示例输出：**

```json
{
"text":"My name is John Doe and my email is john.doe@example.com.",
"PresidioScore": 2
}
```
