---
title: PresidioSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/presidiosampleevaluator/
---

## 📘 概述

[PresidioSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluator/presidio_sample_evaluator.py) 是一个使用 Microsoft Presidio 模型识别文本中个人身份信息 (PII) 的评估算子。它会返回检测到的 PII 实体数量。该算子支持多种实体类型，如姓名、邮箱、电话号码等，基于 `dslim/bert-base-NER` 模型实现，适用于评估文本的隐私安全风险。

## \_\_init\_\_函数

```python
def __init__(self, device='cuda', lang='en', model_cache_dir='./dataflow_cache')
```

### init参数说明

| 参数名              | 类型 | 默认值                 | 说明                         |
| :------------------ | :--- | :----------------------- | :--------------------------- |
| **device**          | str  | 'cuda'                   | 指定运行模型的设备（如 'cuda' 或 'cpu'）。 |
| **lang**            | str  | 'en'                     | 指定待分析文本的语言。         |
| **model\_cache\_dir** | str  | './dataflow\_cache' | 用于存储下载模型的缓存目录路径。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --------------- | -------- | -------- | -------- |
|                 |          |          |          |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='PresidioScore')
```

#### 参数

| 名称        | 类型            | 默认值          | 说明                                 |
| :---------- | :-------------- | :-------------- | :----------------------------------- |
| **storage** | DataFlowStorage | 必需            | 数据流存储实例，负责读取与写入数据。 |
| **input\_key**  | str             | 必需            | 输入列名，对应待检测的文本字段。     |
| **output\_key** | str             | 'PresidioScore' | 输出列名，对应检测到的PII实体数量。    |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段          | 类型 | 说明                         |
| :------------ | :--- | :--------------------------- |
| {input\_key}  | str  | 输入的待检测文本。             |
| {output\_key} | int  | 模型检测到的PII（个人身份信息）实体数量。 |

**示例输入：**

```json
{
  "text": "My name is John Doe and my email is john.doe@example.com."
}
```

**示例输出：**

```json
{
  "text": "My name is John Doe and my email is john.doe@example.com.",
  "PresidioScore": 2
}
```
