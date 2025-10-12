---
title: UniqueWordsFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/uniquewordsfilter/
---

## 📘 概述

`UniqueWordsFilter` 是一个文本过滤算子，用于根据文本中唯一单词的比率是否达到预设阈值来筛选数据。

## \_\_init\_\_函数

```python
def __init__(self, threshold: float=0.1)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :------------ | :---- | :------ | :--------------------------------------------------- |
| **threshold** | float | 0.1 | 唯一单词比率的阈值，低于该阈值的文本将被过滤掉。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='unique_words_filter')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :----------- | :---------------- | :------------------------ | :--------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检查的文本字段。 |
| **output_key** | str | 'unique_words_filter' | 输出列名，用于存储过滤结果的标志（值为1）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import UniqueWordsFilter
from dataflow.utils.storage import FileStorage

class UniqueWordsFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/unique_words_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = UniqueWordsFilter(
            threshold=0.1
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='unique_words_filter'
        )

if __name__ == "__main__":
    test = UniqueWordsFilterTest()
    test.forward()
```

## 🧾 默认输出格式（Output Format）

算子会返回一个被过滤后的 DataFrame，其中仅包含唯一单词比率大于 `threshold` 的行。DataFrame 中会新增一个 `output_key` 指定的列，其值恒为 1。

| 字段 | 类型 | 说明 |
| :---------------- | :---- | :----------------------------------------------- |
| `<input_key>` | str | 输入的原始文本字段（保留）。 |
| `<output_key>` | int | 过滤结果标志，输出的 DataFrame 中该字段值均为 1。 |

### 📋 示例输入

```json
{"text": "The quick brown fox jumps over the lazy dog"}
{"text": "good good good good good good good good"}
{"text": "This is a simple test with various different words"}
```

### 📤 示例输出

```json
{"text": "The quick brown fox jumps over the lazy dog", "unique_words_filter": 1}
{"text": "good good good good good good good good", "unique_words_filter": 1}
{"text": "This is a simple test with various different words", "unique_words_filter": 1}
```

### 📊 结果分析

**样本1（高唯一性文本）**：
- 总单词数：9
- 唯一单词数：8（"the" 出现2次）
- 唯一单词比率：8 / 9 ≈ 0.89 (89%)
- **通过过滤**（0.89 > 0.1 阈值）

**样本2（低唯一性文本）**：
- 总单词数：8
- 唯一单词数：1（只有 "good"）
- 唯一单词比率：1 / 8 = 0.125 (12.5%)
- **通过过滤**（0.125 > 0.1 阈值）

**样本3（完全唯一）**：
- 总单词数：9
- 唯一单词数：9（所有单词都不重复）
- 唯一单词比率：9 / 9 = 1.0 (100%)
- **通过过滤**（1.0 > 0.1 阈值）

**工作原理**：
1. 将文本转换为小写
2. 使用空格分割成单词列表
3. 使用集合（set）计算唯一单词数量
4. 计算唯一单词比率 = 唯一单词数 / 总单词数
5. 比率 > threshold 则保留

**应用场景**：
- 过滤重复内容过多的文本
- 检测机器生成的低质量文本
- 识别语言单调性问题
- 数据集多样性质量控制

**注意事项**：
- 大小写不敏感（转换为小写后比较）
- 使用空格分词
- `threshold` 越高，过滤越严格
- 默认 threshold=0.1，非常宽松，只过滤极端重复的文本
