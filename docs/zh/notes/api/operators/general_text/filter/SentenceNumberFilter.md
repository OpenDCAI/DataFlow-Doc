---
title: SentenceNumberFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/sentencenumberfilter/
---

## 📘 概述

`SentenceNumberFilter` 是一个文本过滤算子，用于检查输入文本中的句子数量是否在指定的最小和最大值范围内。它通过正则表达式统计句子数量，并只保留符合条件的文本行。

## __init__函数
```python
def __init__(self, min_sentences: int=3, max_sentences: int=7500)
```
### init参数说明
| 参数名              | 类型 | 默认值 | 说明                       |
| :------------------ | :--- | :------- | :------------------------- |
| **min_sentences**   | int  | 3        | 文本应包含的最小句子数量。 |
| **max_sentences**   | int  | 7500     | 文本应包含的最大句子数量。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'sentence_number_filter_label')
```
#### 参数
| 名称          | 类型              | 默认值                           | 说明                                   |
| :------------ | :---------------- | :------------------------------- | :------------------------------------- |
| **storage**   | DataFlowStorage   | 必需                             | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | str               | 必需                             | 输入列名，对应待过滤的文本字段。       |
| **output_key**| str               | 'sentence_number_filter_label'   | 输出列名，用于存储过滤结果的标签。     |

## 🧠 示例用法

```python
from dataflow.operators.general_text import SentenceNumberFilter
from dataflow.utils.storage import FileStorage

class SentenceNumberFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/sentence_number_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = SentenceNumberFilter(
            min_sentences=3,
            max_sentences=7500
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='sentence_number_filter_label'
        )

if __name__ == "__main__":
    test = SentenceNumberFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

算子执行后，会向原始数据中添加一个新的字段（默认为 `sentence_number_filter_label`），其值为1，并仅保留通过筛选的数据行。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| sentence_number_filter_label | int | 过滤结果标签，值为1表示该行数据通过了筛选。 |

### 📋 示例输入

```json
{"text": "Hi"}
{"text": "Hello world. This is a test. It has three sentences."}
{"text": "First sentence. Second sentence. Third sentence. Fourth sentence. Fifth sentence. Sixth sentence."}
```

### 📤 示例输出

```json
{"text": "Hello world. This is a test. It has three sentences.", "sentence_number_filter_label": 1}
{"text": "First sentence. Second sentence. Third sentence. Fourth sentence. Fifth sentence. Sixth sentence.", "sentence_number_filter_label": 1}
```

### 📊 结果分析

**样本1（"Hi"）**：
- 匹配句子数：1
- 句子数范围：[3, 7500]
- **未通过过滤**（1 < 3）

**样本2（"Hello world. This is a test. It has three sentences."）**：
- 匹配句子数：约 3-4（使用正则 `\b[^.!?\n]+[.!?]*` 匹配）
- 句子数范围：[3, 7500]
- **通过过滤**（在范围内）

**样本3（6个完整句子）**：
- 匹配句子数：6
- 句子数范围：[3, 7500]
- **通过过滤**（在范围内）

**应用场景**：
- 过滤过短的文本片段
- 过滤超长文档
- 数据集质量控制
- 确保文本有足够的内容深度

**注意事项**：
- 使用正则表达式 `\b[^.!?\n]+[.!?]*` 匹配句子
- 支持中英文句子结束符号（。！？.!?）
- 空文本会被过滤
- 不同语言的句子划分规则可能不同
