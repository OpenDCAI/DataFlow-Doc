---
title: SuperfilteringSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/eval/superfilteringsampleevaluator/
---

## 📘 概述
[SuperfilteringSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/evaluator/squality/superfiltering_sample_evaluator.py) 是一个评估指令跟随难度的算子。它使用 Superfiltering 方法，基于 GPT-2 模型计算条件困惑度与独立困惑度的比值，得分越高表示指令越难跟随。该方法通过比较指令条件下的响应困惑度与独立响应困惑度，来评估指令的清晰度和跟随难度。

## __init__函数
```python
def __init__(self, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **device** | str | 'cuda' | 指定模型运行的设备，如 'cuda' 或 'cpu'。 |
| **model_cache_dir** | str | './dataflow_cache' | Hugging Face 模型和分词器的缓存目录路径。 |
| **max_length** | int | 512 | 模型处理输入序列的最大长度。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_input_key: str = None, input_output_key: str = 'output', output_key: str = 'SuperfilteringScore')
```
执行算子主逻辑，从存储中读取输入 DataFrame，计算 Superfiltering 分数，并将结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | "instruction" | 输入 DataFrame 中指令列的列名。 |
| **input_input_key** | str | None | 输入 DataFrame 中可选输入文本列的列名。 |
| **input_output_key** | str | "output" | 输入 DataFrame 中响应文本列的列名。 |
| **output_key** | str | "SuperfilteringScore" | 输出分数在 DataFrame 中的列名。 |

## 🧠 示例用法

```python
from dataflow.operators.text_sft.eval import SuperfilteringSampleEvaluator
from dataflow.utils.storage import FileStorage

# 准备包含指令-输出对的存储
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# 初始化并运行评估器
evaluator = SuperfilteringSampleEvaluator(
    device="cuda",
    model_cache_dir="./dataflow_cache",
    max_length=512,
)
evaluator.run(
    storage.step(),
    input_instruction_key="instruction",
    input_input_key=None,
    input_output_key="output",
    output_key="SuperfilteringScore",
)
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| ... | ... | ... |
| SuperfilteringScore | float | Superfiltering 方法计算出的指令跟随难度分数。 |

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
  "SuperfilteringScore": 0.8576479985
}
```
