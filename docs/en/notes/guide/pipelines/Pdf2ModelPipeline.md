---
title: Pdf2ModelPipeline
createTime: 2025/08/30 14:27:01
permalink: /en/guide/yu798e6s/
---
# DataFlow-pdf2model & LlaMA-Factory

## Quick Start

```bash
conda create -n dataflow python=3.10
conda activate dataflow
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
pip install -e .[mineru]
pip install llamafactory[torch,metrics]
pip install open-dataflow[vllm]

mineru-models-download

cd ..
mkdir test
cd test

# Initialize
dataflow pdf2model init

# Train
dataflow pdf2model train

# Chat with the trained model, or chat with locally trained models
dataflow chat
```



## Step 1: Install DataFlow Environment

```bash
conda create -n dataflow python=3.10
conda activate dataflow

cd DataFlow

pip install -e .[mineru]

pip install llamafactory[torch,metrics]
pip install open-dataflow[vllm]
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

After initialization is complete, the project directory becomes:

```shell
Project Root/
├── Pdf2QAPipeline.py  # pipeline execution file
└── .cache/            # cache directory
    └── train_config.yaml  # default config file for llamafactory training
```



## Step 5: One-Click Fine-tuning

```bash
# --lf_yaml can specify the path to the llamafactory yaml parameter file for training (optional)
# Default value is .cache/train_config.yaml
dataflow pdf2model train
```

After fine-tuning is complete, the project directory becomes:

```
Project Root/
├── Pdf2QAPipeline.py  # pipeline execution file
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
    │   └── sample-1-7/auto/
    └── saves/
        └── qwen2.5_7b_sft_model/
```



## **Step 6: Chat with Fine-tuned Model**

```bash
# Method 1: Specify model path with --model flag (optional)
# Default path: .cache/saves/pdf2model_cache_{timestamp}
dataflow chat --model ./custom_model_path

# Method 2: Navigate to model directory and run dataflow chat
cd .cache/saves/pdf2model_cache_20250901_143022
dataflow chat
```