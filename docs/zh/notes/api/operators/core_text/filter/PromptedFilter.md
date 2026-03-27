---
title: PromptedFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/filter/promptedfilter/
---

## 📘 概述

[PromptedFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/prompted_filter.py) 是一个基于大语言模型（LLM）打分的筛选算子。它使用内置的 `PromptedEvaluator` 对输入数据进行数值化打分，并根据用户指定的最小与最大分数区间，筛选出符合条件的样本。默认打分范围是 1–5，但用户可以通过自定义 `system_prompt` 来设定不同的评分规则。

> **数据校验：** 在评估之前，算子会自动过滤掉 `input_key` 字段中包含无效内容的行（包括 `None`、`NaN`、空字符串、空集合等）。只有包含有效内容的行才会被发送至 LLM 进行打分。跳过的行数会记录在日志中，便于追踪。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "Please evaluate the quality of this data on a scale from 1 to 5."):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行评估打分。 |
| **system_prompt** | str | "Please evaluate the quality of this data on a scale from 1 to 5." | 系统提示词，用于指导大语言模型进行打分评估。用户可以自定义评分规则和范围。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "eval", min_score = 5, max_score = 5):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "raw_content" | 输入列名，对应待评估的文本字段。 |
| **output_key** | str | "eval" | 输出列名，对应生成的评估分数。 |
| **min_score** | int | 5 | 筛选的最低分数（包含）。 |
| **max_score** | int | 5 | 筛选的最高分数（包含）。 |

## 🛡️ 数据校验

在将数据发送至 LLM 进行评估之前，`PromptedFilter` 会使用内置的 `_has_valid_content` 方法对输入数据进行校验。以下类型的值被视为**无效**，将被自动跳过：

| 无效值类型 | 示例 |
| :--- | :--- |
| `None` | `None` |
| `NaN` | `float('nan')` |
| 空字符串 | `""`、`"   "` |
| 空集合 | `[]`、`{}`、`()`、`set()` |
| 布尔值 `False` | `False` |

只有 `input_key` 列中包含有效内容的行才会被送入 LLM 打分。包含无效内容的行会被自动排除，不会出现在输出结果中。跳过的行数会记录在日志中。

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

输出的数据格式为保留了输入数据所有字段，并额外增加了打分结果列（默认为 `eval`）的 DataFrame，同时仅包含分数在 `[min_score, max_score]` 区间内的行。`input_key` 为空或无效的行在评估前即被排除。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入数据中的原始字段。 |
| raw_content | str | （默认 `input_key`）待评估的文本内容。 |
| eval | int | （默认 `output_key`）模型生成的评估分数。 |
