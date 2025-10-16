---
title: RemoveStopwordsRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removestopwordsrefiner/
---

好的，这是根据您提供的代码和模板生成的 `RemoveStopwordsRefiner` 算子的中文教程 Markdown。

## 📘 概述

[RemoveStopwordsRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refiners/remove_stopwords_refiner.py) 是一个文本优化算子，用于移除输入文本中的英语停用词（如 "the", "is", "in" 等无实际意义的高频词汇）。该算子利用 NLTK 库的停用词语料库，对指定字段的文本进行过滤，旨在提高文本的特征密度，为后续的自然语言处理任务做准备。

## `__init__`函数

```python
def __init__(self, model_cache_dir: str = './dataflow_cache')
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **model_cache_dir** | str | './dataflow_cache' | 用于存储 NLTK 停用词数据的缓存目录路径。 |

### Prompt模板说明



## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列的名称，该列包含需要移除停用词的文本。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import RemoveStopwordsRefiner
from dataflow.utils.storage import FileStorage

class RemoveStopwordsRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_stopwords_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveStopwordsRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveStopwordsRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 移除停用词后的文本 |

### 📋 示例输入

```json
{"text":"This is a simple test"}
{"text":"The quick brown fox jumps"}
{"text":"I am going to the store"}
```

### 📤 示例输出

```json
{"text":"simple test"}
{"text":"quick brown fox jumps"}
{"text":"going store"}
```

### 📊 结果分析

**样本1**：移除 "This" "is" "a"
**样本2**：移除 "The"
**样本3**：移除 "I" "am" "to" "the"

**应用场景**：
- NLP 文本预处理
- 关键词提取
- 文本分类前的特征提取

**注意事项**：
- 使用 NLTK 英文停用词列表
- 仅适用于英文文本
```
