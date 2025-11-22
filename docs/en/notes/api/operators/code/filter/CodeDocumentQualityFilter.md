---
title: CodeDocumentQualityFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/filter/codedocumentqualityfilter/
---

## 📘 Overview [CodeDocumentQualityFilter]
CodeDocumentQualityFilter applies comprehensive document-level quality filtering rules using CodeDocumentQualitySampleEvaluator scores to remove low-quality code and text samples.

## __init__
```python
def __init__(self, min_score: float = 1.0, max_score: float = 1.0, thresholds: Dict[str, Any] = None):
```
### init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 1.0 | Minimum document quality score threshold. |
| **max_score** | float | 1.0 | Maximum document quality score threshold. |
| **thresholds** | Dict[str, Any] | None | Optional thresholds dictionary to override default thresholds. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = "doc_quality_filter_label"):
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlowStorage instance, responsible for reading and writing data. |
| **input_key** | str | Required | Input field name (requires 'text', 'filename', 'language' columns). |
| **output_key** | str | "doc_quality_filter_label" | Output label field name. |

## 🧠 Example Usage
```python

```
