---
title: Knowledge Base Construction and QA Operators
createTime: 2025/06/24 11:43:42
permalink: /en/guide/Knowledgebase_QA_operators/
---

# Knowledge Base Construction and QA Operators

## Overview

The Knowledge Base Cleaning Operator is designed for knowledge extraction, organization, and refinement for downstream tasks such as RAG, RARE, and RAFT. It mainly includes: **Knowledge Extractor Operator**, **Corpus Text Splitter Operator**, **Knowledge Cleaner Operator** and **Multi-Hop QA Generation Operator**. These operators can be used to process various raw file formats and crawl web content from specific URLs, organizing this textual knowledge into readable, easy-to-use, and secure RAG knowledge bases.

The operator notation in this document inherits from [Reasoning Operators](https://opendcai.github.io/DataFlow-Doc/zh/guide/Reasoning_operators/).
🚀 Independent Innovation: Core algorithms are originally developed, either filling gaps in existing algorithms or further improving performance to break through current bottlenecks.

✨ Open-Source Premiere: The operator is integrated into mainstream community frameworks for the first time, making it more accessible to developers and promoting open-source sharing.

## Knowledge Base Cleaning Operator

The Knowledge Base Cleaning Operator can perform extraction, organization, and cleaning tasks for multiple heterogeneous text knowledge sources.

| Name                  | Applicable Type | Description                                                  | Official Repository/Paper                              |
| --------------------- | :-------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| KnowledgeExtractor🚀✨ | Knowledge Extraction | This operator extracts various heterogeneous text knowledge into markdown format for subsequent processing. | -                                                      |
| CorpusTextSplitter✨   | Corpus Segmentation | This operator provides multiple methods to split full texts into appropriately sized segments for subsequent operations like indexing. | -                                                      |
| KnowledgeCleaner🚀✨    | Knowledge Cleaning | This operator uses LLM to clean organized raw text, including but not limited to normalization and privacy removal. | -                                                      |
| MultiHopQAGenerator🚀✨ | Knowledge Paraphrasing | This operator uses a three-sentence sliding window to paraphrase cleaned knowledge bases into a series of multi-step reasoning QAs, which better facilitates accurate RAG reasoning. | [MIRAID](https://github.com/eth-medical-ai-lab/MIRIAD) |



## Operator Interface Usage Instructions

Specifically, for operators that require specified storage paths or model invocations, we provide encapsulated **model interfaces** and **storage object interfaces**. You can define an LLM API interface in the following way:

``` python
from dataflow.llmserving import APILLMServing_request

api_llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=100
)

```

You can define a local LLM service interface as follows:

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

You can predefine a storage interface for operators in the following way:

``` python
from dataflow.utils.storage import FileStorage

self.storage = FileStorage(
    first_entry_file_name="your_file_path",
    cache_path="./cache",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl", # jsonl, json, ...
)
```

For each operator, the following sections will detail its invocation methods and parameter lists.



## Detailed Operator Specifications

### 1. FileOrURLToMarkdownConverter

**Functional Description**:

The Knowledge Extractor operator is a versatile document processing tool that supports extracting structured content from multiple file formats and converting it to standard Markdown format. This operator integrates multiple professional parsing engines to achieve high-precision document content conversion.

**Input Parameters**:

- `__init__()`
  - `intermediate_dir`: Intermediate file output directory (default: "intermediate")
  - `lang`: Document language (default: "ch" for Chinese)
  - `raw_file`: Local file path (mutually exclusive with url)
  - `url`: Web URL address (mutually exclusive with raw_file)
  
- `run()`
  - `storage`: Data flow storage interface object (required)


**Key Features**:

- Multi-format Support
  - **PDF Documents**:
    - Uses MinerU parsing engine to extract text/tables/formulas
    - Supports three parsing modes: auto/TXT/OCR
    - Preserves original document layout structure
  - **Web Content**:
    - Uses trafilatura to extract main content
    - Automatically filters irrelevant elements like ads
    - Maintains hyperlinks and basic formatting
  - **Plain Text**:
    - Directly passes through TXT/MD files
    - No additional processing

**Advanced Features**:

- Automatic language detection (Chinese/English)
- Supports both local files and URL inputs
- Comprehensive error handling and logging

**Usage Example**:

```python
file_to_markdown_converter = FileOrURLToMarkdownConverter(
    intermediate_dir="../example_data/KBCleaningPipeline/raw/",
    lang="en",
    mineru_backend="vlm-sglang-engine",
    raw_file = raw_file,
)
extracted=file_to_markdown_converter.run(
    storage=self.storage,
)
```


### 2. CorpusTextSplitter

**Functional Description**:
 CorpusTextSplitter is an efficient and flexible text chunking tool specifically designed for processing large-scale text corpora. This operator supports multiple chunking strategies to intelligently segment text for various NLP tasks, with special optimization for RAG (Retrieval-Augmented Generation) applications.

**Input Parameters**:

- `__init__()`
  - `chunk_size`: Chunk size (default: 512 tokens)
  - `chunk_overlap`: Overlap size between chunks (default: 50 tokens)
  - `split_method`: Chunking method (`token`/`sentence`/`semantic`/`recursive`)
  - `min_tokens_per_chunk`: Minimum chunk length (default: 128 tokens)
  - `tokenizer_name`: Tokenizer name (default: `"bert-base-uncased"`)
- `run()`
  - `storage`: Data flow storage interface object
  - `input_file`: Input file path
  - `output_key`: Output field name (default: `"raw_content"`)

**Key Features**:

- **Multi-mode Chunking**
  - **Token-based**: Precise chunking using tokenizer
  - **Sentence-based**: Preserves sentence integrity
  - **Semantic-based**: Segments at semantic boundaries
  - **Recursive**: Multi-granularity intelligent segmentation
- **Smart Processing**
  - Auto-detects input file formats (TXT/JSON/JSONL/MD/XML)
  - Dynamically adjusts chunking strategy for different text lengths
  - Built-in token counting and length validation
  - Supports automatic sharding for large files
- **Output Control**
  - Configurable chunk overlap
  - Ensures minimum chunk length
  - Preserves original text structure
  - Generates chunked results with metadata

**Usage Example**:

```python
text_splitter = CorpusTextSplitter(
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


### 3. KnowledgeCleaner

**Functional Description**:
KnowledgeCleaner is a professional knowledge cleaning operator specifically designed for standardizing raw content in RAG (Retrieval-Augmented Generation) systems. By leveraging large language model interfaces, it intelligently cleans and formats unstructured knowledge to enhance the accuracy and readability of knowledge bases.

**Input Parameters**:

- `__init__()`
  - `llm_serving`: Large language model service interface (required)
  - `lang`: Processing language (default: "ch" for Chinese)
- `run()`
  - `storage`: Data flow storage interface object
  - `input_key`: Input field name (default: "raw_content")
  - `output_key`: Output field name (default: "cleaned")

**Core Features**:

- Content Cleaning
  - Removes redundant HTML/XML tags while preserving semantic tags (table/code/formula) and meaningful attributes
  - Standardizes text formatting: normalizes quotes (" "), unifies dashes (-), converts ellipses, preserves technical symbols (<< >>)
  - Processes hyperlinks: removes wrapper markup while preserving display text and footnote URLs
- **Structure Optimization**
  - Preserves original paragraph/list line breaks
  - Maintains code/quote indentation levels
  - Compresses consecutive empty lines (max 2 lines)
  - Marks incomplete code blocks
- **Quality Assurance**
  - Zero modification of factual content
  - Protection of professional terminology
  - Preservation of table structures
  - Privacy data anonymization

**Usage Example**:

```python
knowledge_cleaner = KnowledgeCleaner(
    llm_serving=api_llm_serving,
    lang="en"
)
extracted_path = knowledge_cleaner.run(
  storage=self.storage.step(),
  input_key= "raw_content",
  output_key="cleaned",
)
```

###    4. MultiHopQAGenerator

**Function Description**: MultiHopQAGenerator is a professional multi-hop QA pair generation operator, specifically designed to automatically generate question-answer pairs requiring multi-step reasoning from text data. Through its large language model interface, this operator performs intelligent text analysis and complex question construction, making it suitable for building high-quality multi-hop QA datasets.

**Input Parameters**:

   `__init__()`

- `llm_serving`: Large language model service interface (required)
- `seed`: Random seed (default 0)
- `lang`: Processing language (default "en" for English)

   `run()`

- `storage`: Data flow storage interface object
- `input_key`: Input field name (default "")
- `output_key`: Output field name (default "")

**Core Features**:

- **Text Preprocessing**
  - Automatic cleaning of invalid characters and whitespace
  - Length validation (100-200,000 characters)
  - Quality verification (sentence completeness, special character ratio)
- **Information Extraction**
  - Intelligent segmentation of text into semantic units
  - Construction of premise-intermediate-conclusion triples
  - Extraction of relevant contextual information
- **QA Generation**
  - Large language model-based multi-hop question construction
  - Automatic generation of reasoning steps and supporting facts
  - Output of structured QA pairs (JSON format)
- **Quality Control**
  - Complexity scoring system (0.0-1.0)
  - Automatic deduplication mechanism
  - Error recovery and logging

  **Usage Example**:

    ```python
  multi_hop_qa_generator = MultiHopQAGenerator(
      llm_serving=local_llm_serving,
      lang="en"
  )
  multi_hop_qa_generator.run(
      storage=self.storage.step(),
      input_key="cleaned",
      output_key="MultiHop_QA"
  )
  ```