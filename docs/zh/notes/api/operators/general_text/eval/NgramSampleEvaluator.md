---
title: NgramSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/ngramsampleevaluator/
---

## 📘 概述

`NgramSampleEvaluator` 是一个用于评估文本冗余度的算子。它通过计算文本中 n-gram 的重复比例，来衡量文本的原创性和多样性。支持 **英文（按词分词）** 和 **中文（按字切分）** 两种模式。

**评分原理**: 通过比较唯一 n-gram 数量与总 n-gram 数量的比值来衡量文本原创性。得分越高（接近1.0）表示重复度越低，文本原创性越好。

## `__init__`函数

```python
def __init__(self, ngrams=5, language: str = 'en')
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **ngrams** | int | 5 | n-gram 的长度。 |
| **language** | str | 'en' | 处理语言；`'zh'` 为中文按“字”切分，其它值按空格进行英文分词。 |


## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='NgramScore')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估的文本字段。 |
| **output_key** | str | 'NgramScore' | 输出列名，对应生成的 n-gram 得分字段。 |

## 🧠 示例用法
```python
from dataflow.operators.general_text import NgramSampleEvaluator
from dataflow.utils.storage import FileStorage

class NgramSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/eval_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )

        # 英文模式（默认）
        self.evaluator_en = NgramSampleEvaluator(ngrams=5, language='en')
        # 中文模式
        self.evaluator_zh = NgramSampleEvaluator(ngrams=5, language='zh')

    def forward(self):
        # 英文样本
        self.evaluator_en.run(
            storage=self.storage.step(),
            input_key='text_en',
            output_key='NgramScore_en'
        )

        # 中文样本
        self.evaluator_zh.run(
            storage=self.storage.step(),
            input_key='text_zh',
            output_key='NgramScore_zh'
        )

if __name__ == "__main__":
    test = NgramSampleEvaluatorTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| [input_key] | str | 输入的原始文本。 |
| NgramScore | float | 计算出的 n-gram 得分（0到1之间，越高表示重复度越低，文本原创性越好）。 |

### 📋 示例输入
```json
{"id":1,"type":"zh_normal","text_zh":"人工智能在大模型领域的应用已经非常广泛，从文本生成到逻辑推理都有显著进步，未来可期。"}
{"id":2,"type":"zh_repeat_phrase","text_zh":"重要的事情说三遍：不要过拟合！不要过拟合！不要过拟合！这就叫重要的事情说三遍。"}
{"id":3,"type":"zh_garbage","text_zh":"哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"}

{"id":1,"type":"en_normal","text_en":"Natural language processing is a subfield of linguistics, computer science, and artificial intelligence."}
{"id":2,"type":"en_repeat_phrase","text_en":"The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat."}
{"id":3,"type":"en_garbage","text_en":"test test test test test test test test test test test test test test test test test test"}
```

### 📤 示例输出
```json
{"id":1,"type":"zh_normal","text_zh":"人工智能在大模型领域的应用已经非常广泛，从文本生成到逻辑推理都有显著进步，未来可期。","NgramScore_zh":1.0}
{"id":2,"type":"zh_repeat_phrase","text_zh":"重要的事情说三遍：不要过拟合！不要过拟合！不要过拟合！这就叫重要的事情说三遍。","NgramScore_zh":0.6666666667}
{"id":3,"type":"zh_garbage","text_zh":"哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈","NgramScore_zh":0.03125}

{"id":1,"type":"en_normal","text_en":"Natural language processing is a subfield of linguistics, computer science, and artificial intelligence.","NgramScore_en":1.0}
{"id":2,"type":"en_repeat_phrase","text_en":"The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat.","NgramScore_en":0.3}
{"id":3,"type":"en_garbage","text_en":"test test test test test test test test test test test test test test test test test test","NgramScore_en":0.0714285714}
```

**结果分析**: 
- **中文正常文本（zh_normal）**：`NgramScore_zh = 1.0`（完全无重复），句子内容丰富多样，5-gram 组合几乎都不同，冗余度最低。
- **中文重复短语（zh_repeat_phrase）**：`NgramScore_zh ≈ 0.67`，存在重复的句式“不要过拟合！不要过拟合！不要过拟合！”，部分 n-gram 重复，因此得分中等偏低。
- **中文垃圾文本（zh_garbage）**：`NgramScore_zh = 0.03125`，几乎所有 n-gram 都由重复的“哈”组成，唯一 n-gram 极少，冗余度极高。
- **英文正常文本（en_normal）**：`NgramScore_en = 1.0`，每个 5-gram 词序列几乎都是唯一的，说明文本信息丰富、无明显重复。
- **英文重复短语（en_repeat_phrase）**：`NgramScore_en = 0.3`，反复出现 “The cat sat on the mat.”，大量 n-gram 重复，得分显著降低。
- **英文垃圾文本（en_garbage）**：`NgramScore_en ≈ 0.071`，几乎只由重复的 `test` 构成，是高度模板化的垃圾文本。

评分越接近1.0表示文本重复度越低，原创性越好；接近0.0表示大量重复内容
