---
title: LanguageFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/languagefilter/
---

## 📘 概述

`LanguageFilter` 是一个语言过滤算子，使用 FastText 语言识别模型过滤数据。它会下载并加载预训练的 FastText 模型，检查输入文本的语言是否在用户指定的允许语言列表中，并只保留符合条件的行。

## `__init__`函数

```python
def __init__(self, allowed_languages: list, model_cache_dir: str = None)
```

### init参数说明

| 参数名              | 类型   | 默认值 | 说明                                                         |
| :------------------ | :----- | :----- | :----------------------------------------------------------- |
| **allowed_languages** | list | 必需   | 允许的语言标签列表，例如 `['__label__en', '__label__zh']`。    |
| **model_cache_dir** | str    | None   | 模型缓存目录的路径。如果为 `None`，则使用默认的 Hugging Face 缓存位置。 |

### Prompt模板说明

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='language_label')
```

#### 参数

| 名称          | 类型              | 默认值             | 说明                                       |
| :------------ | :---------------- | :----------------- | :----------------------------------------- |
| **storage**   | DataFlowStorage   | 必需               | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str               | 必需               | 输入列名，对应待检测语言的文本字段。       |
| **output_key**  | str               | 'language_label'   | 输出列名，用于存储语言检测结果的标签。     |

## 🧠 示例用法
