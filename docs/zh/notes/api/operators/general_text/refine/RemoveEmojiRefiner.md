---
title: RemoveEmojiRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removeemojirefiner/
---

## 📘 概述

[RemoveEmojiRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refine/remove_emoji_refiner.py) 是一个文本清洗算子，专门用于从文本中移除各类 Unicode 表情符号（Emoji）。该算子通过高效的正则表达式匹配，可以清除包括表情、符号、旗帜等在内的多种图像符号，适用于数据预处理、文本规范化等场景。

## `__init__`函数

```python
def __init__(self)
```

### `init`参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| - | - | - | 该算子在初始化时无需传入任何参数。 |

## Prompt模板说明

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```
执行算子主逻辑，从存储中读取输入 DataFrame，移除指定列文本中的所有表情符号，并将结果写回存储。

#### 参数

| 名称        | 类型              | 默认值 | 说明                               |
| :---------- | :---------------- | :--- | :--------------------------------- |
| **storage** | DataFlowStorage   | 必需 | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str               | 必需 | 输入列名，对应需要移除表情符号的文本字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

算子会修改 `storage` 中 DataFrame 的 `input_key` 对应列，并将其写回。

| 字段 | 类型 | 说明 |
| :---------- | :---- | :--------------------- |
| [input_key] | str | 移除了表情符号后的文本。 |

示例输入 (`input_key` = "text"):
```json
{
"text":"这是一个带有表情符号的句子👍🎉。"
}
```
示例输出:
```json
{
"text":"这是一个带有表情符号的句子。"
}
```
