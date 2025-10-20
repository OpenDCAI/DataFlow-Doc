---
title: PDF-to-Model Model Simulation Pipeline
createTime: 2025/08/30 14:27:01
icon: solar:cpu-bolt-linear
permalink: /en/guide/yu798e6s/
---
# PDF-to-Model Model Simulation Pipeline

## Quick Start

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



## Step 1: Install DataFlow Environment

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



## Step 2: Create New DataFlow Working Directory

```bash
# Exit project root directory
cd ..
mkdir run_dataflow
cd run_dataflow
```



## Step 3: Setup Dataset

Place appropriately sized datasets (data files in PDF format) into the working directory.



## Step 4: Initialize dataflow-pdf2model



```bash
# Initialize
# --cache can specify the location of .cache directory (optional)
# Default value is current folder directory
dataflow pdf2model init
```

💡After initialization is complete, the project directory becomes:

```bash
Project Root/
├── pdf_to_qa_pipeline.py  # pipeline execution file
└── .cache/            # cache directory
    └── train_config.yaml  # default config file for llamafactory training
```



## Step 5: One-Click Fine-tuning

```bash
# --lf_yaml can specify the path to the llamafactory yaml parameter file for training (optional)
# Default value is .cache/train_config.yaml
dataflow pdf2model train
```

💡After fine-tuning is complete, the project directory becomes:

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



## **Step 6: Chat with Fine-tuned Model**

```bash
# Method 1: Specify model path with --model flag (optional)
# Default path: .cache/saves/pdf2model_cache_{timestamp}
dataflow chat --model ./custom_model_path

# Method 2: Navigate to workspace directory and run dataflow chat
dataflow chat
```