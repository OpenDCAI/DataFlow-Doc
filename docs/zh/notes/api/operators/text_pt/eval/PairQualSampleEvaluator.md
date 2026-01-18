---
title: PairQualSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/eval/pairqualsampleevaluator/
---

## 📘 概述
[PairQualSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluators/sample_quality/pair_qual_sample_evaluator.py) 是一个基于BGE模型和GPT成对比较数据训练的文本质量评分器，支持中英文输入。通过对文本进行单样本评估，返回0-1之间的质量分数，分数越高表示文本质量越好。模型分为英文版本(zks2856/PairQual-Scorer-en)和中文版本(zks2856/PairQual-Scorer-zh)。

## `__init__`函数
```python
def __init__(self, model_cache_dir:str='./dataflow_cache', device="cuda", lang='en', max_length=512)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :-- | :--- | :--- |
| **model_cache_dir** | str | './dataflow_cache' | 模型缓存目录。 |
| **device** | str | "cuda" | 指定运行设备，如 "cuda" 或 "cpu"。 |
| **lang** | str | 'en' | 语言类型，支持 'en' (英文) 或 'zh' (中文)。 |
| **max_length** | int | 512 | 输入文本的最大长度。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='PairQualScore')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估的文本字段。 |
| **output_key** | str | 'PairQualScore' | 输出列名，对应生成的质量分数字段。 |

## 🧠 示例用法
```python
from dataflow.operators.text_pt.eval import PairQualSampleEvaluator
from dataflow.utils.storage import FileStorage

# 准备数据和存储
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# 初始化并运行算子
pairqual_evaluator = PairQualSampleEvaluator(lang='en')
pairqual_evaluator.run(
    storage.step(),
    input_key='raw_content',
    output_key='PairQualScore'
)
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :-- | :--- |
| **[input_key]** | str | 输入的待评估文本。 |
| **[output_key]** | float | 模型生成的0-1之间的质量分数。 |

示例输入：
```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios..."
}
```
示例输出：
```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios...",
  "PairQualScore": 3.2509903908
}
```
