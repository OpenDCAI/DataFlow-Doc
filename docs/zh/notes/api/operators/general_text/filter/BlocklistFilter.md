---
title: BlocklistFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/blocklistfilter/
---

## 📘 概述

`BlocklistFilter` 是一个文本过滤算子，它使用特定语言的阻止列表（blocklist）来筛选文本数据。它可以根据文本中包含的阻止列表关键词数量来决定是否保留该条数据，并支持使用分词器进行更精确的单词匹配。

## __init__函数

```python
def __init__(self, language:str = 'en', threshold:int = 1, use_tokenizer:bool = False)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **language** | str | 'en' | 指定阻止列表的语言代码（如'en'、'zh'等）。系统会加载对应语言的阻止列表文件。 |
| **threshold** | int | 1 | 文本中允许存在的阻止列表关键词的最大数量阈值。超过此阈值的文本将被过滤。 |
| **use_tokenizer** | bool | False | 是否使用NLTK分词器进行单词级匹配。如果为False，则使用简单的空格分割。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'blocklist_filter_label')
```

执行算子主逻辑，从存储中读取输入 DataFrame，根据阻止列表进行过滤，并将过滤后的结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待过滤的文本字段。 |
| **output_key** | str | "blocklist_filter_label" | 输出列名，用于存放过滤标签结果（1表示通过，0表示未通过）。 |

## 📦 NLTK 数据配置

该算子在使用分词器时依赖 NLTK 的 `punkt` 分词器。

**推荐方式：使用预下载的数据（避免网络问题）**

1. 从 [https://github.com/nltk/nltk_data](https://github.com/nltk/nltk_data) 下载所需数据包：
   - `punkt/`

2. 设置环境变量指向数据路径：
   ```bash
   export NLTK_DATA=/path/to/nltk_data
   ```

**自动下载方式：**

首次使用时，算子会自动检测并下载所需数据。如果遇到网络问题导致下载卡住，建议使用上述手动下载方式。

## 🧠 示例用法

```python
from dataflow.operators.general_text import BlocklistFilter
from dataflow.utils.storage import FileStorage

class BlocklistFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/blocklist_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = BlocklistFilter(
            language='en',
            threshold=1,
            use_tokenizer=False
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='blocklist_filter_label'
        )

if __name__ == "__main__":
    test = BlocklistFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| text | str | 原始输入文本 |
| blocklist_filter_label | int | 过滤标签。值为 1 表示该行数据通过了阻止列表过滤（阻止词数量≤阈值）。输出的数据帧中仅包含此列值为 1 的行。 |

### 📋 示例输入

```json
{"text": "This is a normal and clean text without any problematic words."}
{"text": "This text contains some bad words that should be filtered."}
{"text": "Just a regular sentence about technology and science."}
```

### 📤 示例输出

```json
{"text": "This is a normal and clean text without any problematic words.", "blocklist_filter_label": 1}
{"text": "This text contains some bad words that should be filtered.", "blocklist_filter_label": 1}
{"text": "Just a regular sentence about technology and science.", "blocklist_filter_label": 1}
```

### 📊 结果分析

在本测试中，所有3条文本都通过了过滤（blocklist_filter_label=1），这是因为：
- 系统加载了英文阻止列表（403个敏感词）
- 设置的阈值为1，表示允许最多1个阻止列表词汇
- 测试文本中的"bad"等词语不在阻止列表中
- 所有文本的阻止词计数都≤1

**应用场景**：
- 过滤包含敏感词、脏话、冒犯性内容的文本
- 内容审核和合规性检查
- 保护社区环境，维护内容质量
- 多语言支持，可加载不同语言的阻止列表

**注意事项**：
- 阻止列表文件位于 `dataflow/operators/general_text/filter/blocklist/{language}.txt`
- 可根据需要自定义添加或修改阻止列表内容
- 使用`use_tokenizer=True`可以提供更精确的单词级匹配，避免误判
