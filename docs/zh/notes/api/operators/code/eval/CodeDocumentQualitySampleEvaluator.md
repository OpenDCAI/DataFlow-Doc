---
title: CodeDocumentQualitySampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/eval/codedocumentqualitysampleevaluator/
---

## 📘 概述 [CodeDocumentQualitySampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
`CodeDocumentQualitySampleEvaluator` 是一个代码文档质量评估算子，它基于综合的文档级质量指标（如内容长度、重复模式、字符组成和文本熵值）来评估代码样本，并为过滤低质量内容提供分数。

**评估指标：**
- `CodeDocumentQualityCharCount`: 字符数
- `CodeDocumentQualityWordCount`: 词数
- `CodeDocumentQualityDuplicateLinesRatio`: 重复行比例
- `CodeDocumentQualityDuplicateNgramRatio`: n-gram重复比例
- `CodeDocumentQualityCurlyBracketRatio`: 花括号比例
- `CodeDocumentQualityAllCapsRatio`: 全大写单词比例
- `CodeDocumentQualityEntropy`: 单字符熵值
- `CodeDocumentQualityScore`: 综合文档质量得分 (0-1，1表示通过所有质量检查)

## __init__函数
```python
def __init__(self, thresholds: Dict[str, Any] = None):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **thresholds** | `Dict[str, Any]` | `None` | 用于覆盖默认质量指标阈值的可选字典。 |

### Prompt模板说明

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | `DataFlowStorage` | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | `str` | 必需 | 输入列名，对应需要评估的代码样本字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| (原始输入列) | - | 保留输入的所有原始列。 |
| `CodeDocumentQualityCharCount` | int | 样本中的总字符数。 |
| `CodeDocumentQualityWordCount` | int | 样本中的总词数。 |
| `CodeDocumentQualityDuplicateLinesRatio`| float | 重复行的比例。 |
| `CodeDocumentQualityDuplicate<N>gramRatio`| float | 重复 N-gram 的比例 (N从2到10)。 |
| `CodeDocumentQualityCurlyBracketRatio`| float | 花括号字符在总字符中的比例。 |
| `CodeDocumentQualityAllCapsRatio` | float | 全大写单词在总词数中的比例。 |
| `CodeDocumentQualityEntropy` | float | 基于单字符的文本熵值。 |
| `CodeDocumentQualityScore` | float | 综合文档质量得分（0或1），1表示通过所有质量检查。 |
