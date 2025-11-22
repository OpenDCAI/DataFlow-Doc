---
title: FineWebEduSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/eval/finewebedusampleevaluator/
---

## 📘 概述

`FineWebEduSampleEvaluator` 是一个基于 Fineweb-Edu 分类器评估文本教育价值的算子。该算子利用预训练的序列分类模型，对输入文本进行打分（0-1之间），分数越高代表文本的教育价值越大。它主要适用于筛选和评估具有教育意义的文本内容。

## __init__函数

```python
def __init__(self, model_cache_dir: str = './dataflow_cache', device: str = 'cuda')
```

### init参数说明

| 参数名              | 类型 | 默认值             | 说明                                   |
| :------------------ | :--- | :----------------- | :------------------------------------- |
| **model_cache_dir** | str  | './dataflow_cache' | 模型缓存目录，用于存放下载的模型文件。 |
| **device**          | str  | 'cuda'             | 模型运行的设备，例如 'cuda' 或 'cpu'。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --------------- | -------- | -------- | -------- |
|                 |          |          |          |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='FineWebEduScore')
```

#### 参数

| 名称         | 类型            | 默认值            | 说明                                     |
| :----------- | :-------------- | :---------------- | :--------------------------------------- |
| **storage**  | DataFlowStorage | 必需              | 数据流存储实例，负责读取与写入数据。     |
| **input_key**| str             | 必需              | 输入列名，对应待评估的文本字段。         |
| **output_key**| str             | 'FineWebEduScore' | 输出列名，对应生成的教育价值分数字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

| 字段              | 类型  | 说明                           |
| :---------------- | :---- | :----------------------------- |
| ...               | ...   | 输入数据中的原始字段。         |
| FineWebEduScore   | float | 模型生成的教育价值分数（0-1之间）。 |

示例输入：

```json
{
"text":"This document explains the theory of relativity, detailing its core principles and mathematical foundations."
}
```

示例输出：

```json
{
"text":"This document explains the theory of relativity, detailing its core principles and mathematical foundations.",
"FineWebEduScore": 0.9865
}
```
