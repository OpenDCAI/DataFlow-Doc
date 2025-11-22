---
title: HtmlEntityRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/htmlentityrefiner/
---

好的，这是根据您提供的代码和模板生成的 `HtmlEntityRefiner` 算子的中文教程 Markdown 代码。

---

## 📘 概述

[HtmlEntityRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refine/html_entity_refiner.py) 是一个文本清理算子，用于去除文本中的 HTML 实体，如 `&nbsp;`, `&lt;` 等。它不仅能处理标准的 HTML 实体，还能识别并移除多种变体形式（例如使用全角符号 `＆` 或中文分号 `；`）。该算子支持用户自定义需要移除的 HTML 实体列表，提供了灵活的文本预处理能力。

## `__init__`函数

```python
def __init__(self, html_entities: list = [
            "nbsp", "lt", "gt", "amp", "quot", "apos", "hellip", "ndash", "mdash", 
            "lsquo", "rsquo", "ldquo", "rdquo"
        ]):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **html_entities** | list | `["nbsp", "lt", "gt", ...]` | 一个字符串列表，其中每个字符串是需要被移除的 HTML 实体的名称（不含 `&` 和 `;`）。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列的名称，该列包含需要清理HTML实体的文本。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import HtmlEntityRefiner
from dataflow.utils.storage import FileStorage

class HtmlEntityRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/html_entity_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = HtmlEntityRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = HtmlEntityRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 移除 HTML 实体后的文本 |

### 📋 示例输入

```json
{"text":"Hello&nbsp;world&lt;test&gt;"}
{"text":"Copyright&copy;2024&mdash;All rights"}
{"text":"Price&colon;$100"}
```

### 📤 示例输出

```json
{"text":"Helloworldtest"}
{"text":"Copyright&copy;2024All rights"}
{"text":"Price&colon;$100"}
```

### 📊 结果分析

**样本1**：移除 `&nbsp;` `&lt;` `&gt;`
**样本2-3**：部分实体未被移除（`&copy;` `&colon;` 不在预定义列表中）

**应用场景**：
- 清理 HTML 文本
- 移除常见 HTML 实体

**注意事项**：
- 仅移除预定义列表中的 HTML 实体
