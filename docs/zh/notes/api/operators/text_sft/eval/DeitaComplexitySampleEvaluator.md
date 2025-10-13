---
title: DeitaComplexitySampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/eval/deitacomplexitysampleevaluator/
---

## 📘 概述
`DeitaComplexitySampleEvaluator` 是一个基于Llama模型的Deita指令复杂性评估算子，通过为输入指令生成1-6分的复杂性评分，来评估指令的难度。

## \_\_init\_\_函数
```python
def __init__(self, device='cuda', model_cache_dir='./dataflow_cache', max_length=512)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :---- | :-------------------- | :----------------------- |
| **device** | str | 'cuda' | 计算设备，支持 'cuda' 或 'cpu'。 |
| **model_cache_dir** | str | './dataflow_cache' | 模型文件的本地缓存目录。 |
| **max_length** | int | 512 | 模型生成时允许的最大序列长度。 |

## Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_instruction_key: str = 'instruction', input_output_key: str = 'output', output_key: str = 'DeitaComplexityScore')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------------- | :------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | 'instruction' | 输入数据中指令文本对应的列名。 |
| **input_output_key** | str | 'output' | 输入数据中输出文本对应的列名。 |
| **output_key** | str | 'DeitaComplexityScore' | 输出的复杂性得分对应的列名。 |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
算子会保留所有输入字段，并添加一个新字段用于存储复杂性评分。

| 字段 | 类型 | 说明 |
| :-------------------- | :---- | :---------------------------------- |
| ... | ... | 原始输入数据中的所有字段。 |
| DeitaComplexityScore | float | 模型生成的指令复杂性评分（范围在1-6之间）。 |

示例输入：
```json
{
"instruction":"写一首关于春天的五言绝句。",
"output": "草长莺飞日，风和柳絮时。花开香满径，客来鸟先知。"
}
```
示例输出：
```json
{
"instruction":"写一首关于春天的五言绝句。",
"output": "草长莺飞日，风和柳絮时。花开香满径，客来鸟先知。",
"DeitaComplexityScore": 2.35
}
```
