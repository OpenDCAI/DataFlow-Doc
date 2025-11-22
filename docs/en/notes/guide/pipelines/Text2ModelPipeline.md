---
title: Text2ModelPipeline
createTime: 2025/08/31 03:42:49
permalink: /en/guide/uw6hfcwp/
---
# DataFlow-text2model & LlamaFactory

A complete text processing and training pipeline with intelligent Text2QA generation capabilities.

## Quick Start

```bash
# Environment setup
conda create -n dataflow python=3.10
conda activate dataflow
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .
pip install llamafactory[torch,metrics]
pip install open-dataflow[vllm]
# Model download
# First option: choose either one
# Second option: select all
mineru-models-download

# Run program
cd ..
mkdir test
cd test

# Initialize
dataflow text2model init

# Train
dataflow text2model train

# Chat with trained model, or chat with local trained model
dataflow chat
```



## Step 1: Install DataFlow Environment

```bash
# Create environment
conda create -n dataflow python=3.10

# Activate environment
conda activate dataflow

# Enter root directory
cd DataFlow

# Install mineru base environment
pip install -e .

# Install llamafactory environment
pip install llamafactory[torch,metrics]
pip install open-dataflow[vllm]
mineru-models-download
```



## Step 2: Create New DataFlow Working Folder

```bash
mkdir run_dataflow
cd run_dataflow
```



## Step 3: Setup Dataset

Place appropriately sized dataset (data files in JSON or JSONL format) into the working folder.



## Step 4: Initialize DataFlow-text2model

```bash
# Initialize
# --cache can specify .cache directory location (optional)
# Default value is current folder directory
dataflow text2model init
```

After initialization, the project directory becomes:

```
Project Root/
├── text_2_qa_pipeline.py     # Text2QA generation pipeline
└── .cache/                   # Cache directory
    └── train_config.yaml     # Default configuration file for llamafactory training
```



## Step 5: One-Click Fine-tuning

```bash
# --lf_yaml can specify the path of llamafactory yaml parameter file for training (optional)
# Default value is .cache/train_config.yaml
# --input-keys can specify fields to detect in json files
# Default value is text
dataflow text2model train
```

After fine-tuning completion, the project directory becomes:

```
Project Root/
├── text_2_qa_pipeline.py     # Text2QA generation
└── .cache/                   # Cache directory
    ├── train_config.yaml     # Default configuration file for llamafactory training
    ├── pt_input.jsonl        # Merged input data
    ├── data/
    │   ├── dataset_info.json
    │   └── qa.json
    ├── gpu/
    │   ├── text_input.jsonl          # Text2QA input file (if using Text2QA)
    │   ├── text2qa_step_step1.json
    │   ├── text2qa_step_step2.json
    │   ├── text2qa_step_step3.json   # Text2QA output
    │   └── sft_dataflow_cache_step_*.jsonl  # SFT processing files
    └── saves/
        └── text2model_cache_{time}/
```



## **Step 6: Chat with Fine-tuned Model**

```bash
# Method 1: Specify model path with --model flag (optional)
# Default path: .cache/saves/text2model_cache_{timestamp}
dataflow chat --model ./custom_model_path

# Method 2: Navigate to model directory and run dataflow chat
cd .cache/saves/text2model_cache_{timestamp}
dataflow chat
```