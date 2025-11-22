---
title: SymbolWordRatioFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/symbolwordratiofilter/
---

## 📘 概述
`SymbolWordRatioFilter` 是一个数据过滤算子，用于检查文本中特定符号（如 "#", "...", "…"）与单词总数的比率。如果该比率超过预设的阈值，则该文本行将被过滤掉。这有助于清理数据集中符号滥用或格式异常的条目。

## __init__函数
```python
def __init__(self, threshold: float=0.4)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.4 | 符号与单词数量比率的阈值。超过此阈值的文本将被过滤。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='symbol_word_ratio_filter_label')
```
执行算子主逻辑，从存储中读取输入 DataFrame，根据符号与单词的比率进行过滤，并将过滤后的结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检查的文本字段。 |
| **output_key** | str | "symbol_word_ratio_filter_label" | 输出列名，用于存储过滤结果的标签（1表示通过，0表示未通过）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import SymbolWordRatioFilter
from dataflow.utils.storage import FileStorage

class SymbolWordRatioFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/symbol_word_ratio_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = SymbolWordRatioFilter(
            threshold=0.4
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='symbol_word_ratio_filter_label'
        )

if __name__ == "__main__":
    test = SymbolWordRatioFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
算子会向 DataFrame 中添加一个 `output_key` 指定的列，并根据该列的值进行过滤。最终输出的 DataFrame 只包含通过筛选的行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| [input_key] | str | 原始输入的文本字段。 |
| [output_key] | int | 过滤标签，值为1，表示该行文本通过了符号与单词比率的检查。 |

### 📋 示例输入

```json
{"text": "This is a normal sentence without symbols."}
{"text": "This # text # has # too # many # hashtags # everywhere #"}
{"text": "Some text with ... and ... more ... dots..."}
```

### 📤 示例输出

```json
{"text": "This is a normal sentence without symbols.", "symbol_word_ratio_filter_label": 1}
```

### 📊 结果分析

**样本1（正常文本）**：
- 单词数：7
- 符号数：0（无 #, ..., … 符号）
- 符号与单词比率：0 / 7 = 0.0
- **通过过滤**（0.0 < 0.4 阈值）

**样本2（过多hashtag符号）**：
- 单词数：9
- 符号数：8 个 # 符号
- 符号与单词比率：8 / 9 ≈ 0.89
- **未通过过滤**（0.89 > 0.4 阈值）

**样本3（过多省略号）**：
- 单词数：7
- 符号数：4 个 "..." 符号（包括 "dots..." 末尾的）
- 符号与单词比率：4 / 7 ≈ 0.57
- **未通过过滤**（0.57 > 0.4 阈值）

**检测的符号类型**：
- `#` - hashtag符号
- `...` - 省略号（三个点）
- `…` - Unicode省略号

**应用场景**：
- 过滤社交媒体风格的文本（过多hashtag）
- 清理格式异常的文本
- 移除符号滥用的低质量内容
- 数据集质量控制

**注意事项**：
- 符号计数是精确匹配，不会部分匹配
- 使用 NLTK 的 `WordPunctTokenizer` 进行分词
- `threshold` 越小，过滤越严格
