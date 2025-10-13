---
title: LexicalDiversitySampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/lexicaldiversitysampleevaluator/
---

## 📘 概述 [LexicalDiversitySampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)

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


#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| {input_key} | str | 输入的原始文本。 |
| LexicalDiversityMTLDScore | float | MTLD多样性得分（值越高表示多样性越好）。 |
| LexicalDiversityHD-DScore | float | HDD多样性得分（值越高表示多样性越好）。 |
