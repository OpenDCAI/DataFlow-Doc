---
title: RMFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/filter/rmfilter/
---

## 📘 概述
`RMFilter` 是一个基于奖励模型（Reward Model）对数据进行过滤的算子。它使用预先训练好的、基于人类偏好数据的奖励模型对文本质量进行评分，并筛选出得分在指定范围内的样本。该算子能够有效评估文本的相关性、有用性、无害性等人类偏好指标，从而筛选出符合人类价值观的高质量文本。

## `__init__`函数
```python
def __init__(self, min_score: float = 0.2, max_score: float = 0.8, device='cuda', model_cache_dir='./dataflow_cache')
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :---- | :-------------------- | :------------------------------ |
| **min_score** | float | 0.2 | 保留样本的最小奖励分数阈值。 |
| **max_score** | float | 0.8 | 保留样本的最大奖励分数阈值。 |
| **device** | str | 'cuda' | 模型运行设备。 |
| **model_cache_dir** | str | './dataflow_cache' | 模型缓存目录。 |

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
| **input_instruction_key** | str | "instruction" | 输入指令列名，对应指令字段。 |
| **input_output_key** | str | "output" | 输入输出列名，对应输出字段。 |
| **output_key** | str | "RMScore" | 输出列名，对应生成的奖励分数字段。 |

## 🧠 示例用法
```python
from dataflow.operators.text_sft.filter import RMFilter
from dataflow.utils.storage import FileStorage

# 准备包含指令-输出对的存储
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# 初始化并运行过滤器
rm_filter = RMFilter(
    min_score=0.2,
    max_score=0.8,
    device="cuda",
    model_cache_dir="./dataflow_cache",
)
rm_filter.run(
    storage.step(),
    input_instruction_key="instruction",
    input_output_key="output",
    output_key="RMScore",
)
```
#### 🧾 默认输出格式（Output Format）
算子执行后，会向原始数据中添加一个奖励分数列（默认为 `RMScore`），并过滤掉得分不在 `[min_score, max_score]` 区间内的数据。

| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| ... | ... | 输入的原始字段。 |
| RMScore | float | 模型生成的奖励分数。 |

**示例输入：**
```json
{
  "instruction": "How can we use Python to calculate the GCD (greatest common divisor) of five numbers and express each number in terms of the GCD?",
  "output": "Yes, that's correct! The function you've provided takes in five numbers as arguments and returns the GCD of those numbers along with each number expressed in terms of the GCD. This is a useful tool for simplifying fractions or finding the common factor between multiple numbers. Great job!"
}
```

**示例输出（如果通过过滤器）：**
```json
{
  "instruction": "How can we use Python to calculate the GCD (greatest common divisor) of five numbers and express each number in terms of the GCD?",
  "output": "Yes, that's correct! The function you've provided takes in five numbers as arguments and returns the GCD of those numbers along with each number expressed in terms of the GCD. This is a useful tool for simplifying fractions or finding the common factor between multiple numbers. Great job!",
  "RMScore": 0.7027474046
}
```
