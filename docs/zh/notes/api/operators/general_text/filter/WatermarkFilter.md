---
title: WatermarkFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/watermarkfilter/
---

## 📘 概述

`WatermarkFilter` 是一个水印内容过滤算子，用于检测并移除包含指定水印关键词（如版权声明、保密标识等）的文本。该算子通过匹配一个预定义的关键词列表，有效识别并过滤掉不符合要求的数据行。

## `__init__`函数

```python
def __init__(self, watermarks: list= ['Copyright', 'Watermark', 'Confidential'])
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **watermarks** | list | `['Copyright', 'Watermark', 'Confidential']` | 用于识别水印内容的关键词列表。 |

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
from dataflow.operators.general_text import WatermarkFilter
from dataflow.utils.storage import FileStorage

class WatermarkFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/watermark_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = WatermarkFilter(
            watermarks=['Copyright', 'Watermark', 'Confidential']
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='watermark_filter_label'
        )

if __name__ == "__main__":
    test = WatermarkFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

该算子会向数据中添加一个新字段（默认为 `watermark_filter_label`），其值为 1 表示通过检测（无水印），0 表示未通过（有水印）。最终输出的数据框仅包含通过检测的行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `<input_key>` | str | 输入的待检测文本。 |
| watermark_filter_label | int | 水印检测标签，1 表示无水印。输出的数据中此列值恒为1。 |

### 📋 示例输入

```json
{"text": "This is a clean document without any watermarks."}
{"text": "Confidential: This document contains sensitive information."}
{"text": "Another line of text for processing."}
{"text": "Copyright 2024. All rights reserved."}
```

### 📤 示例输出

```json
{"text": "This is a clean document without any watermarks.", "watermark_filter_label": 1}
{"text": "Another line of text for processing.", "watermark_filter_label": 1}
```

### 📊 结果分析

**样本1（无水印）**：
- 文本内容：正常文档描述
- 检测到的水印关键词：无
- **通过过滤**（无水印内容）

**样本2（包含"Confidential"）**：
- 文本内容：包含 "Confidential:" 标记
- 检测到的水印关键词："Confidential"
- **未通过过滤**（匹配水印关键词）

**样本3（无水印）**：
- 文本内容：普通文本
- 检测到的水印关键词：无
- **通过过滤**（无水印内容）

**样本4（包含"Copyright"）**：
- 文本内容：包含版权声明 "Copyright 2024"
- 检测到的水印关键词："Copyright"
- **未通过过滤**（匹配水印关键词）

**工作原理**：
1. 使用正则表达式匹配水印关键词
2. 关键词列表通过 `|` 连接成正则模式
3. 任何匹配到关键词的文本都被过滤
4. 匹配是大小写敏感的

**应用场景**：
- 过滤版权保护内容
- 移除带保密标识的文档
- 清理商业水印文本
- 数据合规性处理

**注意事项**：
- 使用正则表达式进行匹配，支持模糊匹配
- 默认关键词：`['Copyright', 'Watermark', 'Confidential']`
- 可以自定义水印关键词列表
- 匹配是大小写敏感的
