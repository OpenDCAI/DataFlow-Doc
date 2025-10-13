---
title: SequentialTaskGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/sequentialtaskgenerator/
---

## 📘 概述 [SequentialTaskGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/sequential_task_generator.py)
`SequentialTaskGenerator` 是一个任务生成算子，它根据输入的原子任务，利用大语言模型（LLM）服务生成该任务的一个后继任务和一个组合任务。该算子旨在自动化任务链的扩展和构建，适用于需要序贯执行或组合复杂任务的场景。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行任务生成。 |

## Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_task_key: str, output_subsequent_task_key: str = "subsequent_task", output_composition_task_key: str = "composition_task")
```
执行算子主逻辑，从存储中读取包含原子任务的 DataFrame，调用 LLM 生成后继任务与组合任务，并将结果添加为新列后写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_task_key** | str | 必需 | 输入列名，对应原子任务字段。 |
| **output_subsequent_task_key** | str | "subsequent_task" | 输出列名，对应生成的后继任务字段。 |
| **output_composition_task_key** | str | "composition_task" | 输出列名，对应生成的组合任务字段。 |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| {input_task_key} | str | 输入的原子任务文本。 |
| subsequent_task | str | 模型生成的后继任务。 |
| composition_task | str | 模型生成的组合任务。 |

示例输入：
```json
{
"atomic_task":"撰写一份关于人工智能在医疗领域应用的报告"
}
```
示例输出：
```json
{
"atomic_task":"撰写一份关于人工智能在医疗领域应用的报告",
"subsequent_task":"为这份报告创建一个10页的PPT演示文稿",
"composition_task":"撰写一份关于人工智能在医疗领域应用的报告，并为其创建一个10页的PPT演示文稿"
}
```
