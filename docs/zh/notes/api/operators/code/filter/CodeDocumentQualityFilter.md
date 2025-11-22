---
title: CodeDocumentQualityFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/filter/codedocumentqualityfilter/
---

## 📘 概述 [CodeDocumentQualityFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
`CodeDocumentQualityFilter` 算子基于 `CodeDocumentQualitySampleEvaluator` 的评估得分，应用综合性的文档级质量过滤规则，以移除低质量的代码和文本样本。

## `__init__`函数
```python
def __init__(self, min_score: float = 1.0, max_score: float = 1.0, thresholds: Dict[str, Any] = None):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 1.0 | 最小文档质量得分阈值。 |
| **max_score** | float | 1.0 | 最大文档质量得分阈值。 |
| **thresholds** | Dict[str, Any] | None | 可选的阈值字典，用于覆盖默认阈值。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |


## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = "doc_quality_filter_label"):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，指定待过滤的文本内容所在的列。 |
| **output_key** | str | "doc_quality_filter_label" | 输出列名，用于存放过滤结果标签。 |

## 🧠 示例用法
```python

```
