---
title: CapitalWordsFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/capitalwordsfilter/
---

## 📘 概述
`CapitalWordsFilter` 是一个数据过滤算子，用于检查文本中大写单词的比例是否超过预设阈值。如果超过阈值，则该条数据被过滤掉。该算子支持使用分词器来更精确地识别单词。

## `__init__`函数
```python
def __init__(self, threshold: float=0.2, use_tokenizer: bool=False)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :-- | :-- | :--- |
| **threshold** | float | 0.2 | 大写单词的比例阈值（0-1之间）。超过此值的数据行将被过滤。 |
| **use_tokenizer** | bool | False | 是否使用NLTK分词器来切分单词。如果为 `False`，则使用空格进行切分。 |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='capital_words_filter')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检查的文本字段。 |
| **output_key** | str | 'capital_words_filter' | 输出列名，用于存储过滤结果的标志（1表示通过，0表示未通过）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import CapitalWordsFilter
from dataflow.utils.storage import FileStorage

class CapitalWordsFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/capital_words_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = CapitalWordsFilter(
            threshold=0.2,
            use_tokenizer=False
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='capital_words_filter'
        )

if __name__ == "__main__":
    test = CapitalWordsFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 原始输入文本 |
| capital_words_filter | int | 过滤标志（1表示通过，0表示未通过） |

### 📋 示例输入

```json
{"text": "This is a normal sentence with proper capitalization."}
{"text": "THIS IS ALL CAPS AND SHOULD BE FILTERED OUT"}
{"text": "MOST WORDS ARE CAPS BUT not all"}
{"text": "only lowercase text here"}
{"text": "Mix Of NORMAL and UPPERCASE Words"}
```

### 📤 示例输出

```json
{"text": "This is a normal sentence with proper capitalization.", "capital_words_filter": 1}
{"text": "only lowercase text here", "capital_words_filter": 1}
```

### 📊 结果分析

**样本1（正常大写）**：
- 大写单词："This"（句首大写，不算全大写单词）
- 全大写单词比例：0/8 = 0.0 (0%)
- **通过过滤**（≤ 0.2阈值）

**样本2（全大写）**：
- 所有单词都是全大写："THIS", "IS", "ALL", "CAPS", "AND", "SHOULD", "BE", "FILTERED", "OUT"
- 全大写单词比例：9/9 = 1.0 (100%)
- **未通过过滤**（> 0.2阈值）

**样本3（大部分大写）**：
- 全大写单词："MOST", "WORDS", "ARE", "CAPS", "BUT"
- 全大写单词比例：5/7 ≈ 0.71 (71%)
- **未通过过滤**（> 0.2阈值）

**样本4（全小写）**：
- 没有全大写单词
- 全大写单词比例：0/4 = 0.0 (0%)
- **通过过滤**（≤ 0.2阈值）

**样本5（混合大写）**：
- 全大写单词："Of", "NORMAL", "UPPERCASE", "Words"（需要注意：只有完全大写的才算）
- 全大写单词比例：2/6 ≈ 0.33 (33%)
- **未通过过滤**（> 0.2阈值）

**应用场景**：
- 过滤垃圾广告文本（常使用大量大写字母吸引注意）
- 清理质量不佳的标题或评论
- 识别和过滤"喊叫式"文本
- 提高数据集的文本质量

**注意事项**：
- 算子通过`str.isupper()`方法判断单词是否为全大写
- 单个字母的大写单词也会被计入
- 建议根据具体应用场景调整阈值
