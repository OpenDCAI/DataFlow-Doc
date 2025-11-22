---
title: DeitaQualityFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/filter/deitaqualityfilter/
---

## 📘 概述

[DeitaQualityFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/quality_filter.py)是一个数据质量过滤算子，它使用基于Llama模型的Deita指令质量评估器对数据进行打分，并根据设定的分数阈值过滤数据，保留指定分数区间内的高质量数据。

## \_\_init\_\_函数

```python
def __init__(self, min_score=2.5, max_score=10000.0, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)
```

### init参数说明

| 参数名              | 类型  | 默认值               | 说明                     |
| :------------------ | :---- | :------------------- | :----------------------- |
| **min_score**       | float | 2.5                  | 最低分数阈值，低于此分数的数据将被过滤。 |
| **max_score**       | float | 10000.0              | 最高分数阈值，高于此分数的数据将被过滤。 |
| **device**          | str   | 'cuda'               | 运行评估模型的设备。       |
| **model_cache_dir** | str   | './dataflow_cache' | 模型缓存目录。             |
| **max_length**      | int   | 512                  | 模型处理的最大序列长度。   |

### Prompt模板说明

## run函数

```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_output_key : str = 'output', output_key: str = "DeitaQualityScore")
```

#### 参数

| 名称                      | 类型            | 默认值                | 说明                         |
| :------------------------ | :-------------- | :-------------------- | :--------------------------- |
| **storage**               | DataFlowStorage | 必需                  | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str             | 'instruction'         | 输入数据中指令所在的列名。   |
| **input_output_key**      | str             | 'output'              | 输入数据中输出所在的列名。   |
| **output_key**            | str             | "DeitaQualityScore" | 存储质量分数的输出列名。     |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

算子执行后，会在原始数据基础上增加一个由`output_key`指定的列，用于存放质量分数。

| 字段                | 类型  | 说明                                                         |
| :------------------ | :---- | :----------------------------------------------------------- |
| ...                 | ...   | 原始输入数据中的所有字段。                                     |
| DeitaQualityScore   | float | 模型为每条数据生成的质量评估分数（默认列名，可通过`output_key`参数修改）。 |
