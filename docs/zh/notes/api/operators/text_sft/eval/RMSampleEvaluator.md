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
from dataflow.operators.text_sft.eval import RMSampleEvaluator
from dataflow.utils.storage import FileStorage

# 准备包含指令-输出对的存储
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# 初始化并运行评估器
evaluator = RMSampleEvaluator(
    device="cuda",
    model_cache_dir="./dataflow_cache",
)
evaluator.run(
    storage.step(),
    input_instruction_key="instruction",
    input_output_key="output",
    output_key="RMScore",
)
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| instruction | str | 输入的指令文本。 |
| output | str | 输入的响应文本。 |
| RMScore | float | 模型生成的奖励分数，越高表示质量越好。 |

**示例输入：**
```json
{
  "instruction": "Can you provide a list of healthy habits to maintain a healthy lifestyle? Please format your response as an HTML page with bullet points.",
  "output": "Here's an HTML page with bullet points for healthy habits:\n<html>\n  <body>\n    <h3>Healthy Habits:</h3>\n    <ul>\n      <li>Eating a balanced diet with plenty of fruits and vegetables.</li>\n      <li>Engaging in regular physical activity, such as walking, running, or cycling.</li>\n      <li>Getting enough sleep each night, ideally 7-8 hours.</li>\n      <li>Staying hydrated by drinking plenty of water throughout the day.</li>\n      <li>Limiting alcohol consumption and avoiding smoking.</li>\n      <li>Managing stress through relaxation techniques like meditation or yoga.</li>\n      <li>Regularly visiting a healthcare provider for check-ups and preventative care.</li>\n    </ul>\n  </body>\n</html>"
}
```

**示例输出：**
```json
{
  "instruction": "Can you provide a list of healthy habits to maintain a healthy lifestyle? Please format your response as an HTML page with bullet points.",
  "output": "Here's an HTML page with bullet points for healthy habits:\n<html>\n  <body>\n    <h3>Healthy Habits:</h3>\n    <ul>\n      <li>Eating a balanced diet with plenty of fruits and vegetables.</li>\n      <li>Engaging in regular physical activity, such as walking, running, or cycling.</li>\n      <li>Getting enough sleep each night, ideally 7-8 hours.</li>\n      <li>Staying hydrated by drinking plenty of water throughout the day.</li>\n      <li>Limiting alcohol consumption and avoiding smoking.</li>\n      <li>Managing stress through relaxation techniques like meditation or yoga.</li>\n      <li>Regularly visiting a healthcare provider for check-ups and preventative care.</li>\n    </ul>\n  </body>\n</html>",
  "RMScore": 5.2253570557
}
```
