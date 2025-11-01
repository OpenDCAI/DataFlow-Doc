---
title: PDF-to-Model Model Simulation Pipeline
createTime: 2025/08/30 14:27:01
icon: solar:cpu-bolt-linear
permalink: /en/guide/yu798e6s/
---
# PDF-to-Model Model Simulation Pipeline

This pipeline is designed to help beginners quickly get started with fine-tuning models using PDF documents.

## 1.Overview

The **Pdf-to-Model Fine-tuning Pipeline** is an end-to-end solution for large language model training, providing fully automated services from raw documents to deployable domain-specific models. The pipeline transforms heterogeneous-format, high-noise PDF documents into high-quality Multi-Hop QA training data, and performs parameter-efficient fine-tuning of large models to achieve precise question-answering capabilities in specific domains.

The pipeline integrates advanced document processing technologies (MinerU, trafilatura), intelligent knowledge cleaning methods, and efficient fine-tuning strategies. It significantly enhances model performance in vertical domains while maintaining the general capabilities of base models. According to MIRIAD experimental validation, models trained with Multi-Hop QA format demonstrate excellent performance in complex question-answering scenarios requiring multi-step reasoning.

**Supported Input Formats**: PDF, Markdown, HTML, URL webpages

**Output Model**: Adapter (compatible with any Qwen/Llama series base model)

### Main Pipeline Workflow

The Pdf-to-Model pipeline consists of two phases: initialization and execution, with the execution phase comprising 5 core steps:

#### Initialization Phase (dataflow pdf2model init)

Automatically generates training configuration file (train_config.yaml) and customizable data processing scripts, configuring default LoRA fine-tuning parameters, dataset paths, and model output directories.

#### Execution Phase (dataflow pdf2model train)

1. **Document Discovery**: Automatically scans specified directories to identify all PDF files and generate an index list.
2. **Knowledge Extraction and Cleaning**: Extracts textual information from PDF/Markdown/HTML/URL using tools like MinerU and trafilatura, performs intelligent segmentation via chonkie, and cleans and normalizes raw text by addressing redundant tags, format errors, and privacy information. *(This step reuses the complete workflow of the knowledge base cleaning pipeline)*
3. **QA Data Generation**: Utilizes a sliding window of three sentences to transform the cleaned knowledge base into a series of Multi-Hop QA pairs requiring multi-step reasoning, and converts them into LlamaFactory standard training format.
4. **Fine-tuning**: Based on the generated QA data, uses LoRA (Low-Rank Adaptation) method to perform parameter-efficient fine-tuning of the base model, training model parameters and outputting a domain-specific model adapter ready for deployment.

#### Testing Phase (dataflow chat)

**Model Dialogue Testing**: Automatically loads the latest trained adapter and corresponding base model, launches an interactive dialogue interface, and supports real-time testing of model performance on domain-specific knowledge Q&A. Users can also specify a particular model path for testing using the `--model` parameter.



## 2.Quick Start

```bash
conda create -n dataflow python=3.10
conda activate dataflow
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
#prepare environment
pip install -e .[llamafactory]
# Supports mineru2.5. If you only want to run the pipeline backend, you can skip downloading the whl file and proceed directly to model preparation.
wget https://github.com/Dao-AILab/flash-attention/releases/download/v2.8.3/flash_attn-2.8.3+cu121torch2.4cxx11abiTRUE-cp310-cp310-linux_x86_64.whl

pip install flash_attn-2.8.3+cu121torch2.4cxx11abiTRUE-cp310-cp310-linux_x86_64.whl

#prepare models
mineru-models-download

cd ..
mkdir run_dataflow
cd run_dataflow

# Initialize
dataflow pdf2model init

# Train
dataflow pdf2model train

# Chat with the trained model, or chat with locally trained models in workspace directory
dataflow chat
```



## 3. Pipeline Design

### Step 1: Install DataFlow Environment

```bash
conda create -n dataflow python=3.10
conda activate dataflow

cd DataFlow

pip install -e .[llamafactory]

# Supports mineru2.5. If you only want to run the pipeline backend, you can skip downloading the whl file and proceed directly to model preparation
# Download flash-attn whl file. You need to download the corresponding whl based on your environment
# For example, if your environment is python3.10 torch2.4 cuda12.1 https://github.com/Dao-AILab/flash-attention/releases/download/v2.8.3/flash_attn-2.8.3+cu121torch2.4cxx11abiTRUE-cp310-cp310-linux_x86_64.whl
# Version selection URL: https://github.com/Dao-AILab/flash-attention/releases
wget https://github.com/Dao-AILab/flash-attention/releases/download/v2.8.3/flash_attn-2.8.3+cu121torch2.4cxx11abiTRUE-cp310-cp310-linux_x86_64.whl

pip install flash_attn-2.8.3+cu121torch2.4cxx11abiTRUE-cp310-cp310-linux_x86_64.whl
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
dataflow pdf2model init
```

After initialization is complete, the project directory becomes:

```bash
Project Root/
├── pdf_to_qa_pipeline.py  # pipeline execution file
└── .cache/            # cache directory
    └── train_config.yaml  # default config file for llamafactory training
```



### Step 5: Set Parameters

🌟 **Display common and important parameters:**

```python
self.storage = FileStorage(
    first_entry_file_name=str(cache_path / ".cache" / "gpu" / "pdf_list.jsonl"),
    cache_path=str(cache_path / ".cache" / "gpu"),
    file_name_prefix="batch_cleaning_step",  # Prefix for created files
    cache_type="jsonl",  # Type of created files
)

self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterBatch(
    intermediate_dir=str(cache_path / ".cache"),
    lang="en",
    mineru_backend="vlm-vllm-engine",  # Options: pipeline, vlm-vllm-engine, vlm-vllm-transformer
)

self.knowledge_cleaning_step2 = KBCChunkGeneratorBatch(
    split_method="token",  # Specify the splitting method
    chunk_size=512,  # Specify the chunk size
    tokenizer_name="./Qwen2.5-7B-Instruct",  # Path to the tokenizer model
)

self.extract_format_qa = QAExtractor(
    qa_key="qa_pairs",
    output_json_file="./.cache/data/qa.json",
)
```



### Step 6: One-Click Fine-tuning

```bash
# One-Click Fine-tuning: Directly launch the cleaning + fine-tuning functionality
dataflow pdf2model train
```

After fine-tuning is complete, the project directory becomes:

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