---
title: Pdf-to-Model模型微调流水线
createTime: 2025/08/30 14:27:02
icon: solar:cpu-bolt-linear
permalink: /zh/guide/i2pk9pwh/
---
# Pdf-to-Model模型微调流水线

## 快速开始

```bash
conda create -n dataflow python=3.10
conda activate dataflow
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
#环境准备
pip install -e .[pdf2model]
# 支持mineru2.5 如果仅想运行pipeline backend 可不下载whl文件，直接跳到模型准备
wget https://github.com/Dao-AILab/flash-attention/releases/download/v2.8.3/flash_attn-2.8.3+cu121torch2.4cxx11abiTRUE-cp310-cp310-linux_x86_64.whl

pip install flash_attn-2.8.3+cu121torch2.4cxx11abiTRUE-cp310-cp310-linux_x86_64.whl
#模型准备
mineru-models-download

cd ..
mkdir run_dataflow
cd run_dataflow

#初始化 
dataflow pdf2model init

#训练
dataflow pdf2model train

#与训练好的模型进行对话,也可以与本地训练好的模型对话
dataflow chat
```



## 第一步: 安装dataflow环境

```bash
conda create -n dataflow python=3.10
conda activate dataflow

cd DataFlow
pip install -e .[pdf2model]

# 支持mineru2.5 如果仅想运行pipeline backend 可不下载whl文件，直接跳到模型准备
# 下载flan-attn whl文件 需要根据环境来下载相应的whl
# 例如 环境是python3.10 torch2.4 cuda12.1 https://github.com/Dao-AILab/flash-attention/releases/download/v2.8.3/flash_attn-2.8.3+cu121torch2.4cxx11abiTRUE-cp310-cp310-linux_x86_64.whl
# 版本选择网址:https://github.com/Dao-AILab/flash-attention/releases
wget https://github.com/Dao-AILab/flash-attention/releases/download/v2.8.3/flash_attn-2.8.3+cu121torch2.4cxx11abiTRUE-cp310-cp310-linux_x86_64.whl

pip install flash_attn-2.8.3+cu121torch2.4cxx11abiTRUE-cp310-cp310-linux_x86_64.whl
```



## 第二步: 创建新的dataflow工作文件夹

```bash
#退出项目根目录
cd ..
mkdir run_dataflow
cd run_dataflow
```



## 第三步: 设置数据集

将合适大小的数据集(数据文件为pdf格式)放到工作文件夹中



## 第四步: 初始化dataflow-pdf2model

```bash
#初始化 
#--cache 可以指定.cache目录的位置（可选）
#默认值为当前文件夹目录
dataflow pdf2model init
```

💡初始化完成后，项目目录变成：

```bash
项目根目录/
├── pdf_to_qa_pipeline.py  # pipeline执行文件
└── .cache/            # 缓存目录
    └── train_config.yaml  # llamafactory训练的默认配置文件
```



## 第五步: 一键微调

```bash
#--lf_yaml 可以指定训练所用llamafactory的yaml参数文件所在的路径(可选)
#默认值为.cache/train_config.yaml
dataflow pdf2model train
```

💡微调完成完成后，项目目录变成类似结构：

```bash
项目根目录/
├── pdf_to_qa_pipeline.py  # pipeline执行文件
└── .cache/            # 缓存目录
    ├── train_config.yaml  # llamafactory训练的默认配置文件
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



## 第六步: 与微调好的模型对话

```bash
#用法一:--model 可以指定 对话模型的路径位置（可选）
#默认值为.cache/saves/pdf2model_cache_{timestamp}
dataflow chat --model ./custom_model_path

#用法二:在工作文件夹下 运行dataflow chat
dataflow chat
```
