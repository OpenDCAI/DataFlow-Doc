---
title: WatermarkFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/watermarkfilter/
---

## 📘 概述

[WatermarkFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/watermark_filter.py) 是一个水印内容过滤算子，用于检测并移除包含指定水印关键词（如版权声明、保密标识等）的文本。该算子通过匹配一个预定义的关键词列表，有效识别并过滤掉不符合要求的数据行。

## `__init__`函数

```python
def __init__(self, watermarks: list= ['Copyright', 'Watermark', 'Confidential'])
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **watermarks** | list | `['Copyright', 'Watermark', 'Confidential']` | 用于识别水印内容的关键词列表。 |

## Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='watermark_filter_label')
```

### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检测的文本字段。 |
| **output_key** | str | "watermark_filter_label" | 输出列名，用于标记文本是否通过水印检测。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

该算子会向数据中添加一个新字段（默认为 `watermark_filter_label`），其值为 1 表示通过检测（无水印），0 表示未通过（有水印）。最终输出的数据框仅包含通过检测的行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `<input_key>` | str | 输入的待检测文本。 |
| ... | | 其他原始字段。 |
| watermark_filter_label | int | 水印检测标签，1 表示无水印。输出的数据中此列值恒为1。 |

**示例输入：**

```json
[
    {"text": "This is a clean document."},
    {"text": "Confidential: This document contains sensitive information."},
    {"text": "Another line of text for processing."},
    {"text": "Copyright 2024. All rights reserved."}
]
```

**示例输出：**

```json
[
    {"text": "This is a clean document.", "watermark_filter_label": 1},
    {"text": "Another line of text for processing.", "watermark_filter_label": 1}
]
```
