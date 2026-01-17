---
title: InstagFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/filter/instagfilter/
---

## 📘 概述 [InstagFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filter/instag_filter.py)
基于InstagScorer打分器的过滤算子。使用预训练的Instag模型对指令进行分析，返回标签的数量来评估指令的内容多样性。参数包括模型缓存目录(model_cache_dir)、计算设备(device)和最大新生成标记数(max_new_tokens)。过滤范围由min_score和max_score参数控制，标签越多表示内容多样性越大。

## __init__函数
```python
def __init__(self, min_score=0.0, max_score=1.0, model_cache_dir='./dataflow_cache', device='cuda', max_new_tokens=1024):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 0.0 | 过滤的最低分数阈值。 |
| **max_score** | float | 1.0 | 过滤的最高分数阈值。 |
| **model_cache_dir** | str | './dataflow_cache' | Instag模型缓存目录。 |
| **device** | str | 'cuda' | 计算设备，例如 'cuda' 或 'cpu'。 |
| **max_new_tokens** | int | 1024 | 模型生成时最大新标记数。 |

### Prompt模板说明

## run函数
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', output_key: str = 'InstagScore'):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | "instruction" | 输入列名，对应需要评分的指令字段。 |
| **output_key** | str | "InstagScore" | 输出列名，对应InstagScorer生成的得分字段。 |

## 🧠 示例用法

```python
from dataflow.operators.text_sft.filter import InstagFilter
from dataflow.utils.storage import FileStorage

# 准备仅包含指令数据的存储
storage = FileStorage(first_entry_file_name="sft_instructions.jsonl")

# 初始化并运行过滤器
instag_filter = InstagFilter(
    min_score=0.0,
    max_score=1.0,
    model_cache_dir="./dataflow_cache",
    device="cuda",
)
instag_filter.run(
    storage.step(),
    input_instruction_key="instruction",
    output_key="InstagScore",
)
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| instruction | str | 输入的指令文本。 |
| InstagScore | float | Instag模型对指令内容多样性的评分。 |
| ... | any | 保留输入中的其他原始字段。 |

**示例输入：**
```json
{
  "instruction": "Using the Linnaean classification system, provide a detailed description of the taxonomy of the skunk cabbage plant."
}
```

**示例输出（如果通过过滤器）：**
```json
{
  "instruction": "Using the Linnaean classification system, provide a detailed description of the taxonomy of the skunk cabbage plant.",
  "InstagScore": 1
}
```
