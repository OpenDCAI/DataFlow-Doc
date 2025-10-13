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

```

#### 🧾 默认输出格式（Output Format）

该算子会就地修改输入的 DataFrame，将清理后的文本写回到 `input_key` 指定的列中。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| {input_key} | str | 经过 HTML 实体移除处理后的文本。 |
| ... | ... | 其他输入字段保持不变。 |

**示例输入：**
*(假设 `input_key` 为 `"content"`) *

```json
{
"content":"这是一个示例文本&nbsp;，它包含了&lt;特殊&gt;实体＆amp;符号；"
}
```

**示例输出：**

```json
{
"content":"这是一个示例文本 ，它包含了特殊实体符号"
}
```
