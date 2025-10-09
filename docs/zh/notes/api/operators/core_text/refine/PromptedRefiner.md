---
title: PromptedRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/refine/promptedrefiner/
---

好的，这是根据您提供的代码和模板生成的 `PromptedRefiner` 算子的教程 Markdown。

---

## 📘 概述
`PromptedRefiner` 根据给定的 `system_prompt` 对指定列的文本进行改写/润色/规范化，并将结果**就地写回**同一列（覆盖原内容）。其做法是对每一行拼接 `system_prompt + raw_content` 作为模型输入，批量生成改写结果。

## `__init__`函数
```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "You are a helpful agent.")
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | LLM 服务对象，需实现 LLMServingABC 接口。 |
| **system_prompt** | str | "You are a helpful agent." | 系统提示词，用于描述改写目标与风格。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "raw_content" | 要改写的文本列名，改写后会**覆盖**该列。 |

## 🧠 示例用法
```python

```
