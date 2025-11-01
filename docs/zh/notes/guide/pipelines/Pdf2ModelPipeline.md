---
title: Pdf-to-Model模型微调流水线
createTime: 2025/08/30 14:27:02
icon: solar:cpu-bolt-linear
permalink: /zh/guide/i2pk9pwh/
---
# Pdf-to-Model模型微调流水线

该流水线是为了方便新手快速上手 用pdf来微调模型的流水线

## 1.概述

**Pdf-to-Model模型微调流水线** 是一个端到端的大模型训练解决方案，旨在从原始文档到可部署的领域专用模型，提供全流程自动化服务。该流水线通过将格式异构、信息噪声高的PDF文档转化为高质量的Multi-Hop QA训练数据，并基于此完成大模型的参数高效微调，使模型获得针对特定领域知识的精准问答能力。

流水线集成了先进的文档处理技术（MinerU、trafilatura）、智能知识清洗方法和高效微调策略，可在保持基座模型通用能力的同时，显著提升其在垂直领域的表现。根据MIRIAD实验验证，使用Multi-Hop QA格式训练的模型在需要多步推理的复杂问答场景中表现优异。

**支持的输入格式**：PDF、Markdown、HTML、URL网页

**输出模型**：适配器（可与任意Qwen/Llama系列基座模型组合使用）

### 流水线主要流程

Pdf-to-Model流水线分为**初始化**和**执行**两个阶段，执行阶段包含5个核心步骤：

#### 初始化阶段（dataflow pdf2model init）

自动生成训练配置文件（train_config.yaml）和可定制的数据处理脚本，配置默认的LoRA微调参数、数据集路径和模型输出目录。

#### 执行阶段（dataflow pdf2model train）

1. **文档发现**：自动扫描指定目录，识别所有PDF文件并生成索引列表。
2. **知识提取与清洗**：借助[MinerU](https://github.com/opendatalab/MinerU)、[trafilatura](https://github.com/adbar/trafilatura)等工具从PDF/Markdown/HTML/URL中提取文本信息，通过chonkie进行智能分段，从冗余标签、格式错误、隐私信息等角度对原始文本进行清洗和规范化。（*此步骤复用知识库清洗流水线的完整流程*）
3. **QA数据生成**：利用长度为三个句子的滑动窗口，将清洗好的知识库转写成一系列需要多步推理的Multi-Hop QA对，并转换为[LlamaFactory](https://github.com/hiyouga/LLaMA-Factory)标准训练格式。
4. **微调**：基于生成的QA数据，使用LoRA（低秩适配）方法对基座模型进行参数高效微调，训练模型参数，输出可直接部署的领域专用模型适配器。

#### 测试阶段（dataflow chat）

**模型对话测试**：自动加载最新训练的适配器和对应的基座模型，启动交互式对话界面，支持实时测试模型在领域知识问答上的表现。用户也可以通过 `--model` 参数指定特定的模型路径进行测试。



## 2.快速开始

```bash
conda create -n dataflow python=3.10
conda activate dataflow
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
#环境准备
pip install -e .[pdf2model]

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

## 3.流水线设计

#### 第一步: 安装dataflow环境

```bash
conda create -n dataflow python=3.10
conda activate dataflow

cd DataFlow
pip install -e .[pdf2model]
```



#### 第二步: 创建新的dataflow工作文件夹

```bash
#退出项目根目录
cd ..
mkdir run_dataflow
cd run_dataflow
```



#### 第三步: 设置数据集

将合适大小的数据集(数据文件为pdf格式)放到工作文件夹中



#### 第四步: 初始化dataflow-pdf2model

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



#### 第五步:设置参数

🌟展示常用且重要的参数:

```python
self.storage = FileStorage(
    first_entry_file_name=str(cache_path / ".cache" / "gpu" / "pdf_list.jsonl"),
    cache_path=str(cache_path / ".cache" / "gpu"),
    file_name_prefix="batch_cleaning_step",  #创建文件的前缀
    cache_type="jsonl",  #创建文件的类型
)

self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterBatch(
    intermediate_dir=str(cache_path / ".cache"),
    lang="en",
    mineru_backend="vlm-vllm-engine",  # 可选 pipeline, vlm-vllm-engine, vlm-vllm-transformer
)

self.knowledge_cleaning_step2 = KBCChunkGeneratorBatch(
    split_method="token", #指定分割的方法  
    chunk_size=512,    #指定chunk的大小
    tokenizer_name="./Qwen2.5-7B-Instruct", #tokenizer的模型路径
)

self.extract_format_qa = QAExtractor(
    qa_key="qa_pairs",
    output_json_file="./.cache/data/qa.json",
)
```



#### 第六步: 一键微调

```bash
#一键微调 直接启动清洗+微调的功能
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

#### 第七步: 与微调好的模型对话

```bash
#用法一:--model 可以指定 对话模型的路径位置（可选）
#默认值为.cache/saves/pdf2model_cache_{timestamp}
dataflow chat --model ./custom_model_path

#用法二:在工作文件夹下 运行dataflow chat
dataflow chat
```
