---
title: BleuSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/bleusampleevaluator/
---

## 📘 概述

[BleuSampleEvaluator]() 是一个用于评估文本质量的算子。它通过计算生成文本与参考文本之间的BLEU（Bilingual Evaluation Understudy）分数来衡量二者的相似度。BLEU分数主要通过分析n-gram（连续n个词的序列）的重叠度来评估翻译或文本生成的准确性和流畅性。

## `__init__`函数

```python
def __init__(self, n=4, eff="average", special_reflen=None)
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :-- | :--- | :--- |
| **n** | int | 4 | 用于计算BLEU分数的最大n-gram长度。 |
| **eff** | str | "average" | 参考文本长度的计算方式。可选值为 "shortest"、"average" 或 "longest"。 |
| **special_reflen** | int | None | 如果指定，将使用该值作为特殊的参考文本长度，而不是根据实际参考文本计算。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, reference_key: str, output_key: str='BleuScore')
```

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要评估的生成文本字段。 |
| **reference_key** | str | 必需 | 参考列名，对应标准的参考文本字段。 |
| **output_key** | str | "BleuScore" | 输出列名，用于存储计算出的BLEU分数。 |

## 🧠 示例用法
```python
from dataflow.operators.general_text import BleuSampleEvaluator
from dataflow.utils.storage import FileStorage

class BleuSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/gen_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = BleuSampleEvaluator(
            n=4,
            eff="average"
        )
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='input_key',
            input_reference_key='reference_key',
            output_key='BleuScore'
        )

if __name__ == "__main__":
    test = BleuSampleEvaluatorTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :-- | :--- |
| input_key | str | 原始的生成文本 |
| reference_key | str | 原始的参考文本 |
| BleuScore | float | BLEU分数（0-1之间，越高表示n-gram重叠度越高） |

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
{"input_key": "The quick brown fox jumps over the lazy dog.", "reference_key": "A fast brown fox leaps over a lazy dog.", "BleuScore": 0.5555555554}
{"input_key": "She sells seashells by the seashore.", "reference_key": "She is selling shells by the beach.", "BleuScore": 0.4232408623}
{"input_key": "To be or not to be, that is the question.", "reference_key": "The question is whether to be or not.", "BleuScore": 0.4}
{"input_key": "All that glitters is not gold.", "reference_key": "Not everything that shines is gold.", "BleuScore": 0.4999999998}
{"input_key": "A picture is worth a thousand words.", "reference_key": "A single image can convey so much meaning.", "BleuScore": 0.1238396999}
```

### 📊 结果分析

**样本1**：
- BleuScore: 0.556（中等）
- n-gram 重叠较多（brown, fox, over, lazy, dog），但词序和用词有差异

**样本2**：
- BleuScore: 0.423（中等）
- 部分词汇重叠（sells/selling, shells, by），但整体结构变化较大

**样本3**：
- BleuScore: 0.400（中等）
- 关键词"be"和"question"重复，但句式重组明显

**样本4**：
- BleuScore: 0.500（中等）
- 保留了核心概念词但表达方式完全不同

**样本5**：
- BleuScore: 0.124（低）
- 几乎没有相同的词汇，尽管语义相同，展示了 BLEU 对词汇匹配的依赖性

**应用场景**：
- 机器翻译质量评估
- 文本生成的字面相似度评估
- 需要精确词汇匹配的场景
