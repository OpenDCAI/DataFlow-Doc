---
title: PDF2QA算子
createTime: 2025/06/24 11:43:42
permalink: /zh/guide/Knowledgebase_QA_operators/
---

# PDF2QA算子

## 概述

PDF2QA算子适用于面向RAG，RARE，RAFT等下游任务的知识库提取，整理，精调，主要包括：**知识提取算子(FileOrURLToMarkdownConverterBatch**)，**语料分块算子(KBCChunkGenerator)**和**知识清洗算子(KBCTextCleaner)**, **文本到多轮QA生成器(Text2MultiHopQAGenerator)**。这些算子能够用于多种原始格式的文件整理，以及爬取特定URL对应的网页内容，并将这些文本知识整理成可读、易用、安全的RAG知识库。

本文中算子标记继承自[强推理算子](https://opendcai.github.io/DataFlow-Doc/zh/guide/Reasoning_operators/)

- 🚀 **自主创新**：核心算法原创研发，填补现有算法空白或是进一步提升性能，突破当下性能瓶颈。
- ✨ **开源首发**：首次将该算子集成到社区主流框架中，方便更多开发者使用，实现开源共享。

## PDF2QA算子

PDF2QA算子能完成多种异构文本知识源的提取、整理和清洗工作。

| 名称                  | 适用类型 | 简介                                                         | 官方仓库或论文                                         |
| --------------------- | :------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| FileOrURLToMarkdownConverterFlash🚀🚀✨  | 知识提取 | 该算子用于将各种异构文本知识提取成markdown格式，方便后续处理。（基于Flash-MinerU） | [Flash-MinerU](https://github.com/OpenDCAI/Flash-MinerU)                                                      |
| FileOrURLToMarkdownConverterAPI🚀✨  | 知识提取 | 该算子用于将各种异构文本知识提取成markdown格式，方便后续处理。（基于MinerU官方API） | [MinerU](https://github.com/opendatalab/MinerU)                                                      |
| FileOrURLToMarkdownConverterLocal✨  | 知识提取 | 该算子用于将各种异构文本知识提取成markdown格式，方便后续处理。（基于MinerU） | [MinerU](https://github.com/opendatalab/MinerU)                                                        |
| KBCChunkGenerator✨   | 语料分段 | 该算子提供多种方式，用于将文本全文切分成合适大小的片段，方便后续索引等操作。 | -                                                      |
| KBCTextCleaner🚀✨    | 知识清洗 | 该算子利用LLM对整理好的原始文本进行清洗，包括但不限于规范化，去隐私等操作。 | -                                                      |
| Text2MultiHopQAGenerator🚀✨ | 知识转述 | 该算子利用长度为三个句子的滑动窗口，将清洗好的知识库转写成一系列需要多步推理的QA，更有利于RAG准确推理。 | [MIRAID](https://github.com/eth-medical-ai-lab/MIRIAD) |

## 算子接口调用说明

特别地，对于指定存储路径等或是调用模型的算子，我们提供了封装后的**模型接口**以及**存储对象接口**，可以通过以下方式定义LLM API接口：

``` python
from dataflow.llmserving import APILLMServing_request

api_llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=100
)

```

可以通过如下方式定义本地LLM服务接口：

``` python
from dataflow.llmserving import LocalModelLLMServing

local_llm_serving = LocalModelLLMServing_vllm(
    hf_model_name_or_path="/data0/models/Qwen2.5-7B-Instruct",
    vllm_max_tokens=1024,
    vllm_tensor_parallel_size=4,
    vllm_gpu_memory_utilization=0.6,
    vllm_repetition_penalty=1.2
)
```

可以通过以下方式为算子进行存储接口预定义：

```python
from dataflow.utils.storage import FileStorage

self.storage = FileStorage(
    first_entry_file_name="your_file_path",
    cache_path="./cache",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl", # jsonl, json, ...
)
```

对于每个算子，下文将详细介绍其调用方式和参数列表。

## 详细算子说明

### 1. FileOrURLToMarkdownConverterBatch

**功能描述**：

   知识提取算子（FileOrURLToMarkdownConverterBatch）是一个多功能文档处理工具，支持从多种文件格式中提取结构化内容并转换为标准Markdown格式。该算子整合了多个专业解析引擎，实现高精度的文档内容转换。代码: [FileOrURLToMarkdownConverterBatch](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/knowledge_cleaning/generate/file_or_url_to_markdown_converter_batch.py)

   **输入参数**：

   - `__init__()`
     - `intermediate_dir`：中间文件输出目录（默认："intermediate"）
     - `lang`：文档语言（默认："ch"中文）
     - `mineru_backend`：mineru后端（默认：vlm_vllm_engine）

   - `run()`
     - `storage`：数据流存储接口对象（必须）

   **主要特性**：

   - **多格式支持**

     - **PDF文档**：
       - 使用MinerU解析引擎提取文本/表格/公式
       - 支持自动/TXT/OCR三种解析模式
       - 保留原始文档布局结构

     - **网页内容**：
       - 使用trafilatura提取正文内容
       - 自动过滤广告等无关元素
       - 保持超链接和基础排版

     - **纯文本**：
       - TXT/MD文件直接透传
       - 不做额外处理

   **高级功能**

   - 自动语言检测（中英文自动识别）
   - 支持本地文件和URL两种输入方式
   - 完善的错误处理和日志记录

**使用示例：**

```python
self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterBatch(
    intermediate_dir="../example_data/KBCleaningPipeline/raw/",
    lang="en",
    mineru_backend="vlm-vllm-engine",
)
self.knowledge_cleaning_step1.run(
    storage=self.storage.step(),
    # input_key=,
    # output_key=,
)
```



### 2. KBCChunkGenerator

**功能描述**：KBCChunkGenerator 是一个高效灵活的文本分块工具，专为处理大规模文本语料设计。该算子支持多种分块策略，可智能分割文本以适应不同NLP任务的需求，特别优化了RAG（检索增强生成）应用场景。代码:[KBCChunkGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/knowledge_cleaning/generate/kbc_chunk_generator.py)

**输入参数**：

- `__init__()`
  - `chunk_size`: 分块大小（默认512 tokens）
  - `chunk_overlap`: 块间重叠大小（默认50 tokens）
  - `split_method`: 分块方法（token/sentence/semantic/recursive）
  - `min_tokens_per_chunk`: 最小分块长度（默认128 tokens）
  - `tokenizer_name`: 使用的tokenizer名称（默认"bert-base-uncased"）

- `run()`
  - `storage`: 数据流存储接口对象
  - `input_file`: 输入文件路径
  - `output_key`: 输出字段名（默认"raw_content"）

**主要特性：**

- **多模式分块**

  - **Token分块**：基于tokenizer的精确分块

  - **句子分块**：保持句子完整性

  - **语义分块**：根据语义边界分割

  - **递归分块**：多粒度智能分割

- **智能处理**

  - 自动检测输入文件格式（TXT/JSON/JSONL/MD/XML）

  - 动态调整分块策略以适应不同长度文本

  - 内置token数计算和长度校验

  - 支持大文件自动分片处理

- **输出控制**

  - 可配置块间重叠

  - 确保最小分块长度

  - 保留原始文本结构

  - 生成带元数据的分块结果

**使用示例：**

```python
text_splitter = KBCChunkGenerator(
    split_method="token",
    chunk_size=512,
    tokenizer_name="Qwen/Qwen2.5-7B-Instruct",
)
text_splitter.run(
    storage=self.storage.step(),
    input_file=extracted,
    output_key="raw_content",
)
```



### 3. KBCTextCleaner

   **功能描述**：KBCTextCleaner 是一个专业的知识清洗算子，专门用于对RAG（检索增强生成）系统中的原始知识内容进行标准化处理。该算子通过大语言模型接口，实现对非结构化知识的智能清洗和格式化，提升知识库的准确性和可读性。代码:[KBCTextCleaner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/knowledge_cleaning/generate/kbc_text_cleaner.py)

   **输入参数**：

   `__init__()`

   - `llm_serving`: 大语言模型服务接口（必须）
   - `lang`: 处理语言（默认"ch"中文）

   `run()`

   - `storage`: 数据流存储接口对象
   - `input_key`: 输入字段名（默认"raw_content"）
   - `output_key`: 输出字段名（默认"cleaned"）

   **核心功能**：

   - **内容清洗**

     - **HTML/XML处理**：移除冗余标签，保留语义化标签（table/code/formula等），提取有意义的属性值
     - **文本规范化**：标准化引号（" "代替" "），统一破折号（-代替–/—），中英文省略号转换，保留技术符号（<< >>等操作符）
     - **链接处理**：移除超链接包装，保留显示文本，保持脚注URL完整

   - **结构优化**

     - 保持原始段落/列表换行

     - 保留代码/引用缩进层级

     - 压缩连续空行（最多2行）

     - 标记不完整代码块

   - **质量保证**

     - 事实性内容零修改

     - 专业术语保护

     - 表格结构保留

     - 隐私数据脱敏处理

   **使用示例：**

```python
text_cleaner = KBCTextCleaner(
    llm_serving=api_llm_serving,
    lang="en"
)
text_cleaner.run(
  storage=self.storage.step(),
  input_key= "raw_content",
  output_key="cleaned",
)
```

###    4. TextMultiHopQAGenerator

**功能描述**：MultiHopQAGenerator 是一个专业的多跳问答对生成算子，专门用于从文本数据中自动生成需要多步推理的问题-答案对。该算子通过大语言模型接口，实现对文本的智能分析和复杂问题构建，适用于构建高质量的多跳问答数据集。代码:[Text2MultiHopQAGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/core_text/generate/text2multihopqa_generator.py)

**输入参数**：

   `__init__()`

- `llm_serving`: 大语言模型服务接口（必须）
- `num_q`: 每个文段对应QA最大值（默认5）
- `seed`: 随机种子（默认0）
- `lang`: 处理语言（默认"en"英文）

`run()`

- `storage`: 数据流存储接口对象

- `input_key`: 输入字段名（默认"cleaned"）
- `output_key`: 输出字段名（默认"MultiHopQA"）

**核心功能**：

- **文本预处理**

  - 自动清理无效字符和空白
  - 执行长度检查
  - 质量验证（句子完整性、特殊字符比例）

- **信息抽取**

  - 智能分割文本为语义单元
  - 构建前提-中间-结论三元组
  - 提取相关上下文信息

- **问答生成**

  - 基于大语言模型的多跳问题构建
  - 自动生成推理步骤和支持事实
  - 输出结构化QA对（JSON格式）

- **质量控制**

  - 复杂度评分系统（0.0-1.0）
  - 自动去重机制
  - 错误恢复与日志记录

- **使用示例**

  ```python
  self.knowledge_cleaning_step4 = Text2MultiHopQAGenerator(
      llm_serving=self.llm_serving,
      lang="en",
      num_q = 5
  )
  self.knowledge_cleaning_step4.run(
      storage=self.storage.step(),
      # input_key=,
      # output_key=,
  )
  ```

  