---
title: ScenarioExpander
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/scenarioexpander/
---

## 📘 概述

`ScenarioExpander` 是一个场景扩展算子，它利用大语言模型（LLM）服务，基于输入的原始场景来生成新的或替代的场景。该算子通过重写或改写原有内容，创造出不同版本的场景。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行内容生成。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_scenario_key: str, output_key: str = "modified_scenario"):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_scenario_key** | str | 必需 | 输入列名，对应原始场景字段。 |
| **output_key** | str | "modified_scenario" | 输出列名，对应生成的新场景字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| [input_scenario_key] | str | 输入的原始场景文本。 |
| modified_scenario | str | 模型生成的替代新场景。 |

示例输入：
```json
{
"original_scenario":"一个用户在网上银行App上尝试转账，但因为网络问题失败了。"
}
```
示例输出：
```json
{
"original_scenario":"一个用户在网上银行App上尝试转账，但因为网络问题失败了。",
"modified_scenario":"一个用户在银行ATM机上尝试取款，但因为机器故障无法取出钞票。"
}
```
