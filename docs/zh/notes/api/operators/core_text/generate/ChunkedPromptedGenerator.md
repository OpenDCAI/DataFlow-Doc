---
title: ChunkedPromptedGenerator
createTime: 2026/01/20 15:00:00
permalink: /zh/api/operators/core_text/generate/chunkedpromptedgenerator/
---

## 📘 概述

`ChunkedPromptedGenerator` 是一个支持**长文本自动分块**的提示词生成算子。当输入内容超过预设的 Token 限制时，该算子会采用递归二分法将文本切分为多个较小的块（Chunks），分别调用大语言模型（LLM）生成结果，最后将各块的生成内容按指定分隔符拼接。

它特别适用于处理超长文档（如书籍、长论文），并支持从文件路径读取输入内容。

## `__init__`函数

```python
def __init__(self, 
             llm_serving: LLMServingABC, 
             system_prompt: str = "You are a helpful agent.", 
             json_schema: dict = None, 
             max_chunk_len: int = 128000, 
             enc = tiktoken.get_encoding("cl100k_base"), 
             seperator: str = "\n"
             )
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例。 |
| **system_prompt** | str | "You are a helpful agent." | 系统提示词，定义模型的角色和行为。 |
| **json_schema** | dict | None | （可选）用于约束 LLM 输出格式的 JSON Schema。 |
| **max_chunk_len** | int | 128000 | 单个分块的最大 Token 数量。 |
| **enc** | Encoder/Tokenizer | tiktoken.get_encoding("cl100k_base") | 用于计算 Token 的编码器，需支持 `encode` 方法，也可以是AutoTokenizer。 |
| **seperator** | str | "\n" | 多个分块生成结果之间的拼接分隔符。 |

### 分块逻辑说明

该算子采用**递归二分法**：

1. 计算当前文本的 Token 总数。
2. 若 Token 数 < `max_chunk_len`，则作为一个独立块处理。
3. 若 Token 数 > `max_chunk_len`，则从文本中间字符位置切分为左右两部分，递归进行上述判断。

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_path_key: str, output_path_key: str)

```

执行算子逻辑：从指定的输入列中读取文件路径，加载文件内容，分块生成后将结果写入新的文本文件，并在 DataFrame 中记录输出文件路径。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例。 |
| **input_path_key** | str | 必需 | 输入列名，该列应包含待处理文本文件的**本地路径**。 |
| **output_path_key** | str | 必需 | 输出列名，用于存储生成的 LLM 输出文件的路径。 |

## 🧠 示例用法

```python
from dataflow.core import LLMServing
from dataflow.utils.storage import DataFlowStorage

# 初始化算子，设置最大长度为 2000 tokens
operator = ChunkedPromptedGenerator(
    llm_serving=my_llm_instance,
    max_chunk_len=2000,
    seperator="\n---\n"
)

# 运行算子
operator.run(
    storage=my_storage,
    input_path_key="file_path",
    output_path_key="result_path"
)

```

#### 🧾 输出逻辑说明

算子会自动在输入文件的同级目录下生成后缀为 `_llm_output.txt` 的结果文件。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| file_path | str | 原始输入文件的路径（例如 `data/doc.txt`）。 |
| result_path | str | 生成结果文件的存储路径（例如 `data/doc_llm_output.txt`）。 |

**示例输入 DataFrame 行：**

```json
{
  "file_path": "/home/user/data/long_article.txt"
}

```

**分块处理流程：**

1. 读取 `long_article.txt` 内容。
2. 假设文本被切分为 Chunk A 和 Chunk B。
3. 调用 LLM 得到 `Result A` 和 `Result B`。
4. 将 `Result A\nResult B` 写入 `/home/user/data/long_article_llm_output.txt`。

**示例输出 DataFrame 行：**

```json
{
  "file_path": "/home/user/data/long_article.txt",
  "result_path": "/home/user/data/long_article_llm_output.txt"
}

```
