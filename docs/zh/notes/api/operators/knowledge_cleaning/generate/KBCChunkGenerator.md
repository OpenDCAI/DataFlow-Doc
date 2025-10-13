---
title: KBCChunkGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/kbcchunkgenerator/
---

## 📘 概述 [KBCChunkGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个轻量级文本分割工具，支持词、句、语义、递归等多种分块方法，并可灵活配置块大小、重叠长度和最小块长度。

## __init__函数
```python
def __init__(self,
             chunk_size: int = 512,
             chunk_overlap: int = 50,
             split_method: str = "token",
             min_tokens_per_chunk: int = 100,
             tokenizer_name: str = "bert-base-uncased",
             ):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :---- | :-------------------- | :----------------------------------------------------------- |
| **chunk_size** | int | 512 | 每个文本块的目标大小。 |
| **chunk_overlap** | int | 50 | 相邻文本块之间重叠的单元（如token）数量。 |
| **split_method** | str | "token" | 文本分割方法。支持 "token", "sentence", "semantic", "recursive"。 |
| **min_tokens_per_chunk** | int | 100 | 每个文本块所需的最小 token 数。 |
| **tokenizer_name** | str | "bert-base-uncased" | 用于分词的预训练分词器名称，来自 Hugging Face Hub。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key:str='text_path', output_key:str="raw_chunk")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :-------------- | :--------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入 DataFrame 数据。 |
| **input_key** | str | "text_path" | 输入列名，该列包含待处理文本文件的路径。 |
| **output_key** | str | "raw_chunk" | 输出列名，用于存储生成的文本块内容。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
该算子读取 DataFrame，根据 `input_key` 指定的列中的文件路径进行文本分块，然后生成一个新的 DataFrame。对于输入 DataFrame 中的每一行，会根据其文本内容切分出的块数生成相应数量的新行。新行会保留原始行的所有字段，并新增一个由 `output_key` 指定的列，用于存放文本块内容。

示例输入（DataFrame中的一行）：
```json
{
  "doc_id": "doc_001",
  "text_path": "/path/to/your/document.txt"
}
```
示例输出（生成的 DataFrame 将包含多行，如下所示）：
```json
{
  "doc_id": "doc_001",
  "text_path": "/path/to/your/document.txt",
  "raw_chunk": "这是从文档中切分出的第一个文本块..."
},
{
  "doc_id": "doc_001",
  "text_path": "/path/to/your/document.txt",
  "raw_chunk": "...这是第二个文本块，与前一个有重叠部分..."
},
{
  "doc_id": "doc_001",
  "text_path": "/path/to/your/document.txt",
  "raw_chunk": "...这是第三个文本块..."
}
```
