---
title: HtmlEntityFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/htmlentityfilter/
---

## 📘 概述

`HtmlEntityFilter` 算子用于检测并过滤包含HTML实体（如 `&amp;`、`&lt;`、`&gt;` 等）的文本，确保内容不包含标记语言元素。

## `__init__`函数

```python
def __init__(self):
```

该函数没有参数。

## `run`函数

```python
def run(self, storage, input_key, output_key='html_entity_filter_label'):
```

#### 参数

| 名称          | 类型              | 默认值                       | 说明                                                         |
| :------------ | :---------------- | :--------------------------- | :----------------------------------------------------------- |
| **storage**   | DataFlowStorage   | 必需                         | 数据流存储实例，负责读取与写入数据。                         |
| **input_key** | str               | 必需                         | 输入列名，对应待检测的文本字段。                             |
| **output_key**| str               | "html_entity_filter_label" | 输出列名，用于存储过滤结果的标签（1表示通过，0表示未通过）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import HtmlEntityFilter
from dataflow.utils.storage import FileStorage

class HtmlEntityFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/html_entity_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = HtmlEntityFilter()
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='html_entity_filter_label'
        )

if __name__ == "__main__":
    test = HtmlEntityFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

该算子会向DataFrame中添加一个布尔标签列（`output_key`），然后过滤掉包含HTML实体的行。存储中将保存过滤后的DataFrame。

| 字段                      | 类型 | 说明                                                         |
| :------------------------ | :--- | :----------------------------------------------------------- |
| text                      | str  | 原始输入文本                                                 |
| html_entity_filter_label  | int  | 过滤标签，值为1，表示该行文本不包含HTML实体，已通过过滤    |

### 📋 示例输入

```json
{"text": "This is normal text without HTML entities."}
{"text": "This text contains &amp; HTML &lt;entities&gt; like &quot;quotes&quot;."}
```

### 📤 示例输出

```json
{"text": "This is normal text without HTML entities.", "html_entity_filter_label": 1}
```

### 📊 结果分析

**样本1（纯文本）**：
- 文本："This is normal text without HTML entities."
- 不包含HTML实体
- **保留**（html_entity_filter_label=1）

**样本2（包含HTML实体）**：
- 文本："This text contains &amp; HTML &lt;entities&gt; like &quot;quotes&quot;."
- 包含多个HTML实体：`&amp;`（&）、`&lt;`（<）、`&gt;`（>）、`&quot;`（"）
- **过滤**（不在输出中）

**常见HTML实体**：
- `&amp;` → &
- `&lt;` → <
- `&gt;` → >
- `&quot;` → "
- `&apos;` → '
- `&nbsp;` → 空格
- `&#39;` → '
- `&#34;` → "

**应用场景**：
- 清理网页爬取数据中的HTML标记残留
- 过滤包含转义字符的文本
- 确保文本数据的纯净性
- 预处理阶段移除格式化标记

**注意事项**：
- 算子使用正则表达式检测HTML实体模式（`&[a-zA-Z]+;` 和 `&#[0-9]+;`）
- 会识别命名实体（如`&amp;`）和数字实体（如`&#39;`）
- 如果只需要清理而非过滤，可以考虑使用HTML解码工具
