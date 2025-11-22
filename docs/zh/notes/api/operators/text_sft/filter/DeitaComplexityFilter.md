---
title: DeitaComplexityFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/filter/deitacomplexityfilter/
---

## 📘 概述
`DeitaComplexityFilter` 是一个数据筛选算子，它使用 Deita 指令复杂性评估器对数据进行评分，并根据设定的分数阈值（`min_score`, `max_score`）来过滤数据。该算子旨在保留指定复杂性范围内的数据样本。

## `__init__`函数
```python
def __init__(self, min_score=3.0, max_score=5.0, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :---- | :--------------------- | :--------------------------------------------- |
| **min_score** | float | 3.0 | 最低分数阈值，低于此分数的数据将被过滤。 |
| **max_score** | float | 5.0 | 最高分数阈值，高于此分数的数据将被过滤。 |
| **device** | str | 'cuda' | 模型运行的设备（如 'cuda' 或 'cpu'）。 |
| **model_cache_dir** | str | './dataflow_cache' | 用于存储下载的Deita模型的缓存目录。 |
| **max_length** | int | 512 | 模型处理输入文本时的最大序列长度。 |

### Prompt模板说明

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_output_key : str = 'output', output_key: str = "DeitaComplexityScore")
```
执行算子主逻辑，从存储中读取输入 DataFrame，计算每条数据的复杂性得分，并根据 `min_score` 和 `max_score` 过滤数据，最后将带有得分的、被筛选后的数据写回存储。
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :---------------------- | :---------------- | :----------------------- | :------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | "instruction" | 输入列名，对应指令或问题字段。 |
| **input_output_key** | str | "output" | 输入列名，对应输出或答案字段。 |
| **output_key** | str | "DeitaComplexityScore" | 输出列名，用于存储计算出的复杂性得分。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
该算子会为输入的每一行数据新增一个得分列（列名由 `output_key` 参数指定），然后根据得分范围进行过滤。
| 字段 | 类型 | 说明 |
| :---------------------- | :---- | :----------------------------------------------- |
| instruction | str | 输入的指令文本。 |
| output | str | 输入的输出文本。 |
| DeitaComplexityScore | float | 模型生成的指令复杂性得分。 |

示例输入：
```json
{
"instruction":"请解释一下什么是黑洞，并说明它的主要特性。",
"output":"黑洞是时空的一个区域，其引力场非常强大，以至于任何物质和辐射（包括光）都无法逃逸。它的主要特性包括：1. 事件视界：黑洞的边界，一旦越过就无法返回。2. 奇点：黑洞中心，密度和引力无限大的点。3. 无毛定理：一个稳定的黑洞仅由其质量、角动量和电荷三个物理量来确定。"
}
```
示例输出（假设该条目得分在 `[min_score, max_score]` 区间内）：
```json
{
"instruction":"请解释一下什么是黑洞，并说明它的主要特性。",
"output":"黑洞是时空的一个区域，其引力场非常强大，以至于任何物质和辐射（包括光）都无法逃逸。它的主要特性包括：1. 事件视界：黑洞的边界，一旦越过就无法返回。2. 奇点：黑洞中心，密度和引力无限大的点。3. 无毛定理：一个稳定的黑洞仅由其质量、角动量和电荷三个物理量来确定。",
"DeitaComplexityScore": 4.5
}
```
