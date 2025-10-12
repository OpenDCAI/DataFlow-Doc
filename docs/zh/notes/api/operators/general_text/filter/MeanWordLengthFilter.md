---
title: MeanWordLengthFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/meanwordlengthfilter/
---

## 📘 概述

`MeanWordLengthFilter` 是一个文本过滤算子，用于根据文本中单词的平均长度来筛选数据。它通过计算文本中字符总数与单词数量的比值，并检查该平均值是否落在用户指定的最小和最大长度范围内。

## `__init__`函数

```python
def __init__(self, min_length: float=3, max_length: float=10)
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min_length** | float | 3 | 允许的最小平均单词长度。 |
| **max_length** | float | 10 | 允许的最大平均单词长度（不包含此值）。 |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='mean_word_length_filter_label')
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待过滤的文本字段。 |
| **output_key** | str | "mean_word_length_filter_label" | 输出列名，用于存储过滤结果标签（1表示通过）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import MeanWordLengthFilter
from dataflow.utils.storage import FileStorage

class MeanWordLengthFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/mean_word_length_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = MeanWordLengthFilter(
            min_length=3,
            max_length=10
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='mean_word_length_filter_label'
        )

if __name__ == "__main__":
    test = MeanWordLengthFilterTest()
    test.forward()
```

## 🧾 默认输出格式（Output Format）

算子执行后，会向原始数据中添加一个新的字段（默认为 `mean_word_length_filter_label`），其值为1，并仅保留通过筛选的数据行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| [output_key] | int | 过滤结果标签，值为1表示该行数据通过了筛选。 |

### 📋 示例输入

```json
{"text": "I am ok"}
{"text": "The quick brown fox jumps over the lazy dog"}
{"text": "Extraordinarily sophisticated"}
```

### 📤 示例输出

```json
{"text": "The quick brown fox jumps over the lazy dog", "mean_word_length_filter_label": 1}
```

### 📊 结果分析

**样本1（"I am ok"）**：
- 单词列表：["I", "am", "ok"]
- 单词数量：3
- 字符总数：1 + 2 + 2 = 5
- 平均单词长度：5 / 3 ≈ 1.67
- 阈值范围：[3, 10)
- **未通过过滤**（1.67 < 3）

**样本2（"The quick brown fox jumps over the lazy dog"）**：
- 单词列表：["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]
- 单词数量：9
- 字符总数：3 + 5 + 5 + 3 + 5 + 4 + 3 + 4 + 3 = 35
- 平均单词长度：35 / 9 ≈ 3.89
- 阈值范围：[3, 10)
- **通过过滤**（3 ≤ 3.89 < 10）

**样本3（"Extraordinarily sophisticated"）**：
- 单词列表：["Extraordinarily", "sophisticated"]
- 单词数量：2
- 字符总数：15 + 14 = 29
- 平均单词长度：29 / 2 = 14.5
- 阈值范围：[3, 10)
- **未通过过滤**（14.5 ≥ 10）

**应用场景**：
- 过滤平均单词过短的文本（可能是低质量或随意输入）
- 过滤平均单词过长的文本（可能包含大量专业术语或非自然语言）
- 数据集质量控制
- 自然语言文本筛选

**注意事项**：
- 使用空格 `split()` 分割单词
- 计算公式：平均长度 = 所有单词的字符总数 / 单词数量
- 范围为 `[min_length, max_length)`，包含 min_length，不包含 max_length
- 如果单词数量为 0，该样本会被过滤
- 不同语言的平均单词长度不同，需要根据具体场景调整阈值
