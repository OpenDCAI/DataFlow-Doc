---
title: NgramSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/ngramsampleevaluator/
---

## 📘 概述

`NgramSampleEvaluator` 是一个用于评估文本冗余度的算子。它通过计算文本中 n-gram 的重复比例，来衡量文本的原创性和多样性。

**评分原理**: 通过比较唯一 n-gram 数量与总 n-gram 数量的比值来衡量文本原创性。得分越高（接近1.0）表示重复度越低，文本原创性越好。

## `__init__`函数

```python
def __init__(self, ngrams=5)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **ngrams** | int | 5 | n-gram 的长度。 |


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
        
        self.evaluator = NgramSampleEvaluator(ngrams=5)
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='NgramScore'
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
{"text": "The quick brown fox jumps over the lazy dog. The sun is shining brightly in the clear blue sky. Birds are singing melodiously in the tall green trees. Children are playing happily in the beautiful park. Flowers are blooming magnificently everywhere you look. Nature displays its wonder through colorful butterflies dancing among fragrant roses. People enjoy peaceful walks along winding pathways surrounded by lush vegetation."}
{"text": "The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat."}
{"text": "In contemporary discourse surrounding technological advancement, one must acknowledge the multifaceted ramifications of artificial intelligence implementation. The epistemological considerations necessitate comprehensive analysis of socioeconomic implications. Furthermore, the paradigmatic shift toward automation requires meticulous examination of ethical frameworks governing algorithmic decision-making processes. Subsequently, organizational infrastructures must accommodate transformative methodologies while simultaneously addressing unprecedented complexities inherent within technological ecosystems."}
```

### 📤 示例输出
```json
{"text": "The quick brown fox...", "NgramScore": 1.0}
{"text": "The cat sat on the mat...", "NgramScore": 0.075}
{"text": "In contemporary discourse...", "NgramScore": 1.0}
```

**结果分析**: 
- **正常文本**：NgramScore=1.0（完全无重复），每个5-gram短语都是唯一的，文本原创性极高
- **重复文本**：NgramScore=0.075（严重重复），同一句话重复了14次，大量5-gram重复，原创性极低
- **学术文本**：NgramScore=1.0（完全无重复），使用丰富的学术词汇，无重复短语

评分越接近1.0表示文本重复度越低，原创性越好；接近0.0表示大量重复内容
