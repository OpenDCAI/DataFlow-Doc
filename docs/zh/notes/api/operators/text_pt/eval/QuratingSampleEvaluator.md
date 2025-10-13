---
title: QuratingSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/eval/quratingsampleevaluator/
---

## 📘 概述

[QuratingSampleEvaluator] 是一个文本质量评估算子，它利用 `princeton-nlp/QuRater-1.3B` 模型从多个维度对输入文本进行打分。该算子可以评估文本的写作风格、专业知识要求、事实性与趣味性以及教育价值，为每个维度生成一个 0 到 1 之间的分数，从而提供对文本质量的全面量化评估。

## __init__函数

```python
def __init__(self, map_batch_size: int = 512, num_workers: int = 1, device_batch_size: int = 16, device: str = 'cuda', 
             labels: list = ['writing_style', 'required_expertise', 'facts_and_trivia', 'educational_value'], model_cache_dir: str = './dataflow_cache'):
```

### init参数说明

| 参数名              | 类型 | 默认值                                                                                             | 说明                                     |
| :------------------ | :--- | :------------------------------------------------------------------------------------------------- | :--------------------------------------- |
| **map_batch_size**  | int  | 512                                                                                                | 数据预处理（如分词）时的批处理大小。     |
| **num_workers**     | int  | 1                                                                                                  | 用于数据加载和预处理的并行工作进程数。   |
| **device_batch_size** | int  | 16                                                                                                 | 在指定设备上进行模型推理时的批处理大小。 |
| **device**          | str  | 'cuda'                                                                                             | 模型推理所使用的设备，如 'cuda' 或 'cpu'。 |
| **labels**          | list | `['writing_style', 'required_expertise', 'facts_and_trivia', 'educational_value']` | 指定要评估的文本质量维度列表。           |
| **model_cache_dir** | str  | './dataflow_cache'                                                                                 | 用于存储和缓存下载的模型的目录路径。     |

### Prompt模板说明

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str):
```

#### 参数

| 名称          | 类型            | 默认值 | 说明                                                         |
| :------------ | :-------------- | :----- | :----------------------------------------------------------- |
| **storage**   | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。                         |
| **input_key** | str             | 必需   | 输入列名，对应待评估文本的字段。                             |
| **output_key**| str             | 必需   | 输出列名的基键，当前算子中未使用，但为保持接口一致性而保留。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）

算子会向输入数据中添加多个新的评分列，每个列对应一个评估维度。

| 字段                             | 类型  | 说明                         |
| :------------------------------- | :---- | :--------------------------- |
| {input_key}                      | str   | 输入的待评估文本。           |
| QuratingWritingStyleScore        | float | 写作风格维度的评分（0-1）。   |
| QuratingRequiredExpertiseScore   | float | 所需专业知识维度的评分（0-1）。 |
| QuratingFactsAndTriviaScore      | float | 事实与趣闻维度的评分（0-1）。   |
| QuratingEducationalValueScore    | float | 教育价值维度的评分（0-1）。   |

**示例输入：**
（假设 `input_key` 为 "text"）

```json
{
"text":"The Pythagorean theorem is a fundamental relation in Euclidean geometry among the three sides of a right triangle. It states that the square of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the other two sides."
}
```

**示例输出：**

```json
{
"text":"The Pythagorean theorem is a fundamental relation in Euclidean geometry among the three sides of a right triangle. It states that the square of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the other two sides.",
"QuratingWritingStyleScore": 0.85,
"QuratingRequiredExpertiseScore": 0.65,
"QuratingFactsAndTriviaScore": 0.90,
"QuratingEducationalValueScore": 0.95
}
```
