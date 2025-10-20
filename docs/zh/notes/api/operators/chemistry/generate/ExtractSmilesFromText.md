---
title: ExtractSmilesFromText
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/chemistry/generate/extractsmilesfromtext/
---

## 📘 概述
[ExtractSmilesFromText]() 是一个用于从 OCR 文本中抽取或解析化学分子 SMILES 表达式的算子。它会根据给定的提示模板，结合文本内容，调用大语言模型完成解析，并将结果以 JSON 格式写回到指定列。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC, prompt_template = None):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **prompt_template** | PromptABC | None | 提示词模板对象，用于构建模型输入。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, content_key: str = "text", abbreviation_key: str = "abbreviations", output_key: str = "synth_smiles")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **content_key** | str | "text" | 包含 OCR 文本的输入列名。 |
| **abbreviation_key** | str | "abbreviations" | 包含缩写/单体信息的输入列名。 |
| **output_key** | str | "synth_smiles" | 存储抽取结果的输出列名。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| text | str | 输入的 OCR 文本。 |
| abbreviations | str | 输入的缩写/单体信息。 |
| synth_smiles | list/dict | 模型生成并经 JSON 解析后的 SMILES 结构。 |
