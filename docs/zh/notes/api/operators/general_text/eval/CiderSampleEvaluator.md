---
title: CiderSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/cidersampleevaluator/
---

## 📘 概述
`CiderSampleEvaluator` 是一个评估算子，它使用 CIDEr (Consensus-based Image Description Evaluation) 指标来衡量生成文本与参考文本之间的相似度。该算子主要基于 TF-IDF 加权的 n-gram 重叠度来计算得分，常用于图像描述生成等任务的评估。

## __init__函数
```python
def __init__(self, n=4, sigma=6.0, df_mode="coco-val-df", idf_path="./dataflow/operators/general_pt/eval/cider/coco-val-df.p")
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **n** | int | 4 | 用于计算重叠度的最大 n-gram 长度。 |
| **sigma** | float | 6.0 | 用于计算高斯惩罚的 Sigma 参数，调节差异惩罚的幅度。 |
| **df_mode** | str | "coco-val-df" | 文档频率（DF）的计算模式。 |
| **idf_path** | str | "./dataflow/operators/general_pt/eval/cider/coco-val-df.p" | 预计算的 IDF (Inverse Document Frequency) 文件路径。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, reference_key: str, output_key: str='CiderScore')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估的生成文本字段。 |
| **reference_key** | str | 必需 | 输入列名，对应用于比较的参考文本字段。 |
| **output_key** | str | "CiderScore" | 输出列名，对应生成的 CIDEr 得分字段。 |

## 🧠 示例用法
