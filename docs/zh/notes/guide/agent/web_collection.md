---
title: Web 数据采集
createTime: 2026/02/14 00:00:00
permalink: /zh/guide/agent/web_collection/
---

## 1. 概述

**Web Collection Agent** 是 DataFlow-Agent 中的智能数据收集模块，专门用于从互联网自动收集、处理和格式化训练数据集。该系统支持两种数据类型：

- **PT（Pre-Training，预训练）**：大规模无标注语料，用于模型预训练。
- **SFT（Supervised Fine-Tuning，监督微调）**：结构化的指令-回答对，用于模型微调。

该工作流能够：

1. **网页搜索与探索**：基于多层 BFS 森林探索策略，由 LLM 驱动 URL 筛选，自动发现和定位目标数据集。
2. **多平台数据下载**：支持 HuggingFace、Kaggle、Web 直接下载三种方式，LLM 智能决策下载优先顺序。
3. **双通道并行采集**：WebSearch 和 WebCrawler 两条采集流程并行执行，提供更丰富的数据来源。
4. **自适应数据映射**：LLM 生成 Python 映射函数，通过三重验证机制，自动将异构数据转换为标准 Alpaca 格式。

## 2. 系统架构

该功能由 `dataflow_agent/workflow/wf_web_collection.py` 编排，形成一个包含并行分支和条件循环的有向图。整体流程分为四个阶段：任务分析、数据采集（并行）、数据下载、数据处理与映射。

### 2.1 任务分析阶段

1. **Start Node（初始化节点）**
   1. **职责**: 初始化工作流配置，创建下载目录，准备执行环境。
   2. **输入**: `state.request.target`（用户原始需求）。
   3. **输出**: 初始化后的 `user_query` 和下载目录。

2. **Task Decomposer（任务分解节点）**
   1. **职责**: 使用 LLM 将复杂的用户需求分解为可执行的子任务，限制最大任务数量（默认 5 个）。
   2. **输入**: 用户原始查询。
   3. **LLM 思考**: 分析需求语义，拆分为独立的数据收集子任务。
   4. **输出**: `state.task_list`，例如：
      - 子任务 1：收集 NLP 问答数据集
      - 子任务 2：收集文本分类数据集
      - 子任务 3：收集图像分类数据集

3. **Category Classifier（分类节点）**
   1. **职责**: 判断当前任务属于 PT 还是 SFT 类型。
   2. **输入**: 当前子任务名称。
   3. **LLM 思考**: 结合任务描述判断数据类别，生成数据集背景描述。
   4. **输出**: `state.category`（`"PT"` 或 `"SFT"`）以及 `dataset_background`。
   5. **后备机制**: 当 LLM 无法判断时，使用关键词匹配。SFT 关键词包括：`["sft", "微调", "问答", "qa", "instruction", "fine-tuning"]`。

### 2.2 数据采集阶段（并行执行）

任务分析完成后，系统进入 `parallel_collection` 并行分支，同时启动 WebSearch 和 WebCrawler 两条采集流程。

#### 2.2.1 WebSearch Node（网页搜索节点）

WebSearch Node 是系统的核心数据收集节点，实现了完整的网页探索和信息提取流程，包含以下核心组件：

1. **QueryGenerator（查询生成器）**
   - **职责**: 基于用户原始需求，生成 3-5 个多样化的搜索查询。
   - **示例**: 输入 `"收集 Python 代码生成数据集"`，输出：
     - `"Python code generation dataset download"`
     - `"Python programming instruction dataset HuggingFace"`
     - `"code completion training data GitHub"`

2. **WebTools（网页工具集）**
   - **search_web()**: 调用搜索引擎（Tavily / DuckDuckGo / Jina）获取初始 URL 列表。
   - **read_with_jina_reader()**: 使用 Jina Reader/MinerU-HTML 爬取网页内容，返回结构化的 Markdown 格式文本。

3. **多层 BFS 森林探索**
   - **算法**: 采用广度优先搜索（BFS）策略，逐层探索网页链接。每一层中，使用 Jina Reader/MinerU-HTML 爬取页面内容，提取候选 URL，再由 URLSelector 筛选最相关的链接进入下一层。
   - **关键参数**:
     - `max_depth`: 最大探索深度（默认 2）
     - `concurrent_limit`: 并发请求数（默认 10）
     - `topk_urls`: 每层筛选的 URL 数量（默认 5）
     - `url_timeout`: 请求超时时间（默认 60 秒）

4. **URLSelector（URL 筛选器）**
   - **职责**: 使用 LLM 从候选 URL 列表中选择与研究目标最相关的 URL。
   - **筛选策略**: 分析 URL 与研究目标的相关性、域名可信度，避免重复内容，过滤被阻止的域名。

5. **RAGManager（RAG 管理器）**
   - **职责**: 将爬取的网页内容存储到向量数据库中，支持后续的语义检索，为 SummaryAgent 提供上下文。

6. **SummaryAgent（摘要代理）**
   - **职责**: 基于 RAG 检索的内容，生成具体的下载子任务。
   - **输出**: 结构化的子任务列表，例如：
   ```json
   {
       "type": "download",
       "objective": "下载 Spider Text2SQL 数据集",
       "search_keywords": ["spider dataset", "text2sql"],
       "platform_hint": "huggingface",
       "priority": 1
   }
   ```

#### 2.2.2 WebCrawler Node（网页爬虫节点）

WebCrawler Node 专门用于从网页中提取代码块和技术内容，与 WebSearch Node 并行执行，提供更丰富的数据来源。

1. **生成搜索查询**: 针对代码/技术内容生成专用搜索查询。
2. **搜索与爬取**: 搜索网页获取 URL 列表，使用 Jina Reader 并发爬取页面内容。
3. **代码块提取**: 调用 `extract_code_blocks_from_markdown` 从 Markdown 内容中提取代码块。
4. **结果保存**: 将爬取结果保存为 `webcrawler_crawled.jsonl`。

### 2.3 数据下载阶段

**Download Node（下载节点）** 执行实际的数据集下载任务，支持三种下载方式，并使用 LLM 智能决策下载优先顺序。

1. **DownloadMethodDecisionAgent（LLM 决策）**
   - **职责**: 根据任务目标分析最佳下载方式，输出优先顺序列表，例如 `["huggingface", "kaggle", "web"]`。

2. **依次尝试每种下载方式**：
   - **HuggingFace**: 搜索 HuggingFace Hub，LLM 选择最佳匹配数据集，调用 API 下载。
   - **Kaggle**: 搜索 Kaggle 数据集，LLM 选择最佳匹配，通过 Kaggle API 下载。
   - **Web**: 使用 WebAgent 智能探索网页，直接下载文件。

3. **记录下载结果**: 更新 `state.download_results`，包含每个数据集的下载状态和路径。

### 2.4 数据处理与映射阶段

#### Postprocess Node（后处理节点）

- **职责**: 检查是否还有未完成的子任务（`check_more_tasks`），如果有则循环回到采集阶段；否则进入映射阶段。

#### Mapping Node（数据映射节点）

Mapping Node 负责将收集到的中间格式数据转换为标准的 Alpaca 格式，使用 LLM 生成自适应的 Python 映射函数。

1. **读取中间数据**: 加载 `intermediate.jsonl` 中的原始记录。
2. **LLM 生成映射函数（三重验证）**:
   1. 生成映射函数 3 次。
   2. 在样本数据上验证一致性。
   3. 通过验证后使用。
3. **批量处理**: 对所有记录执行映射转换。
4. **质量过滤**: 应用质量过滤器剔除低质量数据。
5. **保存结果**: 输出为 `.jsonl` 和 `.json` 两种格式。

**Alpaca 格式定义**：

```json
{
    "instruction": "任务指令或问题",
    "input": "可选的输入上下文（如系统提示、SQL Schema）",
    "output": "期望的回答或输出"
}
```

**SFT 数据映射规则**：
- `system` 角色 → `input` 字段
- `user` 角色 → `instruction` 字段
- `assistant` 角色 → `output` 字段

**映射示例（Text2SQL）**：

```json
// 输入格式
{
    "messages": [
        {"role": "system", "content": "CREATE TABLE farm (Id VARCHAR)"},
        {"role": "user", "content": "How many farms are there?"},
        {"role": "assistant", "content": "SELECT COUNT(*) FROM farm"}
    ]
}

// 输出 Alpaca 格式
{
    "instruction": "How many farms are there?",
    "input": "CREATE TABLE farm (Id VARCHAR)",
    "output": "SELECT COUNT(*) FROM farm"
}
```

## 3. 状态管理与输出

### 3.1 WebCollectionState 核心字段

```python
@dataclass
class WebCollectionState(MainState):
    # 任务相关
    user_query: str                    # 用户原始需求
    task_list: List[Dict]             # 分解后的任务列表
    current_task_index: int           # 当前任务索引

    # 搜索相关
    research_summary: str             # 调研总结
    urls_visited: List[str]           # 已访问 URL
    subtasks: List[Dict]              # 下载子任务

    # 下载相关
    download_results: Dict            # 下载结果统计

    # WebCrawler 相关
    webcrawler_crawled_pages: List    # 爬取的页面
    webcrawler_sft_records: List      # SFT 记录
    webcrawler_pt_records: List       # PT 记录

    # 映射相关
    mapping_results: Dict             # 映射结果
    intermediate_data_path: str       # 中间数据路径
```

### 3.2 WebCollectionRequest 配置

```python
@dataclass
class WebCollectionRequest(MainRequest):
    # 任务配置
    category: str = "PT"              # PT 或 SFT
    output_format: str = "alpaca"

    # 搜索配置
    search_engine: str = "tavily"
    max_depth: int = 2
    max_urls: int = 10
    concurrent_limit: int = 5
    topk_urls: int = 5

    # WebCrawler 配置
    enable_webcrawler: bool = True
    webcrawler_num_queries: int = 5
    webcrawler_crawl_depth: int = 3
    webcrawler_concurrent_pages: int = 3
```

### 3.3 输出文件结构

```
web_collection_output/
├── rag_db/                          # RAG 向量数据库
├── hf_datasets/                     # HuggingFace 下载数据
│   └── dataset_name/
├── kaggle_datasets/                 # Kaggle 下载数据
├── web_downloads/                   # Web 直接下载
├── webcrawler_output/               # WebCrawler 爬取结果
│   └── webcrawler_crawled.jsonl
├── processed_output/                # 后处理结果
│   └── intermediate.jsonl
└── mapped_output/                   # 最终映射结果
    ├── final_alpaca_sft.jsonl       # Alpaca 格式（JSONL）
    └── final_alpaca_sft.json        # Alpaca 格式（JSON）
```

## 4. 使用指南

本功能提供 **图形界面 (Gradio UI)** 和 **命令行脚本** 两种使用方式。

### 4.1 图形界面

前端页面代码位于 `gradio_app/pages/web_collection.py`，提供了可视化的交互体验。启动 Web 界面：

```bash
python gradio_app/app.py
```

访问 `http://127.0.0.1:7860` 开始使用

![web_agent](/web_agent.png)

1. `step1:` 在"目标描述"中详细说明要收集的数据类型
2. `step2:` 选择数据类别（PT 或 SFT）
3. `step3:` 配置数据集数量和大小限制
4. `step4:` 配置 LLM API 信息（URL、Key、模型）
5. `step5:`（可选）配置 Kaggle、Tavily 等服务的密钥
6. `step6:` 点击 **"开始网页采集与转换"** 按钮
7. `step7:` 实时查看执行日志
8. `step8:` 等待完成后查看结果摘要
9. `step9:` 在下载目录中查看采集的数据

**高级使用**：展开"高级配置"区域，可调整搜索引擎选择、并行处理数量、缓存策略、数据转换参数等。

### 4.2 脚本调用

对于自动化任务或批量采集，推荐直接使用命令行脚本 `script/run_web_collection.py`。

#### 1. 环境变量配置

```bash
export DF_API_URL="https://api.openai.com/v1"
export DF_API_KEY="your_api_key"
export TAVILY_API_KEY="your_tavily_key"
export KAGGLE_USERNAME=""
export KAGGLE_KEY=""
export RAG_API_URL=""
export RAG_API_KEY=""
```

#### 2. 运行脚本

```bash
# 基本用法
python script/run_web_collection.py --target "收集机器学习问答数据集"

# 完整参数
python script/run_web_collection.py \
    --target "收集代码生成数据集" \
    --category SFT \
    --max-urls 10 \
    --max-depth 2 \
    --download-dir ./my_output
```

**主要参数说明**：

- **`--target`**: 数据收集目标描述（必填）
- **`--category`**: 数据类别，`PT` 或 `SFT`（默认 `SFT`）
- **`--max-urls`**: 最大 URL 数量（默认 10）
- **`--max-depth`**: 最大爬取深度（默认 2）
- **`--output-format`**: 输出格式（默认 `alpaca`）

#### 3. Python API 调用

```python
from dataflow_agent.workflow.wf_web_collection import run_web_collection

result = await run_web_collection(
    target="收集机器学习代码示例",
    category="SFT",
    output_format="alpaca",
    download_dir="./my_output",
    model="gpt-4o"
)
```

### 4.3 实战 Case：收集中文问答数据集

假设我们需要为聊天机器人构建一份中文问答训练数据集，以下是完整的操作流程。

**场景配置：**

```bash
export DF_API_URL="https://api.openai.com/v1"
export DF_API_KEY="your_api_key"
export TAVILY_API_KEY="your_tavily_key"

python script/run_web_collection.py \
    --target "收集中文问答数据集用于微调" \
    --category SFT \
    --max-urls 20
```

**运行：**
运行脚本后，工作流会按以下步骤执行：

1. **任务分解**: LLM 将"收集中文问答数据集用于微调"拆解为多个子任务（如中文常识问答、中文阅读理解等）。
2. **分类判定**: 根据"微调"关键词，自动判定为 SFT 类型。
3. **并行采集**: WebSearch 探索 HuggingFace、GitHub 等平台上的中文 QA 数据集；WebCrawler 同步抓取技术博客中的问答内容。
4. **智能下载**: LLM 决策优先从 HuggingFace 下载匹配数据集，失败后回退到 Kaggle 和 Web 直接下载。
5. **格式映射**: 将下载的异构数据统一转换为 Alpaca 格式，输出到 `mapped_output/` 目录。

用户可以在下载目录下找到最终的 `final_alpaca_sft.jsonl` 文件，直接用于模型微调训练。

### 4.4 注意事项

1. **API 密钥**
   - 确保配置了必要的 API 密钥
   - Tavily 用于搜索，Kaggle 用于下载 Kaggle 数据集

2. **网络环境**
   - 如果在国内，建议使用 HuggingFace 镜像（设置 `HF_ENDPOINT`）
   - 调整并行数量以适应网络带宽

3. **存储空间**
   - 确保有足够的磁盘空间
   - 大型数据集可能需要数 GB 空间

4. **执行时间**
   - 采集过程可能需要较长时间（几分钟到几小时）
   - 可以通过限制下载任务数量来控制时间

5. **数据质量**
   - 启用 RAG 增强可以提高数据质量
   - 调整采样参数以平衡质量和速度
