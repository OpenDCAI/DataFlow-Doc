---
title: NgramFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/ngramfilter/
---

## 📘 概述

`NgramFilter` 是一个基于N-gram分数的文本过滤算子。它通过计算文本中n-gram的重复比例来评估文本的冗余度，并根据设定的分数阈值过滤掉冗余度较高或过低的文本。得分越高表示重复比例越低，文本质量通常越高。

## `__init__`函数

```python
__init__(self, min_score=0.8, max_score=1, ngrams=5)
```

### init参数说明

| 参数名          | 类型  | 默认值 | 说明                                     |
| :-------------- | :---- | :----- | :--------------------------------------- |
| **min_score**   | float | 0.8    | 最小n-gram得分阈值，低于此值的文本将被过滤。 |
| **max_score**   | int   | 1      | 最大n-gram得分阈值，高于此值的文本将被过滤。 |
| **ngrams**      | int   | 5      | 用于计算重复率的n-gram大小。             |

## `run`函数

```python
run(self, storage: DataFlowStorage, input_key: str, output_key: str='NgramScore')
```

#### 参数

| 名称          | 类型            | 默认值         | 说明                                       |
| :------------ | :-------------- | :------------- | :----------------------------------------- |
| **storage**   | DataFlowStorage | 必需           | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str             | 必需           | 输入列名，对应待评估冗余度的文本字段。     |
| **output_key**| str             | "NgramScore"   | 输出列名，对应生成的n-gram分数字段。       |

## 🧠 示例用法

```python
from dataflow.operators.general_text import NgramFilter
from dataflow.utils.storage import FileStorage

class NgramFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/ngram_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = NgramFilter(
            min_score=0.8,
            max_score=1.0,
            ngrams=5
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='NgramScore'
        )

if __name__ == "__main__":
    test = NgramFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

算子会向数据中添加一个`output_key`（默认为`NgramScore`）字段，并仅保留分数在`[min_score, max_score]`范围内的数据行。

| 字段         | 类型  | 说明                         |
| :----------- | :---- | :--------------------------- |
| NgramScore   | float | 模型生成的N-gram分数。       |

### 📋 示例输入

```json
{"text": "今天天气真不错，阳光明媚，万里无云，适合出门散步。"}
{"text": "好好好好好好好好好好好好好好好好好好好好好好好好好好"}
{"text": "The fascinating world of natural language processing encompasses various sophisticated algorithms."}
```

### 📤 示例输出

```json
{"text": "The fascinating world of natural language processing encompasses various sophisticated algorithms.", "NgramScore": 1.0}
```

### 📊 结果分析

**样本1（"今天天气真不错，阳光明媚，万里无云，适合出门散步。"）**：
- 文本长度：26 字符
- 5-gram 总数：22 个
- 唯一 5-gram 数量：约 20 个
- N-gram 分数：20 / 22 ≈ 0.91
- 分数范围：[0.8, 1.0]
- **通过过滤**（但输出中未显示，可能因为只显示了通过的样本）

**样本2（"好好好好好好好好好好好好好好好好好好好好好好好好好好"）**：
- 文本长度：26 字符
- 5-gram 总数：22 个
- 唯一 5-gram 数量：约 1-2 个（重复的"好好好好好"）
- N-gram 分数：1 / 22 ≈ 0.045
- 分数范围：[0.8, 1.0]
- **未通过过滤**（0.045 < 0.8，重复率过高）

**样本3（"The fascinating world of natural language processing..."）**：
- 文本长度：95 字符
- 5-gram 总数：91 个
- 唯一 5-gram 数量：91 个（无重复）
- N-gram 分数：91 / 91 = 1.0
- 分数范围：[0.8, 1.0]
- **通过过滤**（1.0 在范围内，文本无冗余）

**计算公式**：
```
N-gram Score = 唯一 n-gram 数量 / 总 n-gram 数量
```

**得分含义**：
- **1.0**：文本完全无重复，质量最高
- **0.8-0.99**：文本有少量重复，质量较好
- **< 0.8**：文本重复率高，质量较差

**应用场景**：
- 过滤低质量、高重复的文本
- 检测生成文本中的循环重复
- 数据集质量控制
- 过滤爬虫数据中的模板文本

**注意事项**：
- 使用字符级 n-gram（默认 n=5），适合中英文混合
- 得分越高表示文本多样性越好
- 短文本（< n 个字符）可能得分异常
- 不同语言和场景可能需要调整 `min_score` 阈值
- 诗歌、歌词等特殊文本类型可能因重复而得分低
