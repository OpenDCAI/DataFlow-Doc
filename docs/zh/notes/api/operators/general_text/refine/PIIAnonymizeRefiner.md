---
title: PIIAnonymizeRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/piianonymizerefiner/
---

## 📘 概述

`PIIAnonymizeRefiner` 是一个使用 Presidio 和 BERT-NER 模型来识别并匿名化文本中个人身份信息（PII）的算子。它支持多种 PII 类型的检测和匿名化处理，有效保护数据隐私。

## `__init__`函数

```python
def __init__(self, lang='en', device='cuda', model_cache_dir='./dataflow_cache', model_name='dslim/bert-base-NER')
```

### init参数说明

| 参数名              | 类型 | 默认值                 | 说明                         |
| :------------------ | :--- | :----------------------- | :--------------------------- |
| **lang**            | str  | 'en'                     | 文本的语言代码，用于选择合适的模型。 |
| **device**          | str  | 'cuda'                   | 模型运行的设备，例如 'cuda' 或 'cpu'。 |
| **model_cache_dir** | str  | './dataflow_cache'       | 用于存储下载的NER模型的本地缓存目录。 |
| **model_name**      | str  | 'dslim/bert-base-NER'    | 使用的预训练NER模型名称。        |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :-------------- | :------- | :------- | :------- |
|                 |          |          |          |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称        | 类型            | 默认值 | 说明                                       |
| :---------- | :-------------- | :----- | :----------------------------------------- |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str             | 必需   | 输入列名，对应需要进行PII匿名化处理的文本字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

该算子会修改输入数据中指定 `input_key` 列的内容，将识别出的PII信息替换为匿名化标签（如 `<PERSON>`, `<PHONE_NUMBER>` 等）。

| 字段      | 类型 | 说明                   |
| :-------- | :--- | :--------------------- |
| input_key | str  | 经过PII匿名化处理后的文本。 |

**示例输入：**

```json
{
  "text": "My name is John Doe and I live in New York. You can call me at 212-555-1234."
}
```

**示例输出：**
(假设 `input_key` 为 "text")

```json
{
  "text": "My name is <PERSON> and I live in <LOCATION>. You can call me at <PHONE_NUMBER>."
}
```
