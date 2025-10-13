---
title: LLMLanguageFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/llmlanguagefilter/
---

## 📘 概述

`LLMLanguageFilter` 是一个基于大语言模型（LLM）的语言过滤算子。它通过调用 LLM 识别输入文本的语言，并根据预设的允许语言列表对数据进行筛选。该算子主要用于数据清洗、多语言数据分类等场景，确保数据流中的文本符合特定的语言要求。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC = None, allowed_languages: list[str] = ['en'])
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行语言识别。 |
| **allowed_languages** | list[str] | ['en'] | 允许通过的语言列表，使用 ISO 639-1 双字母语言代码（例如 'en' 代表英语，'zh' 代表中文）。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'language_label')
```

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要进行语言识别的文本字段。 |
| **output_key** | str | 'language_label' | 输出列名，对应 LLM 生成的语言标签字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

算子执行后，会向 DataFrame 中添加一个 `output_key`（默认为 `language_label`）列，用于存储识别出的语言标签。随后，它会筛选出该列值在 `allowed_languages` 列表中的行，并写回存储。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| [input_key] | str | 输入的原始文本字段。 |
| language_label | str | 模型识别出的语言标签（例如 'en', 'zh'）。 |
| ... | - | 其他原始输入字段将被保留。 |
