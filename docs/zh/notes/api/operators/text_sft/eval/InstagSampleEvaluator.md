---
title: InstagSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/eval/instagsampleevaluator/
---

## 📘 概述

`InstagSampleEvaluator` 是一个指令评估算子，用于评估指令的内容多样性和意图标签。它通过分析指令文本生成相关标签，标签数量越多表示内容多样性越大。该算子基于 `OFA-Sys/InsTagger` 模型实现。

## __init__函数

```python
def __init__(self, model_cache_dir='./dataflow_cache', device='cuda', max_new_tokens=1024, temperature=0, do_sample=False, num_return_sequences=1, return_dict_in_generate=True)
```

### init参数说明

| 参数名                      | 类型 | 默认值               | 说明                                                         |
| :-------------------------- | :--- | :------------------- | :----------------------------------------------------------- |
| **model_cache_dir**         | str  | './dataflow_cache'   | 用于缓存下载的 `OFA-Sys/InsTagger` 模型文件的目录路径。      |
| **device**                  | str  | 'cuda'               | 指定模型运行的设备，如 'cuda' 或 'cpu'。                     |
| **max_new_tokens**          | int  | 1024                 | 模型生成时允许的最大新令牌（token）数量。                    |
| **temperature**             | int  | 0                    | 控制生成文本的随机性。较低的值使输出更具确定性。             |
| **do_sample**               | bool | False                | 是否使用采样策略进行生成。                                   |
| **num_return_sequences**    | int  | 1                    | 为每个输入指令生成的序列数量。                               |
| **return_dict_in_generate** | bool | True                 | 在生成过程中是否返回一个字典。                               |

## Prompt模板说明

## run函数

```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', output_key: str = 'InstagScore')
```

#### 参数

| 名称                    | 类型            | 默认值          | 说明                                                       |
| :---------------------- | :-------------- | :-------------- | :--------------------------------------------------------- |
| **storage**             | DataFlowStorage | 必需            | 数据流存储实例，负责读取与写入 DataFrame 数据。            |
| **input_instruction_key** | str             | "instruction"   | 输入 DataFrame 中待评估指令所在的列名。                    |
| **output_key**          | str             | "InstagScore"   | 输出分数将存储在新列的列名。                               |

## 🧠 示例用法
```python
from dataflow.operators.text_sft.eval import InstagSampleEvaluator
from dataflow.utils.storage import FileStorage

# 准备仅包含指令数据的存储
storage = FileStorage(first_entry_file_name="sft_instructions.jsonl")

# 初始化并运行评估器
evaluator = InstagSampleEvaluator(
    model_cache_dir="./dataflow_cache",
    device="cuda",
    max_new_tokens=1024,
)
evaluator.run(
    storage.step(),
    input_instruction_key="instruction",
    output_key="InstagScore",
)
```

#### 🧾 默认输出格式（Output Format）
该算子会向输入 DataFrame 添加一个新列，包含计算出的分数。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| *input_columns* | - | 输入数据中的原始列会被保留。 |
| **InstagScore** | int | 计算出的内容多样性分数（标签数量）。列名由 `output_key` 参数决定。 |

**示例输入：**
```json
{
  "instruction": "Can you provide a list of healthy habits to maintain a healthy lifestyle? Please format your response as an HTML page with bullet points."
}
```

**示例输出：**
```json
{
  "instruction": "Can you provide a list of healthy habits to maintain a healthy lifestyle? Please format your response as an HTML page with bullet points.",
  "InstagScore": 2
}
```
