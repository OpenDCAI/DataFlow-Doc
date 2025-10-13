---
title: RemoveStopwordsRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removestopwordsrefiner/
---

好的，这是根据您提供的代码和模板生成的 `RemoveStopwordsRefiner` 算子的中文教程 Markdown。

## 📘 概述

[RemoveStopwordsRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refiners/remove_stopwords_refiner.py) 是一个文本优化算子，用于移除输入文本中的英语停用词（如 "the", "is", "in" 等无实际意义的高频词汇）。该算子利用 NLTK 库的停用词语料库，对指定字段的文本进行过滤，旨在提高文本的特征密度，为后续的自然语言处理任务做准备。

## `__init__`函数

```python
def __init__(self, model_cache_dir: str = './dataflow_cache')
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **model_cache_dir** | str | './dataflow_cache' | 用于存储 NLTK 停用词数据的缓存目录路径。 |

### Prompt模板说明



## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列的名称，该列包含需要移除停用词的文本。 |

## 🧠 示例用法



#### 🧾 默认输出格式（Output Format）

该算子会就地修改（in-place）输入 `DataFrame` 中由 `input_key` 指定的列。原始文本中的停用词将被移除，处理后的文本会覆盖该列的原有内容。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| {input_key} | str | 移除了停用词后的文本。 |

**示例输入：**
```json
{
    "text": "This is a sample sentence showing the removal of stopwords."
}
```
**示例输出（假设 `input_key`="text"）：**
```json
{
    "text": "sample sentence showing removal stopwords."
}
```
