---
title: LexicalDiversitySampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/lexicaldiversitysampleevaluator/
---

## 📘 概述

`LexicalDiversitySampleEvaluator` 是一个用于评估文本词汇多样性的算子。它采用MTLD（词汇多样性测量）和HDD（移动平均类型-标记比）两种方法来计算文本的词汇丰富度。

**功能说明：**
- **MTLD（词汇多样性测量）**：通过计算维持特定TTR（类型-标记比）阈值所需的单词数量来评估词汇多样性。
- **HDD（移动平均类型-标记比）**：一种基于样本的词汇丰富度估计方法。

**输入要求：** 文本长度需大于50个单词。

**输出参数：**
- **LexicalDiversityMTLDScore**: MTLD多样性得分（值越高表示多样性越好）。
- **LexicalDiversityHD-DScore**: HDD多样性得分（值越高表示多样性越好）。

## __init__函数
```python
def __init__(self)
```
### init参数说明
该算子在初始化时无需传入任何参数。

### Prompt模板说明

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
执行算子主逻辑，从存储中读取输入 DataFrame，计算文本的词汇多样性分数，并将结果添加为新列后写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要评估词汇多样性的文本字段。 |

## 🧠 示例用法
```python
from dataflow.operators.general_text import LexicalDiversitySampleEvaluator
from dataflow.utils.storage import FileStorage

class LexicalDiversitySampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/eval_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = LexicalDiversitySampleEvaluator()
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = LexicalDiversitySampleEvaluatorTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| {input_key} | str | 输入的原始文本。 |
| LexicalDiversityMTLDScore | float | MTLD多样性得分（值越高表示多样性越好）。文本长度需大于50词。 |
| LexicalDiversityHD-DScore | float | HDD多样性得分（值越高表示多样性越好）。文本长度需在50-1000词之间。 |

### 📋 示例输入
```json
{"text": "The quick brown fox jumps over the lazy dog. The sun is shining brightly in the clear blue sky. Birds are singing melodiously in the tall green trees. Children are playing happily in the beautiful park. Flowers are blooming magnificently everywhere you look. Nature displays its wonder through colorful butterflies dancing among fragrant roses. People enjoy peaceful walks along winding pathways surrounded by lush vegetation."}
{"text": "The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat."}
{"text": "In contemporary discourse surrounding technological advancement, one must acknowledge the multifaceted ramifications of artificial intelligence implementation. The epistemological considerations necessitate comprehensive analysis of socioeconomic implications. Furthermore, the paradigmatic shift toward automation requires meticulous examination of ethical frameworks governing algorithmic decision-making processes. Subsequently, organizational infrastructures must accommodate transformative methodologies while simultaneously addressing unprecedented complexities inherent within technological ecosystems."}
```

### 📤 示例输出
```json
{"text": "The quick brown fox...", "LexicalDiversityMTLDScore": 131.4444444444, "LexicalDiversityHD-DScore": 0.8848533802}
{"text": "The cat sat on the mat...", "LexicalDiversityMTLDScore": 6.4615384615, "LexicalDiversityHD-DScore": 0.1190460328}
{"text": "In contemporary discourse...", "LexicalDiversityMTLDScore": 151.62, "LexicalDiversityHD-DScore": 0.9159261791}
```

**结果分析**: 
- **正常文本**：MTLD=131.44（高多样性），HDD=0.88（词汇丰富）
- **重复文本**：MTLD=6.46（极低多样性），HDD=0.12（词汇贫乏）- 因为大量重复相同的词
- **学术文本**：MTLD=151.62（极高多样性），HDD=0.92（词汇极其丰富）- 使用了大量不同的学术词汇
