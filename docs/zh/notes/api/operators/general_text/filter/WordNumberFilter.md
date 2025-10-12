---
title: WordNumberFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/wordnumberfilter/
---

## 📘 概述

`WordNumberFilter` 是一个文本过滤算子，用于根据单词数量筛选数据。它通过计算指定文本列中的单词数（以空格为分隔符），并保留单词数在预设范围 `[min_words, max_words)` 内的数据行。

## `__init__`函数

```python
def __init__(self, min_words: int=20, max_words: int=100000)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :-- | :--- | :--------------------------------------------- |
| **min_words** | int | 20 | 最小单词数量阈值，文本单词数必须大于或等于此值。 |
| **max_words** | int | 100000 | 最大单词数量阈值，文本单词数必须小于此值。 |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='word_number_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :----------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要被过滤的文本字段。 |
| **output_key** | str | "word_number_filter_label" | 输出列名，用于存储每条记录的单词计数值。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import WordNumberFilter
from dataflow.utils.storage import FileStorage

class WordNumberFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/word_number_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = WordNumberFilter(
            min_words=5,
            max_words=100
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='word_number_filter_label'
        )

if __name__ == "__main__":
    test = WordNumberFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

该算子会向数据中添加一个新字段（由 `output_key` 指定），用于存放原文的单词数量，然后根据 `[min_words, max_words)` 范围过滤数据行。

| 字段 | 类型 | 说明 |
| :--- | :-- | :----------------- |
| {output_key} | int | `input_key` 对应文本的单词数量。 |

### 📋 示例输入

```json
{"text": "Short."}
{"text": "This is a sentence with exactly twenty words and it should pass the filter because it meets the requirement perfectly."}
{"text": "The quick brown fox jumps over the lazy dog."}
```

### 📤 示例输出

```json
{"text": "This is a sentence with exactly twenty words and it should pass the filter because it meets the requirement perfectly.", "word_number_filter_label": 20}
{"text": "The quick brown fox jumps over the lazy dog.", "word_number_filter_label": 9}
```

### 📊 结果分析

**样本1（单词太少）**：
- 单词数：1
- 单词范围：[5, 100)
- **未通过过滤**（1 < 5）

**样本2（正常范围）**：
- 单词数：20
- 单词范围：[5, 100)
- **通过过滤**（5 ≤ 20 < 100）
- `word_number_filter_label` 字段值为实际单词数 20

**样本3（正常范围）**：
- 单词数：9
- 单词范围：[5, 100)
- **通过过滤**（5 ≤ 9 < 100）
- `word_number_filter_label` 字段值为实际单词数 9

**工作原理**：
1. 使用空格分割文本获取单词列表
2. 统计单词数量
3. 检查单词数是否在 `[min_words, max_words)` 范围内
4. 将单词数写入 `output_key` 字段
5. 只保留符合范围的数据行

**应用场景**：
- 过滤过短或过长的文本
- 控制数据集文本长度分布
- 移除低质量的超短文本
- 过滤异常长度的文本

**注意事项**：
- 使用空格进行分词，不支持复杂的分词逻辑
- 范围是左闭右开 `[min_words, max_words)`
- `output_key` 字段存储的是实际单词数，不是布尔标签
- 默认 `min_words=20, max_words=100000`，可根据需求调整
