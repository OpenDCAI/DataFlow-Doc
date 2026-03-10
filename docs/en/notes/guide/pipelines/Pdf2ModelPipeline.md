---
title: PDF-to-Model Model Simulation Pipeline
createTime: 2025/08/30 14:27:01
icon: solar:cpu-bolt-linear
permalink: /en/guide/yu798e6s/
---
# PDF-to-Model Model Simulation Pipeline

This pipeline is designed to help beginners quickly get started with fine-tuning models using PDF documents.

## 1.Overview

The **Pdf-to-Model Fine-tuning Pipeline** is an end-to-end large language model training solution designed to provide fully automated services from raw documents to deployable domain-specific models. The pipeline transforms heterogeneous-format, high-noise PDF documents into high-quality training data and performs parameter-efficient fine-tuning of large models based on this data, enabling models to achieve precise question-answering capabilities for specific domain knowledge.

The pipeline integrates advanced document processing technologies (MinerU, trafilatura), intelligent knowledge cleaning methods, and efficient fine-tuning strategies. It significantly enhances model performance in vertical domains while maintaining the general capabilities of base models. According to MIRIAD experimental validation, models trained with Multi-Hop QA format demonstrate excellent performance in complex question-answering scenarios requiring multi-step reasoning.

**Document Parsing Engine**: MinerU1 and partial functionality of MinerU 2.5. This pipeline is now fully compatible with [Flash-MinerU](https://github.com/OpenDCAI/Flash-MinerU). Compared to the native MinerU engine, Flash-MinerU offers significant advantages in parsing speed and high-concurrency processing.

**Automated Format Conversion and Fine-tuning**: The pipeline supports two data extraction and preparation paradigms: KBC (Text-based Knowledge Base) and VQA (Multimodal Visual Question Answering).

- **KBC Mode**: Focused on plain-text data cleaning and QA synthesis. It utilizes the Alpaca format for model fine-tuning, making it ideal for text-centric knowledge base scenarios.
- **VQA Mode**: Focused on multimodal data cleaning and QA synthesis. It utilizes the ShareGPT format for model fine-tuning, specifically optimized for textbook-style PDFs (e.g., Mathematics, Physics, and Chemistry textbooks or exam papers).

**Supported Input Formats**: PDF, Markdown, HTML, URL webpages.

**Output Model**: Adapter (compatible with any Qwen/Llama series base model).

<!-- **Note**: Currently does not support MinerU 2.5 vlm-vllm-engine, as it requires a higher version of vLLM that is incompatible with the current latest version of LLaMA-Factory (primary conflict lies in transformers library version). -->



## 2.Quick Start

```bash
conda create -n dataflow python=3.10
conda activate dataflow
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
# prepare environment
pip install -e .[llamafactory]

#prepare models
mineru-models-download

cd ..
mkdir run_dataflow
cd run_dataflow

# Initialize
# KBC Mode: Initialize KBC knowledge cleaning pipeline (Default)
dataflow pdf2model init --qa="kbc"

# VQA Mode: Initialize VQA multimodal extraction pipeline (Optimized for textbooks/exams)
dataflow pdf2model init --qa="vqa"

# Train
dataflow pdf2model train

# Chat with the trained model, or chat with locally trained models in workspace directory
dataflow chat
```



## 3. Pipeline Design

### Main Pipeline Workflow

The Pdf-to-Model pipeline consists of two phases: initialization and execution, with the execution phase comprising 5 core steps:

#### Initialization Phase (dataflow pdf2model init)

Automatically generates a training configuration file (`train_config.yaml`) and customizable data processing scripts (`pdf_to_model_pipeline.py`), configuring default LoRA fine-tuning parameters, dataset paths, and model output directories.

- `--qa="kbc"` (Default): Generates a pipeline focused on knowledge cleaning. This workflow emphasizes long-range logical text cleaning, intelligent chunking, and the production of Alpaca format data.
- `--qa="vqa"`：Generates a pipeline focused on Visual Question Answering. This workflow leverages multimodal capabilities to parse charts, diagrams, and formulas within PDFs, producing ShareGPT format data.

#### Execution Phase (dataflow pdf2model train)

1. **Document Discovery**: Automatically scans specified directories to identify all PDF files and generate an index list.
2. **Knowledge Extraction and Cleaning**: Extracts textual information from PDF/Markdown/HTML/URL using tools like [MinerU](https://github.com/opendatalab/MinerU) and [trafilatura](https://github.com/adbar/trafilatura).
3. **QA Data Generation and Cleaning**：
   - KBC Mode: Performs refined cleaning of raw text (removing redundant tags, fixing formatting errors, and protecting sensitive information). It then utilizes a three-sentence sliding window to transform knowledge into Multi-Hop QA pairs requiring multi-step reasoning.
   - VQA Mode: Transforms complex raw data into LLM-understandable inputs. For high-value content like textbooks and exam papers, it uses multi-threaded API calls to extract high-quality QA pairs from multimodal page blocks.
4. **Data Format Conversion**: Converts the extracted QA data into Llama-Factory standard training formats (Alpaca or ShareGPT).
5. **Fine-tuning**: Based on the generated QA data, uses LoRA (Low-Rank Adaptation) method to perform parameter-efficient fine-tuning of the base model, training model parameters and outputting a domain-specific model adapter ready for deployment.

#### Testing Phase (dataflow chat)

**Model Dialogue Testing**: Automatically loads the latest trained adapter and corresponding base model, launches an interactive dialogue interface, and supports real-time testing of model performance on domain-specific knowledge Q&A. Users can also specify a particular model path for testing using the `--model` parameter.



### Step 1: Install DataFlow Environment

```bash
conda create -n dataflow python=3.10
conda activate dataflow

cd DataFlow
pip install -e .[pdf2model]
```



### Step 2: Create New DataFlow Working Directory

```bash
# Exit project root directory
cd ..
mkdir run_dataflow
cd run_dataflow
```



### Step 3: Setup Dataset

Place appropriately sized datasets (data files in PDF format) into the working directory.



### Step 4: Initialize dataflow-pdf2model



```bash
# Initialize
# --cache can specify the location of .cache directory (optional)
# Default value is current folder directory
# Initialize with KBC mode (Default)
dataflow pdf2model init --qa="kbc"

# Initialize with VQA mode (For textbooks/exams)
dataflow pdf2model init --qa="vqa"
```

💡After initialization is complete, the project directory becomes:

```bash
Project Root/
├── pdf_to_qa_pipeline.py  # pipeline execution file
└── .cache/            # cache directory
    └── train_config.yaml  # default config file for llamafactory training
```



### Step 5: Set Parameters

🌟 Display common and important parameters:

#### Mode A: KBC Knowledge Cleaning (Default Mode)

```python
self.storage = FileStorage(
    first_entry_file_name="./.cache/pdf_list.jsonl", # Set the path for the default generated pdf_list.json
    cache_path=str(cache_path / ".cache" / "gpu"),
    file_name_prefix="batch_cleaning_step",  # Prefix for created files
    cache_type="jsonl",  # Format of created files
)

# Flash-MinerU Backend (Recommended)
self.mineru_executor = FileOrURLToMarkdownConverterFlash(
    intermediate_dir="../example_data/PDF2VQAPipeline/flash/",
    mineru_model_path="<your Model Path>/MinerU2.5-2509-1.2B",  # !!! place your local model path here !!!
    # https://huggingface.co/opendatalab/MinerU2.5-2509-1.2B.
    batch_size=4, # batchsize per vllm worker
    replicas=1,   # num of vllm workers
    num_gpus_per_replica=0.5, # for ray to schedule vllm workers to GPU, can be float, e.g. 0.5 means each worker uses half GPU, 1 means each worker uses whole GPU
    engine_gpu_util_rate_to_ray_cap=0.9 # actuall GPU utilization for each worker; acturall memory per worker= num_gpus_per_replica * engine_gpu_util_rate_to_ray_cap; this is to avoid OOM, you can set it to 0.9 or 0.8 to leave some buffer for other processes on
)

self.knowledge_cleaning_step2 = KBCChunkGeneratorBatch(
    split_method="token", # Specify the splitting method  
    chunk_size=512,    # Specify the chunk size
    tokenizer_name="./Qwen2.5-7B-Instruct", # Path to the tokenizer model
)

self.knowledge_cleaning_step3 = KBCTextCleaner(
    llm_serving=self.llm_serving,
    lang="en"
)

self.knowledge_cleaning_step4 = Text2MultiHopQAGenerator(
    llm_serving=self.llm_serving,
    lang="en",
    num_q = 5
)

self.extract_format_qa_step5 = QAExtractor(
    qa_key="qa_pairs",
    output_json_file="./.cache/data/qa.json", # Path for the output dataset
)
```

For a more comprehensive guide on parameter settings, please refer to the descriptions in [Case 8. Converting Massive PDFs to QAs](../quickstart/knowledge_cleaning.md).

#### Mode B: VQA Data Extraction

```python
self.storage = FileStorage(
    first_entry_file_name="./.cache/pdf_list.jsonl", # Set the path for the default generated pdf_list.json
    cache_path="./cache",
    file_name_prefix="vqa", # Prefix for created files
    cache_type="jsonl", # Format of created files
)

self.llm_serving = APILLMServing_request(
    api_url="http://<YOUR_SERVER_IP>:3000/v1/chat/completions", # API endpoint path
    key_name_of_api_key="DF_API_KEY",
    model_name="gemini-2.5-pro", # Ensure the API node supports this model
    max_workers=100,
)

self.vqa_extract_prompt = QAExtractPrompt()

self.pdf_merger = PDF_Merger(output_dir="./cache")

# Flash-MinerU Backend (Recommended)
self.mineru_executor = FileOrURLToMarkdownConverterFlash(
    intermediate_dir="../example_data/PDF2VQAPipeline/flash/",
    mineru_model_path="<your Model Path>/MinerU2.5-2509-1.2B",  # !!! place your local model path here !!!
    # https://huggingface.co/opendatalab/MinerU2.5-2509-1.2B.
    batch_size=4, # batchsize per vllm worker
    replicas=1,   # num of vllm workers
    num_gpus_per_replica=0.5, # for ray to schedule vllm workers to GPU, can be float, e.g. 0.5 means each worker uses half GPU, 1 means each worker uses whole GPU
    engine_gpu_util_rate_to_ray_cap=0.9 # actuall GPU utilization for each worker; acturall memory per worker= num_gpus_per_replica * engine_gpu_util_rate_to_ray_cap; this is to avoid OOM, you can set it to 0.9 or 0.8 to leave some buffer for other processes on
)

self.input_formatter = MinerU2LLMInputOperator()

self.vqa_extractor = ChunkedPromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt = self.vqa_extract_prompt.build_prompt(),
    max_chunk_len=128000,
)
self.llm_output_parser = LLMOutputParser(
    output_dir="./cache", intermediate_dir="intermediate"
)

self.qa_merger = QA_Merger(
    output_dir="./cache", strict_title_match=False
)

self.vqa_format_converter = VQAFormatter(
    output_json_file="./.cache/data/qa.json", # Path for the output dataset
)
```

For a more comprehensive guide on parameter settings, please refer to the descriptions in [Case 7. PDF VQA Extraction Pipeline](../quickstart/PDFVQAExtract.md).

**Note**：You must configure API credentials to invoke the LLM API. These credentials can be obtained from your LLM provider (e.g., OpenAI, Google Gemini, etc.). Set them as environment variables:

```shell
export DF_API_KEY="sk-xxxxx"
```

```shell
$env:DF_API_KEY = "sk-xxxxx"
```

### Step 6: One-Click Fine-tuning

```bash
# One-Click Fine-tuning: Directly launch the cleaning + fine-tuning functionality
dataflow pdf2model train
```

💡After fine-tuning is complete, the project directory will reflect a structure similar to the following (based on the `--qa="kbc"` configuration):

```bash
Project Root/
├── pdf_to_qa_pipeline.py  # pipeline execution file
└── .cache/            # cache directory
    ├── train_config.yaml  # default config file for llamafactory training
    ├── data/
    │   ├── dataset_info.json
    │   └── qa.json
    ├── gpu/
    │   ├── batch_cleaning_step_step1.json
    │   ├── batch_cleaning_step_step2.json
    │   ├── batch_cleaning_step_step3.json
    │   ├── batch_cleaning_step_step4.json
    │   ├── batch_cleaning_step_step5.json
    │   └── pdf_list.jsonl
    ├── mineru/
    │   └── sample/auto/
    └── saves/
        └── pdf2model_cache_{timestamp}/
```



### **Step 7: Chat with Fine-tuned Model**

```bash
# Method 1: Specify model path with --model flag (optional)
# Default path: .cache/saves/pdf2model_cache_{timestamp}
dataflow chat --model ./custom_model_path

# Method 2: Navigate to workspace directory and run dataflow chat
dataflow chat
```