---
title: CiderSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/cidersampleevaluator/
---

## 📘 概述
`CiderSampleEvaluator` 是一个评估算子，它使用 CIDEr (Consensus-based Image Description Evaluation) 指标来衡量生成文本与参考文本之间的相似度。该算子主要基于 TF-IDF 加权的 n-gram 重叠度来计算得分，常用于图像描述生成等任务的评估。

## __init__函数
```python
def __init__(self, n=4, sigma=6.0, df_mode="coco-val-df", idf_path="./dataflow/operators/general_text/eval/cider/coco-val-df.p")
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **n** | int | 4 | 用于计算重叠度的最大 n-gram 长度。 |
| **sigma** | float | 6.0 | 用于计算高斯惩罚的 Sigma 参数，调节差异惩罚的幅度。 |
| **df_mode** | str | "coco-val-df" | 文档频率（DF）的计算模式，可选 "coco-val-df" 或 "corpus"。 |
| **idf_path** | str | "./dataflow/operators/general_text/eval/cider/coco-val-df.p" | 预计算的 IDF (Inverse Document Frequency) 文件路径。当 df_mode 为 "coco-val-df" 时需要提供此文件。 |

### IDF 文件下载说明
当使用 `df_mode="coco-val-df"` 时（默认模式），需要下载预训练的 IDF 文件：

**下载地址**: [https://github.com/ramavedantam/coco-caption/raw/master/data/coco-val-df.p](https://github.com/ramavedantam/coco-caption/raw/master/data/coco-val-df.p)

**存放路径**: 将下载的文件放置在 `./dataflow/operators/general_text/eval/cider/coco-val-df.p`

如果不想使用预训练 IDF 文件，可以设置 `df_mode="corpus"`，此时将根据当前语料库动态计算 IDF，无需下载文件。

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
```python
from dataflow.operators.general_text import CiderSampleEvaluator
from dataflow.utils.storage import FileStorage

class CiderSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/gen_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = CiderSampleEvaluator(
            n=4,
            sigma=6.0,
            df_mode="coco-val-df",
            idf_path="./dataflow/operators/general_text/eval/cider/coco-val-df.p"
        )
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='input_key',
            input_reference_key='reference_key',
            output_key='CiderScore'
        )

if __name__ == "__main__":
    test = CiderSampleEvaluatorTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :-- | :--- |
| input_key | str | 原始的生成文本 |
| reference_key | str | 原始的参考文本 |
| CiderScore | float | CIDEr 分数（通常在0-10之间，越高表示相似度越高） |

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
{"input_key": "The quick brown fox jumps over the lazy dog.", "reference_key": "A fast brown fox leaps over a lazy dog.", "CiderScore": 2.1455700748}
{"input_key": "She sells seashells by the seashore.", "reference_key": "She is selling shells by the beach.", "CiderScore": 0.8880643249}
{"input_key": "To be or not to be, that is the question.", "reference_key": "The question is whether to be or not.", "CiderScore": 0.5822556198}
{"input_key": "All that glitters is not gold.", "reference_key": "Not everything that shines is gold.", "CiderScore": 0.8292019111}
{"input_key": "A picture is worth a thousand words.", "reference_key": "A single image can convey so much meaning.", "CiderScore": 0.6053086919}
```
