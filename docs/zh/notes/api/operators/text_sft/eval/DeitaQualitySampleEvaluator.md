---
title: DeitaQualitySampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/eval/deitaqualitysampleevaluator/
---

## 📘 概述

[DeitaQualitySampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/quality/deita_evaluator.py) 是一个基于Deita模型的指令质量评估算子。它通过分析输入的指令（instruction）和对应的输出（output），生成一个1到6分之间的质量评分，用于量化数据样本的质量。

## \_\_init\_\_函数

```python
def __init__(self, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :-- | :--- | :--- |
| **device** | str | 'cuda' | 用于模型计算的设备（如 'cuda' 或 'cpu'）。 |
| **model\_cache\_dir** | str | './dataflow_cache' | 存放下载的Deita模型的缓存目录。 |
| **max\_length** | int | 512 | 模型处理输入时允许的最大序列长度。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage, input_instruction_key='instruction', input_output_key='output', output_key='DeitaQualityScore')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input\_instruction\_key** | str | "instruction" | 输入列名，对应指令文本字段。 |
| **input\_output\_key** | str | "output" | 输入列名，对应输出文本字段。 |
| **output\_key** | str | "DeitaQualityScore" | 输出列名，对应生成的质量分数字段。 |

## 🧠 示例用法

```python
from dataflow.operators.text_sft.eval import DeitaQualitySampleEvaluator
from dataflow.utils.storage import FileStorage

# 准备包含指令-输出对的存储
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# 初始化并运行评估器
evaluator = DeitaQualitySampleEvaluator(
    device="cuda",
    model_cache_dir="./dataflow_cache",
    max_length=512,
)
evaluator.run(
    storage.step(),
    input_instruction_key="instruction",
    input_output_key="output",
    output_key="DeitaQualityScore",
)
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| instruction | str | 输入的指令文本。 |
| output | str | 输入的输出文本。 |
| DeitaQualityScore | float | 模型生成的质量评分（1-6分）。 |

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
  "DeitaQualityScore": 5.87
}
```
