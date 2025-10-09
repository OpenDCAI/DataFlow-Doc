---
title: CondorRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/refine/condorrefiner/
---

## 📘 概述
[CondorRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/refine/condor_refiner.py) 是一个两阶段优化指令回复质量的算子。第一阶段调用大语言模型（LLM）生成对原始回复的评论（critique），第二阶段结合原始问题、原始回复以及生成的评论，再次调用LLM来改写并优化回复，从而提升指令对（instruction-response pair）的整体质量。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC = None)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str='instruction', input_output_key: str='output')
```
执行算子主逻辑，从存储中读取包含指令和回复的 DataFrame，经过“生成评论”和“优化回复”两个阶段，并将优化后的结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | "instruction" | 输入列名，对应指令字段。 |
| **input_output_key** | str | "output" | 输入列名，对应待优化的回复字段。优化后的回复将覆盖此列。 |

## 🧠 示例用法
