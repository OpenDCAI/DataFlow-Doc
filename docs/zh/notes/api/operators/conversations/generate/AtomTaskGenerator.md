---
title: AtomTaskGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/atomtaskgenerator/
---

## 📘 概述 [AtomTaskGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)
根据输入的场景信息，使用大语言模型（LLM）服务生成对应的原子任务。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | LLM服务对象，需实现LLMServingABC接口。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_scenario_key: str, output_key: str = "atom_task"):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_scenario_key** | str | 必需 | 输入列名，对应场景字段。 |
| **output_key** | str | "atom_task" | 输出列名，对应生成的原子任务字段。 |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `<input_scenario_key>` | str | 输入的场景文本。 |
| `atom_task` | str | 模型生成的原子任务。 |

示例输入：
```json
```
示例输出：
```json
```
