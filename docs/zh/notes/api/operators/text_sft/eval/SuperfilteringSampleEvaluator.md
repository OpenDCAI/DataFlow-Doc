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

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| ... | ... | ... |
| SuperfilteringScore | float | Superfiltering 方法计算出的指令跟随难度分数。 |
