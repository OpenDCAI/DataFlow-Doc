---
title: Pdf-to-Model模型微调流水线
createTime: 2025/08/30 14:27:02
icon: solar:cpu-bolt-linear
permalink: /zh/guide/i2pk9pwh/
---
# Pdf-to-Model 模型微调流水线

该流水线是为了方便新手快速上手 用pdf来微调模型的流水线

## 1.概述

**Pdf-to-Model 模型微调流水线** 是一个端到端的大模型训练解决方案，旨在从原始文档到可部署的领域专用模型，提供全流程自动化服务。该流水线通过将格式异构、信息噪声高的PDF文档转化为高质量的QA训练数据，并基于此完成大模型的参数高效微调，使模型获得针对特定领域知识的精准问答能力。

流水线集成了先进的文档处理技术（MinerU、trafilatura）、智能知识清洗方法和高效微调策略，可在保持基座模型通用能力的同时，显著提升其在垂直领域的表现。根据 MIRIAD 实验验证，使用 QA 格式训练的模型在需要多步推理的复杂问答场景中表现优异。

**文档解析引擎**：MinerU1 及 MinerU2.5 部分功能。目前本流水线现已适配 [Flash-MinerU](https://github.com/OpenDCAI/Flash-MinerU)，相比原生的 MinerU 引擎，Flash-MinerU 在解析速度与高并发处理上具有显著优势。

**自动化格式转换与微调**：流水线同时支持进行 KBC（纯文本知识库）与 VQA（多模态视觉问答）两个模式的数据提取与准备范式。

- **KBC 模式**：纯文本数据清洗和 QA 合成，并以 Alpaca 格式数据进行模型微调，尤其适合纯文本知识库情境。
- **VQA 模式**：多模态数据清洗和 QA 合成，并以 ShareGPT 格式数据进行模型微调，尤其适合教材类 PDF （如数学 / 物理 / 化学等学科教科书和试题）。

**支持的输入格式**：PDF、Markdown、HTML、URL 网页。

**输出模型**：适配器（可与任意基座模型组合使用）。

<!-- **注意**：当前并不支持MinerU2.5 vlm-vllm-engine 因为其需要的高版本的vllm并不兼容现阶段最高版本的LLaMA-Factory(主要冲突在于transformers) -->


## 2.快速开始

```bash
conda create -n dataflow python=3.10
conda activate dataflow
git clone https://github.com/OpenDCAI/DataFlow.git
cd DataFlow
# 环境准备
pip install -e .[pdf2model]

# 模型准备
mineru-models-download

cd ..
mkdir run_dataflow
cd run_dataflow

# 初始化
# KBC 模式: 初始化 KBC 知识清洗流水线 (默认)
dataflow pdf2model init --qa="kbc"

# VQA 模式: 初始化 VQA 多模态提取流水线 (针对教科书/试题)
dataflow pdf2model init --qa="vqa"

# 训练
dataflow pdf2model train

# 与训练好的模型进行对话,也可以与本地训练好的模型对话
dataflow chat
```



## 3.流水线设计

### 流水线主要流程

Pdf-to-Model  流水线分为**初始化**和**执行**两个阶段：

#### 初始化阶段（dataflow pdf2model init）

自动生成训练配置文件（`train_config.yaml`）和可定制的数据处理脚本（`pdf_to_model_pipeline.py`），配置默认的 LoRA 微调参数、数据集路径和模型输出目录。

- `--qa="kbc"`（默认）：生成基于知识清洗的流水线。该流水线侧重于文本的长程逻辑清洗、智能分块以及 Alpaca 格式数据的产出。
- `--qa="vqa"`：生成基于视觉问答的流水线。该流水线侧重于利用多模态能力解析 PDF 中的图表、公式，并产出 ShareGPT 格式数据。

#### 执行阶段（dataflow pdf2model train）

1. **文档发现**：自动扫描指定目录，识别所有PDF文件并生成索引列表。
2. **知识提取**：借助 [MinerU](https://github.com/opendatalab/MinerU)、[trafilatura](https://github.com/adbar/trafilatura) 等工具从 PDF/Markdown/HTML/URL 中提取文本信息。
3. **QA 数据生成与清洗**：
   - KBC 模式：对原始文本进行精细化清洗（剔除冗余标签、修复格式错误、保护隐私信息）。随后利用三个句子的滑动窗口将知识点转写为需要多步推理的 Multi-Hop QA 对。
   - VQA 模式：将复杂的原始数据转化为 LLM 可理解的输入，针对教科书、试题等高价值图文内容，通过多线程 API 调用 LLM 从页面块中提取出高质量 QA 对。
4. **数据格式转换**：将收取出的 QA 数据转化为转换为 [LlamaFactory](https://github.com/hiyouga/LLaMA-Factory) 标准训练格式（Alpaca 或 ShareGPT）。
5. **微调**：基于生成的 QA 数据，使用 LoRA（低秩适配）方法对基座模型进行参数高效微调，训练模型参数，输出可直接部署的领域专用模型适配器。

#### 测试阶段（dataflow chat）

**模型对话测试**：自动加载最新训练的适配器和对应的基座模型，启动交互式对话界面，支持实时测试模型在领域知识问答上的表现。用户也可以通过 `--model` 参数指定特定的模型路径进行测试。



### 第一步: 安装 dataflow 环境

```bash
conda create -n dataflow python=3.10
conda activate dataflow

cd DataFlow
pip install -e .[pdf2model]
```



### 第二步: 创建新的 dataflow 工作文件夹

```bash
# 退出项目根目录
cd ..
mkdir run_dataflow
cd run_dataflow
```



### 第三步: 设置数据集

将合适大小的数据集（数据文件为 PDF 格式）放到工作文件夹中。



### 第四步: 初始化 dataflow-pdf2model

```bash
#初始化 
#--cache 可以指定.cache目录的位置（可选）
#默认值为当前文件夹目录
# KBC 模式初始化 (默认)
dataflow pdf2model init --qa="kbc"

# VQA 模式初始化 (适合 教材/试题)
dataflow pdf2model init --qa="vqa"
```

💡初始化完成后，项目目录变成：

```bash
项目根目录/
├── pdf_to_qa_pipeline.py  # pipeline执行文件
└── .cache/            # 缓存目录
    └── train_config.yaml  # llamafactory训练的默认配置文件
```



### 第五步:设置参数

🌟展示常用且重要的参数:

#### 模式 A：KBC 知识清洗（默认模式）

```python
self.storage = FileStorage(
    first_entry_file_name="./.cache/pdf_list.jsonl", # 这里需要设置默认生成的 pdf_list.json 路径
    cache_path=str(cache_path / ".cache" / "gpu"),
    file_name_prefix="batch_cleaning_step",  # 创建文件的前缀
    cache_type="jsonl",  # 创建文件的类型
)

# Flash-MinerU 后端（推荐使用）
self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterFlash(
    intermediate_dir="../example_data/KBCleaningPipeline/flash/",
    mineru_model_path="<your Model Path>/MinerU2.5-2509-1.2B",  # 本地模型路径
    batch_size=4, # 每个 vllm worker 的 batchsize
    replicas=1,   # vllm workers 的数量
    num_gpus_per_replica=0.5, # 用于 Ray 将 vllm 工作进程调度到 GPU 的参数，可以是浮点数，例如 0.5 表示每个工作进程使用半个 GPU，1 表示每个工作进程使用整个 GPU。
    engine_gpu_util_rate_to_ray_cap=0.9 # 每个工作进程的实际 GPU 利用率；每个工作进程的实际内存 = num_gpus_per_replica * engine_gpu_util_rate_to_ray_cap；这是为了避免内存溢出 (OOM)，可以将其设置为 0.9 或 0.8，以便为其他进程留出一些缓冲区。
)

self.knowledge_cleaning_step2 = KBCChunkGeneratorBatch(
    split_method="token", # 指定分割的方法  
    chunk_size=512,    # 指定chunk的大小
    tokenizer_name="./Qwen2.5-7B-Instruct", # tokenizer的模型路径
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
    output_json_file="./.cache/data/qa.json", # 输出数据集的路径
)
```

更详细的参数设置指引可以参考 [案例8. 批量PDF提取QA](../quickstart/knowledge_cleaning.md) 当中的描述。

#### 模式 B：VQA 数据提取

```python
self.storage = FileStorage(
    first_entry_file_name="./.cache/pdf_list.jsonl", # 这里需要设置默认生成的 pdf_list.json 路径
    cache_path="./cache",
    file_name_prefix="vqa", # 创建文件的前缀
    cache_type="jsonl", # 创建文件的类型
)

self.llm_serving = APILLMServing_request(
    api_url="http://<YOUR_SERVER_IP>:3000/v1/chat/completions", # API 接口路径
    key_name_of_api_key="DF_API_KEY",
    model_name="gemini-2.5-pro", # 确保 API 节点支持该模型
    max_workers=100,
)

self.vqa_extract_prompt = QAExtractPrompt()

self.pdf_merger = PDF_Merger(output_dir="./cache")

# Flash-MinerU 后端（推荐使用）
self.knowledge_cleaning_step1 = FileOrURLToMarkdownConverterFlash(
    intermediate_dir="../example_data/KBCleaningPipeline/flash/",
    mineru_model_path="<your Model Path>/MinerU2.5-2509-1.2B",  # 本地模型路径
    batch_size=4, # 每个 vllm worker 的 batchsize
    replicas=1,   # vllm workers 的数量
    num_gpus_per_replica=0.5, # 用于 Ray 将 vllm 工作进程调度到 GPU 的参数，可以是浮点数，例如 0.5 表示每个工作进程使用半个 GPU，1 表示每个工作进程使用整个 GPU。
    engine_gpu_util_rate_to_ray_cap=0.9 # 每个工作进程的实际 GPU 利用率；每个工作进程的实际内存 = num_gpus_per_replica * engine_gpu_util_rate_to_ray_cap；这是为了避免内存溢出 (OOM)，可以将其设置为 0.9 或 0.8，以便为其他进程留出一些缓冲区。
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
    output_json_file="./.cache/data/qa.json", # 输出数据集的路径
)
```

更详细的参数设置指引可以参考 [案例7. PDF中的VQA提取流水线](../quickstart/PDFVQAExtract.md) 当中的描述。

**注意**：在这里，需要配置 API 凭证用于调用 LLM API，该凭证可以在你的 LLM 提供商处获取（例如 OpenAI、Google Gemini 等）。将它们设置为环境变量：

```shell
export DF_API_KEY="sk-xxxxx"
```

```shell
$env:DF_API_KEY = "sk-xxxxx"
```


### 第六步: 一键微调

```bash
# 一键微调 直接启动清洗+微调的功能
dataflow pdf2model train
```

💡微调完成完成后，项目目录变成类似结构（这里以 `--qa="kbc"` 配置的最终结果为例）：

```bash
项目根目录/
├── pdf_to_model_pipeline.py  #  pipeline 执行文件
└── .cache/            # 缓存目录
    ├── train_config.yaml  # llamafactory 训练的默认配置文件
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

### 第七步: 与微调好的模型对话

```bash
# 用法一： --model 可以指定 对话模型的路径位置（可选）
# 默认值为 .cache/saves/pdf2model_cache_{timestamp}
dataflow chat --model ./custom_model_path

# 用法二：在工作文件夹下 运行 dataflow chat
dataflow chat
```
