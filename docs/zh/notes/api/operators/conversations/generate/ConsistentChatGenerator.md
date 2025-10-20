---
title: ConsistentChatGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/consistentchatgenerator/
---

## 📘 概述
`ConsistentChatGenerator` 是一个多轮对话数据生成算子，它根据预置的主题和人类意图，分两个阶段从零开始合成对话数据。

## \_\_init\_\_函数
```python
def __init__(self, llm_serving: LLMServingABC = None, num_dialogs_per_intent = 20, num_turns_per_dialog = 6, temperature = 0.9)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :----------------------- | :-------------- | :------- | :----------------------------- |
| **llm_serving** | LLMServingABC | None | LLM服务对象，需实现LLMServingABC接口。 |
| **num_dialogs_per_intent** | int | 20 | 每个意图生成的对话数量。 |
| **num_turns_per_dialog** | int | 6 | 每个对话的轮次数量。 |
| **temperature** | float | 0.9 | 生成温度，控制输出随机性。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| ------------------- |------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage)
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :---------- | :---------------- | :--- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责写入生成的数据。 |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :------------- | :---- | :--------------------------------------------------------- |
| category | str | 对话所属的类别或意图。 |
| conversation | list | 多轮对话列表，每个元素是一个包含 "role" 和 "value" 的字典。 |
