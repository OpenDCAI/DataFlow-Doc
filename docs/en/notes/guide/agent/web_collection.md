---
title: Web Data Collection
createTime: 2026/02/14 00:00:00
permalink: /en/guide/agent/web_collection/
---

## 1. Overview

**Web Collection Agent** is the intelligent data collection module in DataFlow-Agent, designed to automatically collect, process, and format training datasets from the internet. The system supports two data types:

- **PT (Pre-Training)**: Large-scale unlabeled corpora for model pre-training.
- **SFT (Supervised Fine-Tuning)**: Structured instruction-response pairs for model fine-tuning.

The workflow is capable of:

1. **Web Search & Exploration**: Multi-layer BFS forest exploration strategy with LLM-driven URL filtering to automatically discover and locate target datasets.
2. **Multi-Platform Download**: Supports HuggingFace, Kaggle, and direct web download, with LLM intelligently deciding the download priority order.
3. **Dual-Channel Parallel Collection**: WebSearch and WebCrawler pipelines run in parallel, providing richer data sources.
4. **Adaptive Data Mapping**: LLM generates Python mapping functions with a triple-verification mechanism to automatically convert heterogeneous data into standard Alpaca format.

## 2. System Architecture

This function is orchestrated by `dataflow_agent/workflow/wf_web_collection.py`, forming a directed graph with parallel branches and conditional loops. The overall process is divided into four phases: task analysis, data collection (parallel), data download, and data processing & mapping.

### 2.1 Task Analysis Phase

1. **Start Node**
   1. **Responsibility**: Initializes the workflow configuration, creates the download directory, and prepares the execution environment.
   2. **Input**: `state.request.target` (user's original requirement).
   3. **Output**: Initialized `user_query` and download directory.

2. **Task Decomposer**
   1. **Responsibility**: Uses LLM to decompose complex user requirements into executable subtasks, with a maximum task limit (default 5).
   2. **Input**: User's original query.
   3. **LLM Thinking**: Analyzes the semantic meaning of the requirement and splits it into independent data collection subtasks.
   4. **Output**: `state.task_list`, for example:
      - Subtask 1: Collect NLP Q&A datasets
      - Subtask 2: Collect text classification datasets
      - Subtask 3: Collect image classification datasets

3. **Category Classifier**
   1. **Responsibility**: Determines whether the current task belongs to the PT or SFT type.
   2. **Input**: Current subtask name.
   3. **LLM Thinking**: Determines the data category based on the task description and generates a dataset background description.
   4. **Output**: `state.category` (`"PT"` or `"SFT"`) and `dataset_background`.
   5. **Fallback Mechanism**: When LLM cannot determine the category, keyword matching is used. SFT keywords include: `["sft", "fine-tuning", "qa", "instruction", "chat", "dialogue"]`.

### 2.2 Data Collection Phase (Parallel Execution)

After task analysis is complete, the system enters the `parallel_collection` parallel branch, simultaneously launching two collection pipelines: WebSearch and WebCrawler.

#### 2.2.1 WebSearch Node

WebSearch Node is the core data collection node of the system, implementing a complete web exploration and information extraction pipeline with the following core components:

1. **QueryGenerator**
   - **Responsibility**: Generates 3-5 diversified search queries based on the user's original requirement.
   - **Example**: Input `"Collect Python code generation datasets"`, output:
     - `"Python code generation dataset download"`
     - `"Python programming instruction dataset HuggingFace"`
     - `"code completion training data GitHub"`

2. **WebTools**
   - **search_web()**: Calls search engines (Tavily / DuckDuckGo / Jina) to obtain the initial URL list.
   - **read_with_jina_reader()**: Uses Jina Reader to crawl web page content and return structured Markdown-formatted text.

3. **Multi-Layer BFS Forest Exploration**
   - **Algorithm**: Adopts a Breadth-First Search (BFS) strategy to explore web links layer by layer. In each layer, Jina Reader is used to crawl page content, extract candidate URLs, and then URLSelector filters the most relevant links for the next layer.
   - **Key Parameters**:
     - `max_depth`: Maximum exploration depth (default 2)
     - `concurrent_limit`: Number of concurrent requests (default 10)
     - `topk_urls`: Number of URLs filtered per layer (default 5)
     - `url_timeout`: Request timeout (default 60 seconds)

4. **URLSelector**
   - **Responsibility**: Uses LLM to select the most relevant URLs from the candidate URL list based on the research objective.
   - **Filtering Strategy**: Analyzes URL relevance to the research objective, domain credibility, avoids duplicate content, and filters blocked domains.

5. **RAGManager**
   - **Responsibility**: Stores crawled web content into a vector database, supporting subsequent semantic retrieval and providing context for the SummaryAgent.

6. **SummaryAgent**
   - **Responsibility**: Generates specific download subtasks based on RAG-retrieved content.
   - **Output**: A structured subtask list, for example:
   ```json
   {
       "type": "download",
       "objective": "Download Spider Text2SQL dataset",
       "search_keywords": ["spider dataset", "text2sql"],
       "platform_hint": "huggingface",
       "priority": 1
   }
   ```

#### 2.2.2 WebCrawler Node

WebCrawler Node specializes in extracting code blocks and technical content from web pages. It runs in parallel with WebSearch Node, providing richer data sources.

1. **Generate Search Queries**: Creates specialized search queries targeting code/technical content.
2. **Search & Crawl**: Searches the web for URL lists and uses Jina Reader for concurrent page crawling.
3. **Code Block Extraction**: Calls `extract_code_blocks_from_markdown` to extract code blocks from Markdown content.
4. **Save Results**: Stores crawled results as `webcrawler_crawled.jsonl`.

### 2.3 Data Download Phase

**Download Node** performs the actual dataset download tasks, supporting three download methods with LLM intelligently deciding the download priority order.

1. **DownloadMethodDecisionAgent (LLM Decision)**
   - **Responsibility**: Analyzes the best download method based on the task objective and outputs a priority list, e.g., `["huggingface", "kaggle", "web"]`.

2. **Try Each Download Method Sequentially**:
   - **HuggingFace**: Searches HuggingFace Hub, LLM selects the best matching dataset, and downloads via API.
   - **Kaggle**: Searches Kaggle datasets, LLM selects the best match, and downloads through the Kaggle API.
   - **Web**: Uses WebAgent for intelligent web exploration and direct file download.

3. **Record Download Results**: Updates `state.download_results` with the download status and path for each dataset.

### 2.4 Data Processing & Mapping Phase

#### Postprocess Node

- **Responsibility**: Checks whether there are remaining incomplete subtasks (`check_more_tasks`). If so, loops back to the collection phase; otherwise, proceeds to the mapping phase.

#### Mapping Node

Mapping Node is responsible for converting collected intermediate-format data into standard Alpaca format, using LLM to generate adaptive Python mapping functions.

1. **Read Intermediate Data**: Loads raw records from `intermediate.jsonl`.
2. **LLM Generates Mapping Function (Triple Verification)**:
   1. Generates the mapping function 3 times.
   2. Validates consistency on sample data.
   3. Uses the function after passing verification.
3. **Batch Processing**: Executes mapping transformation on all records.
4. **Quality Filtering**: Applies quality filters to remove low-quality data.
5. **Save Results**: Outputs in both `.jsonl` and `.json` formats.

**Alpaca Format Definition**:

```json
{
    "instruction": "Task instruction or question",
    "input": "Optional input context (e.g., system prompt, SQL Schema)",
    "output": "Expected answer or output"
}
```

**SFT Data Mapping Rules**:
- `system` role → `input` field
- `user` role → `instruction` field
- `assistant` role → `output` field

**Mapping Example (Text2SQL)**:

```json
// Input format
{
    "messages": [
        {"role": "system", "content": "CREATE TABLE farm (Id VARCHAR)"},
        {"role": "user", "content": "How many farms are there?"},
        {"role": "assistant", "content": "SELECT COUNT(*) FROM farm"}
    ]
}

// Output Alpaca format
{
    "instruction": "How many farms are there?",
    "input": "CREATE TABLE farm (Id VARCHAR)",
    "output": "SELECT COUNT(*) FROM farm"
}
```

## 3. State Management & Output

### 3.1 WebCollectionState Core Fields

```python
@dataclass
class WebCollectionState(MainState):
    # Task related
    user_query: str                    # User's original requirement
    task_list: List[Dict]             # Decomposed task list
    current_task_index: int           # Current task index

    # Search related
    research_summary: str             # Research summary
    urls_visited: List[str]           # Visited URLs
    subtasks: List[Dict]              # Download subtasks

    # Download related
    download_results: Dict            # Download result statistics

    # WebCrawler related
    webcrawler_crawled_pages: List    # Crawled pages
    webcrawler_sft_records: List      # SFT records
    webcrawler_pt_records: List       # PT records

    # Mapping related
    mapping_results: Dict             # Mapping results
    intermediate_data_path: str       # Intermediate data path
```

### 3.2 WebCollectionRequest Configuration

```python
@dataclass
class WebCollectionRequest(MainRequest):
    # Task configuration
    category: str = "PT"              # PT or SFT
    output_format: str = "alpaca"

    # Search configuration
    search_engine: str = "tavily"
    max_depth: int = 2
    max_urls: int = 10
    concurrent_limit: int = 5
    topk_urls: int = 5

    # WebCrawler configuration
    enable_webcrawler: bool = True
    webcrawler_num_queries: int = 5
    webcrawler_crawl_depth: int = 3
    webcrawler_concurrent_pages: int = 3
```

### 3.3 Output File Structure

```
web_collection_output/
├── rag_db/                          # RAG vector database
├── hf_datasets/                     # HuggingFace downloaded data
│   └── dataset_name/
├── kaggle_datasets/                 # Kaggle downloaded data
├── web_downloads/                   # Direct web downloads
├── webcrawler_output/               # WebCrawler crawled results
│   └── webcrawler_crawled.jsonl
├── processed_output/                # Post-processing results
│   └── intermediate.jsonl
└── mapped_output/                   # Final mapping results
    ├── final_alpaca_sft.jsonl       # Alpaca format (JSONL)
    └── final_alpaca_sft.json        # Alpaca format (JSON)
```

## 4. User Guide

This feature provides two modes of usage: **Graphical Interface (Gradio UI)** and **Command Line Script**.

### 4.1 Graphical Interface

The front-end page code is located in `gradio_app/pages/web_collection.py`, providing a visual interactive experience. To launch the web interface:

```bash
python gradio_app/app.py
```

Visit `http://127.0.0.1:7860` to start using

![web_agent](/web_agent.png)

1. `step1:` Describe the type of data you want to collect in the "Target Description" field
2. `step2:` Select the data category (PT or SFT)
3. `step3:` Configure dataset quantity and size limits
4. `step4:` Configure LLM API information (URL, Key, Model)
5. `step5:` (Optional) Configure Kaggle, Tavily, and other service keys
6. `step6:` Click the **"Start Web Collection & Conversion"** button
7. `step7:` Monitor the execution logs in real time
8. `step8:` Review the result summary after completion
9. `step9:` Check the collected data in the download directory

**Advanced Usage**: Expand the "Advanced Configuration" section to adjust search engine selection, parallelism, caching strategy, data conversion parameters, etc.

### 4.2 Script Invocation

For automated tasks or batch collection, it is recommended to use the command line script `script/run_web_collection.py` directly.

#### 1. Environment Variable Configuration

```bash
export DF_API_URL="https://api.openai.com/v1"
export DF_API_KEY="your_api_key"
export TAVILY_API_KEY="your_tavily_key"
export KAGGLE_USERNAME=""
export KAGGLE_KEY=""
export RAG_API_URL=""
export RAG_API_KEY=""
```

#### 2. Run the Script

```bash
# Basic usage
python script/run_web_collection.py --target "Collect machine learning Q&A datasets"

# Full parameters
python script/run_web_collection.py \
    --target "Collect code generation datasets" \
    --category SFT \
    --max-urls 10 \
    --max-depth 2 \
    --download-dir ./my_output
```

**Main Parameter Description**:

- **`--target`**: Data collection target description (required)
- **`--category`**: Data category, `PT` or `SFT` (default `SFT`)
- **`--max-urls`**: Maximum number of URLs (default 10)
- **`--max-depth`**: Maximum crawl depth (default 2)
- **`--output-format`**: Output format (default `alpaca`)

#### 3. Python API Call

```python
from dataflow_agent.workflow.wf_web_collection import run_web_collection

result = await run_web_collection(
    target="Collect machine learning code examples",
    category="SFT",
    output_format="alpaca",
    download_dir="./my_output",
    model="gpt-4o"
)
```

### 4.3 Practical Case: Collecting a Chinese Q&A Dataset

Suppose we need to build a Chinese Q&A training dataset for a chatbot. Here is the complete workflow.

**Scenario Configuration:**

```bash
export DF_API_URL="https://api.openai.com/v1"
export DF_API_KEY="your_api_key"
export TAVILY_API_KEY="your_tavily_key"

python script/run_web_collection.py \
    --target "Collect Chinese Q&A datasets for fine-tuning" \
    --category SFT \
    --max-urls 20
```

**Run:**
After running the script, the workflow will execute in the following steps:

1. **Task Decomposition**: LLM decomposes "Collect Chinese Q&A datasets for fine-tuning" into multiple subtasks (e.g., Chinese common knowledge Q&A, Chinese reading comprehension, etc.).
2. **Category Classification**: Based on the "fine-tuning" keyword, automatically classifies as SFT type.
3. **Parallel Collection**: WebSearch explores Chinese QA datasets on platforms such as HuggingFace and GitHub; WebCrawler simultaneously crawls Q&A content from technical blogs.
4. **Intelligent Download**: LLM decides to prioritize downloading matching datasets from HuggingFace, falling back to Kaggle and direct web download on failure.
5. **Format Mapping**: Converts the downloaded heterogeneous data into unified Alpaca format, outputting to the `mapped_output/` directory.

Users can find the final `final_alpaca_sft.jsonl` file in the download directory, ready for direct use in model fine-tuning training.

### 4.4 Notes

1. **API Keys**
   - Ensure that necessary API keys are configured
   - Tavily is used for search; Kaggle is used for downloading Kaggle datasets

2. **Network Environment**
   - If located in China, it is recommended to use a HuggingFace mirror (set `HF_ENDPOINT`)
   - Adjust the parallelism to match your network bandwidth

3. **Storage Space**
   - Ensure sufficient disk space is available
   - Large datasets may require several GB of storage

4. **Execution Time**
   - The collection process may take a considerable amount of time (minutes to hours)
   - You can control the duration by limiting the number of download tasks

5. **Data Quality**
   - Enabling RAG enhancement can improve data quality
   - Adjust sampling parameters to balance quality and speed
