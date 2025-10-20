---
title: SFTGeneratorSeed
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/generate/sftgeneratorseed/
---

## 📘 概述

[SFTGeneratorSeed](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/sft/generate/sft_generator_seed.py) 是一个监督微调（SFT）数据生成算子。它基于给定的文档内容，调用大语言模型（LLM）生成符合监督微调格式的指令-响应（instruction-response）数据对。该算子支持用户通过自定义提示词（prompt）来控制生成内容的具体要求，从而实现从原始文档到高质量SFT数据集的自动化构建。

## __init__函数

```python
def __init__(self, llm_serving: LLMServingABC, custom_prompt: str)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **custom_prompt** | str | 必需 | 用户自定义的提示词，用于指导模型生成特定风格或内容的问答对。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content")
```

执行算子主逻辑，从存储中读取包含原始文档的 DataFrame，为每条文档内容生成指令与回答，并将结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "raw_content" | 输入列名，对应原始文档内容的字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| instruction | str | 模型根据原始文档生成的指令或问题。 |
| output | str | 模型针对生成的指令给出的回答。 |
| raw_content | str | 用于生成问答对的原始文档内容。 |

示例输入：

```json
{
"raw_content": "青霉素，又称为盘尼西林，是指分子中含有青霉烷、能破坏细菌的细胞壁并在细菌细胞的繁殖期起杀菌作用的一类抗生素。1928年，英国细菌学家亚历山大·弗莱明在实验室中发现，一种霉菌（即青霉菌）能分泌一种物质来抑制葡萄球菌的生长。他将这种物质命名为青霉素。"
}
```

示例输出：

```json
{
"instruction": "谁在1928年发现了青霉素，它的主要作用是什么？",
"output": "青霉素是由英国细菌学家亚历山大·弗莱明在1928年发现的。它的主要作用是破坏细菌的细胞壁，在细菌繁殖期起到杀菌效果。",
"raw_content": "青霉素，又称为盘尼西林，是指分子中含有青霉烷、能破坏细菌的细胞壁并在细菌细胞的繁殖期起杀菌作用的一类抗生素。1928年，英国细菌学家亚历山大·弗莱明在实验室中发现，一种霉菌（即青霉菌）能分泌一种物质来抑制葡萄球菌的生长。他将这种物质命名为青霉素。"
}
```
