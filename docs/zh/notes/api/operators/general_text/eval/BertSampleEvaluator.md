---
title: BertSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/bertsampleevaluator/
---

## 📘 概述
`BertSampleEvaluator` 是一个评估算子，用于使用 BERTScore 评估生成文本与参考文本之间的相似度。它基于上下文嵌入计算精确率（Precision）、召回率（Recall）和 F1 分数，从而提供对文本质量的量化评估。

## `__init__`函数
```python
def __init__(self, lang='en', model_cache_dir='./dataflow_cache')
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **lang** | str | 'en' | 指定要评估文本的语言，影响模型选择。 |
| **model_cache_dir** | str | './dataflow_cache' | 用于存储和加载预训练模型的本地缓存目录。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, reference_key: str, output_key: str='BertScore')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估的生成文本字段。 |
| **reference_key** | str | 必需 | 输入列名，对应用于比较的参考文本字段。 |
| **output_key** | str | 'BertScore' | 输出列名，对应生成的BERTScore F1分数字段。 |

## 🧠 示例用法
```python
from dataflow.operators.general_text import BertSampleEvaluator
from dataflow.utils.storage import FileStorage

class BertSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/gen_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = BertSampleEvaluator(
            lang='en',
            model_cache_dir='./dataflow_cache'
        )
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='input_key',
            input_reference_key='reference_key',
            output_key='BertScore'
        )

if __name__ == "__main__":
    test = BertSampleEvaluatorTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| input_key | str | 原始的生成文本 |
| reference_key | str | 原始的参考文本 |
| BertScore | float | BERTScore F1 分数（0-1之间，越高表示相似度越高） |

### 📋 示例输入
```json
{"input_key": "The quick brown fox jumps over the lazy dog.", "reference_key": "A fast brown fox leaps over a lazy dog."}
{"input_key": "She sells seashells by the seashore.", "reference_key": "She is selling shells by the beach."}
{"input_key": "To be or not to be, that is the question.", "reference_key": "The question is whether to be or not."}
{"input_key": "All that glitters is not gold.", "reference_key": "Not everything that shines is gold."}
{"input_key": "A picture is worth a thousand words.", "reference_key": "A single image can convey so much meaning."}
```

### 📤 示例输出
```json
{"input_key": "The quick brown fox jumps over the lazy dog.", "reference_key": "A fast brown fox leaps over a lazy dog.", "BertScore": 0.9599858522}
{"input_key": "She sells seashells by the seashore.", "reference_key": "She is selling shells by the beach.", "BertScore": 0.8968580365}
{"input_key": "To be or not to be, that is the question.", "reference_key": "The question is whether to be or not.", "BertScore": 0.8636844754}
{"input_key": "All that glitters is not gold.", "reference_key": "Not everything that shines is gold.", "BertScore": 0.9327103496}
{"input_key": "A picture is worth a thousand words.", "reference_key": "A single image can convey so much meaning.", "BertScore": 0.8256326318}
```
