---
title: CondorGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/generate/condorgenerator/
---

## 📘 概述
CondorGenerator 是一个两阶段合成 SFT (Supervised Fine-Tuning) 格式数据的算子。它基于预置的知识树标签，第一阶段生成不同难度级别的问题，第二阶段为每个问题生成对应的答案。该算子能够从零开始创建多样化的指令微调数据集。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC = None, num_samples=15, use_task_diversity=True):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行推理与生成。 |
| **num_samples** | int | 15 | 生成样本的总数。当数量较大（如大于5000）时，建议增加知识树标签以保证数据丰富度。 |
| **use_task_diversity** | bool | True | 是否使用预设的任务场景来增强生成问题的多样性。 |

### Prompt模板说明


## run函数
```python
def run(self, storage: DataFlowStorage):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |

## 🧠 示例用法
