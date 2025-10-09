---
title: RMSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/eval/rmsampleevaluator/
---

## 📘 概述 [RMSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluators/sample_evaluators/rm_sample_evaluator.py)
基于人类偏好数据训练的奖励模型(OpenAssistant/reward-model-deberta-v3-large-v2)对文本质量进行打分，高分代表质量较高。 模型输入为指令和响应文本对，输出0-1之间的奖励分数，反映人类对文本质量的偏好判断。
## __init__函数
```python
def __init__(self, device='cuda', model_cache_dir='./dataflow_cache')
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :---- | :---------------------------- | :------------------------------ |
| **device** | str | 'cuda' | 模型运行设备，例如 'cuda' 或 'cpu'。 |
| **model_cache_dir** | str | './dataflow_cache' | 用于缓存下载的模型的目录。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_output_key: str = 'output', output_key: str = 'RMScore')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | "instruction" | 输入的指令文本对应的列名。 |
| **input_output_key** | str | "output" | 输入的响应文本对应的列名。 |
| **output_key** | str | "RMScore" | 输出的奖励模型分数对应的列名。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| instruction | str | 输入的指令文本。 |
| output | str | 输入的响应文本。 |
| RMScore | float | 模型生成的奖励分数，越高表示质量越好。 |

示例输入：
```json
{
"instruction":"写一首关于春天的诗。",
"output":"春风拂面绿意浓，万物复苏笑颜中。桃花流水映日红，鸟语花香乐无穷。"
}
```
示例输出：
```json
{
"instruction":"写一首关于春天的诗。",
"output":"春风拂面绿意浓，万物复苏笑颜中。桃花流水映日红，鸟语花香乐无穷。",
"RMScore": 0.85
}
```
