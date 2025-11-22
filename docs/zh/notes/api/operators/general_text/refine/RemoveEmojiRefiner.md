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

```python
from dataflow.operators.general_text import RemoveEmojiRefiner
from dataflow.utils.storage import FileStorage

class RemoveEmojiRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_emoji_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveEmojiRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveEmojiRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 移除了表情符号后的文本 |

### 📋 示例输入

```json
{"text":"Hello world! This is a test without emoji."}
{"text":"Great work 👍 Keep it up! 🎉"}
{"text":"看这个表情😊很开心😄🎊"}
{"text":"Mixed text with 🚀 rocket and 🌟 star emojis"}
{"text":"Celebration time 🎉🎊🎈 with party emojis"}
```

### 📤 示例输出

```json
{"text":"Hello world! This is a test without emoji."}
{"text":"Great work  Keep it up! "}
{"text":"看这个表情很开心"}
{"text":"Mixed text with  rocket and  star emojis"}
{"text":"Celebration time  with party emojis"}
```

### 📊 结果分析

在本测试中，5条输入数据中有4条被修改：

**样本1（无表情）**：
- 文本："Hello world! This is a test without emoji."
- 不包含表情符号
- **未修改**（保持原样）

**样本2（英文+表情）**：
- 原文："Great work 👍 Keep it up! 🎉"
- 移除了👍和🎉表情符号
- 结果："Great work  Keep it up! "
- **已修改**

**样本3（中文+表情）**：
- 原文："看这个表情😊很开心😄🎊"
- 移除了所有表情符号😊😄🎊
- 结果："看这个表情很开心"
- **已修改**

**样本4（混合表情）**：
- 原文："Mixed text with 🚀 rocket and 🌟 star emojis"
- 移除了🚀和🌟表情符号
- 结果："Mixed text with  rocket and  star emojis"
- **已修改**

**样本5（庆祝表情）**：
- 原文："Celebration time 🎉🎊🎈 with party emojis"
- 移除了所有庆祝表情符号🎉🎊🎈
- 结果："Celebration time  with party emojis"
- **已修改**

**应用场景**：
- 文本数据标准化和规范化
- 移除社交媒体文本中的表情干扰
- 为 NLP 模型准备纯文本数据
- 清理用户生成内容中的图形符号

**注意事项**：
- 该算子基于 Unicode 范围匹配表情符号
- 涵盖常见的表情符号、符号、旗帜等图像符号
- 移除表情后可能产生多余空格，建议结合 `RemoveExtraSpacesRefiner` 使用
