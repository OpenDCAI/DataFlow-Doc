---
title: KBCChunkGeneratorBatch
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/kbcchunkgeneratorbatch/
---

## 📘 概述
KBCChunkGeneratorBatch 是一个文本分割算子，旨在将长文本或语料库分割成更小、更易于管理的块（chunks）。该算子支持多种分割策略，包括按 token、句子、语义或递归方式进行分割，并允许用户自定义块大小、重叠部分和最小块长度，特别为 RAG（检索增强生成）应用进行了优化。

## `__init__`函数
```python
def __init__(self,
             chunk_size: int = 512,
             chunk_overlap: int = 50,
             split_method: str = "token",
             min_tokens_per_chunk: int = 100,
             tokenizer_name: str = "bert-base-uncased",
             )
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :---- | :-------------------- | :------------------------------------------------ |
| **chunk_size** | int | 512 | 每个文本块的目标大小（根据`split_method`可能是token数或字符数）。 |
| **chunk_overlap** | int | 50 | 相邻文本块之间重叠的大小，以确保上下文连续性。 |
| **split_method** | str | "token" | 文本分割方法。可选值为 "token", "sentence", "semantic", "recursive"。 |
| **min_tokens_per_chunk** | int | 100 | 每个块允许的最小token数。 |
| **tokenizer_name** | str | "bert-base-uncased" | 用于token分割和token计数的分词器模型名称。 |

### 分割方法说明
| 分割方法 | 主要用途 | 适用场景 | 特点说明 |
| ---------------- | ------------- | -------------------- | ----------------------------------------------------- |
| **token** | 按固定token数量分割 | 需要严格控制输入长度的场景 | 最直接的分割方式，确保每个块的token数不超过`chunk_size`。 |
| **sentence** | 按句子边界分割 | 希望保持句子完整性的文本 | 以句子为单位进行分割，避免切断完整的语义单元。 |
| **semantic** | 按语义相似性分割 | 主题明确的文档或段落 | 通过语义聚类，将语义相关的内容划分到同一个块中。 |
| **recursive** | 递归分层分割 | 结构复杂或未知的通用文本 | 尝试使用多种分隔符（如段落、句子、单词）进行递归分割，是一种鲁棒的通用策略。 |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str = "text_path", output_key: str = "chunk_path")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :------------- | :---------------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "text_path" | 输入列名，该列包含待分割的原始文本文件路径。 |
| **output_key** | str | "chunk_path" | 输出列名，用于存储生成的文本块文件（JSON格式）的路径。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
算子执行后，会在输入的 DataFrame 中添加一个新列（默认为 `chunk_path`），其中包含指向新生成的 JSON 文件的路径。每个 JSON 文件内部结构如下：

示例输入DataFrame中的一行：
```json
{
"text_path":"/path/to/your/document.txt"
}
```
示例输出DataFrame中的一行：
```json
{
"text_path":"/path/to/your/document.txt",
"chunk_path":"/path/to/your/extract/document_chunk.json"
}
```
示例生成的 `document_chunk.json` 文件内容：
```json
[
    {
        "raw_chunk": "这是第一个文本块的内容..."
    },
    {
        "raw_chunk": "这是第二个文本块的内容，与第一个块有部分重叠..."
    },
    ...
]
```
