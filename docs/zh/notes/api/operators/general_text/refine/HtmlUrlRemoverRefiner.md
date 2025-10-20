---
title: HtmlUrlRemoverRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/htmlurlremoverrefiner/
---

## 📘 概述

`HtmlUrlRemoverRefiner` 是一个文本净化算子，用于去除文本中的URL链接和HTML标签，净化文本内容。该算子通过正则表达式匹配并移除各种形式的URL和HTML标签，实现对文本数据的清洗。

## `__init__`函数

```python
def __init__(self)
```

### init参数说明

该函数无参数。

## `run`函数

```python
def run(storage, input_key)
```

执行算子主逻辑，从存储中读取输入 DataFrame，移除指定列文本中的URL和HTML标签，并将净化后的结果写回存储。

#### 参数

| 名称        | 类型            | 默认值 | 说明                                     |
| :---------- | :-------------- | :----- | :--------------------------------------- |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | str             | 必需   | 输入列名，对应需要进行净化处理的文本字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import HtmlUrlRemoverRefiner
from dataflow.utils.storage import FileStorage

class HtmlUrlRemoverRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/html_url_remover_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = HtmlUrlRemoverRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = HtmlUrlRemoverRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 移除 URL 和 HTML 标签后的文本 |

### 📋 示例输入

```json
{"text":"Visit https://example.com for more info"}
{"text":"<p>Hello <b>world</b>!</p>"}
{"text":"Check http://test.org and <div>content</div>"}
```

### 📤 示例输出

```json
{"text":"Visit  for more info"}
{"text":"Hello world!"}
{"text":"Check  and content"}
```

### 📊 结果分析

**样本1**：移除 URL "https://example.com"
**样本2**：移除 HTML 标签 `<p>` `<b>`
**样本3**：同时移除 URL 和 HTML 标签

**应用场景**：
- 清理网页爬取的文本
- 移除富文本中的格式标签
- 文本预处理

**注意事项**：
- 移除 URL 和标签后可能产生多余空格
