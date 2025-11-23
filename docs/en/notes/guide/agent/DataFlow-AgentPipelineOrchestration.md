---
title: Agent-Quick Start
icon: carbon:ibm-consulting-advantage-agent
createTime: 2025/06/19 10:29:31
permalink: /en/guide/DataFlow-AgentPipelineOrchestration/

---
# DataFlow Agent Quick Start Guide

This guide will help you quickly get started with the 5 core functional modules of the DataFlow Agent platform.

## Table of Contents

1. [Pipeline Recommendation](#1-pipeline-recommendation)
2. [Operator Development](#2-operator-development)
3. [Manual Orchestration](#3-manual-orchestration)
4. [Operator Reuse/Prompt Optimization](#4-operator-reuseprompt-optimization)
5. [Web Search/Data Collection](#5-web-searchdata-collection)

---

## 1. Pipeline Recommendation

### Feature Overview
Automatically recommends and generates appropriate DataFlow Pipelines based on user's natural language descriptions, including operator selection, parameter configuration, and code generation.

### Use Cases
- Quickly build data processing workflows
- Intelligent recommendations when unfamiliar with specific operators
- Automated Pipeline generation

### Input Parameters

#### Basic Configuration
- **Target Description** (Required)
  - Describe the data processing goal you want to achieve
  - Example: `"Give me 5 logically consistent operators, filter and deduplicate!"`
  - Example: `"Clean, deduplicate, and classify text data"`

- **Input JSONL File Path** (Required)
  - Data file for testing the Pipeline
  - Format: One JSON object per line
  - Default: `{project_root}/tests/test.jsonl`

- **Session ID**
  - Session identifier for caching and tracking
  - Default: `"default"`

#### API Configuration

**Primary Model Configuration**
- **Chat API URL**: LLM service address
  - Default: `http://123.129.219.111:3000/v1/`
- **API Key**: Access key
- **Model Name**: e.g., `gpt-4o`, `qwen-max`, `llama3`, etc.
  - Default: `gpt-4o`

**Embedding Model Configuration**
- **Embedding API URL**: Embedding model service address (optional, uses primary API if empty)
- **Embedding Model Name**: e.g., `text-embedding-3-small`

#### Debug Configuration
- **Enable Debug Mode**: Whether to enable automatic debugging and fixing
- **Debug Mode Execution Count**: 1-10 times, default 2

### Output Results

#### 1. Pipeline Code (Generated Code)
```python
# Auto-generated Python code
# Contains complete Pipeline definition and execution logic
```

#### 2. Execution Log
- Detailed log of Pipeline execution process
- Contains execution status of each operator
- Error messages and debug information

#### 3. Agent Results
```json
{
  "recommender": {...},
  "pipeline_builder": {...},
  "operator_executor": {...}
}
```
- Detailed execution results of each Agent node
- Includes recommended operator list, build process, etc.

### Usage Steps

1. Enter your requirements in the "Target Description" box
2. Configure API information (URL, Key, Model)
3. (Optional) Configure embedding model and debug options
4. Click "Generate Pipeline" button
5. View generated code and execution results

---

## 2. Operator Development

### Feature Overview
Automatically generates new DataFlow operator code based on user requirements, including operator implementation, test code, and debugging.

### Use Cases
- Create custom data processing operators
- Extend DataFlow functionality
- Rapid prototyping

### Input Parameters

#### Basic Configuration
- **Target Description** (Required)
  - Describe the operator's functionality and purpose
  - Example: `"Create an operator for sentiment analysis of text"`
  - Example: `"Implement a data deduplication operator supporting multi-field combination deduplication"`

- **Operator Category**
  - Category the operator belongs to, used to match similar operators as reference
  - Default: `"Default"`
  - Options: `"filter"`, `"mapper"`, `"aggregator"`, etc.

- **Test Data File Path (JSONL)**
  - Data file for testing the operator
  - Default: `{project_root}/tests/test.jsonl`

#### API Configuration
- **Chat API URL**: LLM service address
- **API Key**: Access key (uses environment variable `DF_API_KEY` if empty)
- **Model Name**: Default `gpt-4o`

#### Advanced Configuration
- **Output Language**: `en` (English) or `zh` (Chinese)
- **Enable Debug Mode**: Automatically execute and fix code errors
- **Maximum Debug Rounds**: 1-10 times, default 3
- **Output File Path**: Location to save generated code (optional)

### Output Results

#### 1. Generated Code
```python
# Complete operator implementation code
class YourOperator(Operator):
    def __init__(self, ...):
        ...
    
    def run(self, dataset, ...):
        ...
```

#### 2. Matched Operators
```json
[
  {
    "op_name": "similar_operator_1",
    "similarity": 0.85,
    "description": "..."
  }
]
```
- List of similar operators matched by the system
- Used as reference and learning material

#### 3. Execution Results
```json
{
  "success": true,
  "output": {...},
  "stderr": "",
  "stdout": "..."
}
```
- Operator execution status
- Output data preview
- Error messages (if any)

#### 4. Debug Information
```json
{
  "round": 2,
  "input_key": "text",
  "available_keys": ["text", "label"],
  "stdout": "...",
  "stderr": "..."
}
```
- Detailed information of debug process
- Input/output of each debug round

#### 5. Agent Results
- Execution details of each Agent node
- Includes matching, writing, execution, debugging phases

#### 6. Execution Log
- Complete execution process log
- Contains detailed information of all phases

### Usage Steps

1. Describe operator functionality in detail in "Target Description"
2. Select appropriate operator category
3. Configure API information
4. (Optional) Enable debug mode to automatically fix errors
5. Click "Generate Operator" button
6. View generated code and test results
7. If modifications needed, adjust parameters and regenerate

---

## 3. Manual Orchestration

### Feature Overview
Manually select and assemble operators through visual interface to build custom Pipelines, supporting drag-and-drop sorting and parameter configuration.

### Use Cases
- Precise control of Pipeline structure
- Reuse existing operators
- Rapid prototype validation
- Learn operator usage methods

### Input Parameters

#### API and File Configuration
- **Chat API URL**: LLM service address
- **API Key**: Access key
- **Model Name**: Default `gpt-4o`
- **Input JSONL File Path**: Test data file

#### Operator Selection and Configuration

**Step 1: Select Operator**
1. Select category from "Operator Category" dropdown
   - e.g., `filter`, `mapper`, `deduplicator`, etc.
2. Select specific operator from "Operator" dropdown
   - System automatically displays parameter description for the operator

**Step 2: Configure Parameters**

- **Prompt Template (Optional)**
  - If operator supports Prompt templates, a dropdown selector will appear
  - Automatically updates to `__init__()` parameters after selection

- **`__init__()` Parameters (JSON Format)**
  ```json
  {
    "param1": "value1",
    "param2": 123,
    "prompt_template": "module.PromptClass"
  }
  ```
  - Operator initialization parameters
  - Must be valid JSON object

- **`run()` Parameters (JSON Format)**
  ```json
  {
    "input_key": "text",
    "output_key": "processed_text",
    "batch_size": 32
  }
  ```
  - Operator runtime parameters
  - Must be valid JSON object

**Step 3: Add to Pipeline**
- Click "➕ Add Operator to Pipeline" button
- Operator will be added to Pipeline sequence

**Step 4: Adjust Order**
- In Pipeline visualization area, drag operator cards to adjust order
- System automatically renumbers

**Step 5: Auto-linking**
- System automatically analyzes input/output relationships between operators
- Displays link status:
  - 🔗 **Linked**: Output key successfully matched to next operator's input
  - ⚠️ **Pending**: Input is empty or unmatched

### Output Results

#### 1. Current Pipeline (Visual Display)
- Each operator displayed as a card, containing:
  - Step number
  - Operator name
  - `__init__()` parameter preview
  - `run()` parameter preview
  - Connection status with previous step

#### 2. Current Pipeline (JSON Format)
```json
[
  {
    "op_name": "TextCleanerOperator",
    "init_params": {...},
    "run_params": {...},
    "_incoming_links": [
      {
        "input_key": "text",
        "value": "raw_text",
        "output_keys": ["output"]
      }
    ]
  }
]
```

#### 3. Generated Code
```python
# Complete Pipeline execution code
from dataflow import Dataset
from dataflow.operators import *

# Load data
dataset = Dataset.load("input.jsonl")

# Execute Pipeline
dataset = TextCleanerOperator(...).run(dataset, ...)
dataset = DeduplicatorOperator(...).run(dataset, ...)
...

# Save results
dataset.save("output.jsonl")
```

#### 4. Processing Result Data (First 100 Records)
```json
[
  {"text": "processed text 1", "label": "A"},
  {"text": "processed text 2", "label": "B"},
  ...
]
```

#### 5. Output File Path
- Location where processed data is saved

### Usage Steps

1. Configure API information and input file path
2. Select operator category and specific operator
3. Edit `__init__()` and `run()` parameters (JSON format)
4. Click "➕ Add Operator to Pipeline"
5. Repeat steps 2-4 to add more operators
6. Drag to adjust operator order (optional)
7. Check auto-link status, ensure parameters are correct
8. Click "🚀 Run Pipeline"
9. View generated code and execution results

### Advanced Tips

- **Clear Pipeline**: Click "🗑️ Clear Pipeline" button
- **Parameter Reuse**: System automatically links previous operator's output key to next operator's input
- **Debugging**: If execution fails, check error messages in log, adjust parameters and retry

---

## 4. Operator Reuse/Prompt Optimization

### Feature Overview
PromptAgent frontend for generating and optimizing operator Prompt templates, supporting multi-round conversational rewriting and testing.

### Use Cases
- Create high-quality Prompt templates for operators
- Optimize existing Prompt effectiveness
- Rapid Prompt design iteration
- Generate test code and data

### Input Parameters

#### Runtime Configuration
- **Chat API Base URL**: LLM service address
  - Default: `http://123.129.219.111:3000/v1/`
- **Chat API Key**: Access key
- **Model**: Model name, default `gpt-4o`
- **Language**: Prompt language, `zh` (Chinese) or `en` (English)

#### Prompt Configuration
- **Task Description** (Required)
  - Describe in detail the task the Prompt should complete
  - Example: `"Perform sentiment analysis on user input text, determine if positive, negative, or neutral"`
  - Example: `"Rewrite product descriptions into more attractive marketing copy"`

- **Operator Name (op-name)** (Required)
  - Name of the Prompt class
  - Example: `SentimentAnalysisPrompt`
  - Example: `MarketingCopywriterPrompt`

- **Output Format** (Optional)
  - Specify the format of Prompt output
  - Example:
    ```
    {
      "sentiment": "positive/negative/neutral",
      "confidence": 0.95
    }
    ```

- **Parameter List** (Optional)
  - Parameters needed by Prompt template, separated by comma, space, or newline
  - Example: `text, language, style`
  - Example:
    ```
    input_text
    target_audience
    tone
    ```

- **File Output Root Path** (Optional)
  - Directory to save generated files
  - Default: `./pa_cache`

- **Delete Test Files After Generation**
  - Whether to delete test files after generation (keep path placeholder)
  - Default: Enabled

### Output Results

#### 1. Prompt File Path
- Location of generated Prompt template file
- Example: `./pa_cache/prompts/SentimentAnalysisPrompt.py`

#### 2. Test Data File Path
- Auto-generated test data file
- Example: `./pa_cache/test_data/test_data.jsonl`

#### 3. Test Code File Path
- Auto-generated test code
- Example: `./pa_cache/tests/test_prompt.py`

#### 4. Test Data Preview
```json
[
  {"text": "This product is great!", "language": "en"},
  {"text": "Quality is terrible", "language": "en"},
  {"text": "It's okay", "language": "en"}
]
```

#### 5. Test Results Preview
```json
[
  {
    "input": {"text": "This product is great!"},
    "output": {
      "sentiment": "positive",
      "confidence": 0.92
    }
  }
]
```

#### 6. Prompt Code Preview
```python
from dataflow_agent.promptstemplates import PromptTemplate

class SentimentAnalysisPrompt(PromptTemplate):
    """Sentiment Analysis Prompt Template"""
    
    def __init__(self):
        super().__init__()
        self.system_prompt = "You are a sentiment analysis expert..."
        self.user_prompt_template = "Please analyze the sentiment of the following text: {text}"
    
    def format(self, text: str, **kwargs) -> str:
        return self.user_prompt_template.format(text=text)
```

#### 7. Test Code Preview
```python
import json
from your_prompt import SentimentAnalysisPrompt

# Load test data
with open("test_data.jsonl") as f:
    test_data = [json.loads(line) for line in f]

# Test Prompt
prompt = SentimentAnalysisPrompt()
for item in test_data:
    result = prompt.format(**item)
    print(result)
```

### Multi-round Rewriting Feature

In the right-side conversation area, you can:

1. **View Initial Generation Results**
   - Prompt code
   - Test results

2. **Propose Improvements**
   - Describe how you want to modify in the conversation input box
   - Examples:
     - `"Add recognition of sarcastic tone"`
     - `"Change output format to return only positive/negative/neutral string"`
     - `"Add confidence threshold, return uncertain when below 0.7"`

3. **Send Rewrite Instructions**
   - Click "Send Rewrite Instruction" button
   - System regenerates Prompt based on feedback

4. **Iterative Optimization**
   - View updated code and test results
   - Continue proposing improvements
   - Repeat until satisfied

5. **Clear Session**
   - Click "Clear Session" button to start over

### Usage Steps

#### Initial Generation
1. Configure API information (URL, Key, Model)
2. Fill in task description and operator name
3. (Optional) Specify output format and parameter list
4. Click "Generate Prompt Template" button
5. View generated Prompt code and test results

#### Multi-round Optimization
1. Enter improvement suggestions in right-side dialog box
2. Click "Send Rewrite Instruction"
3. View updated code and test results
4. Repeat steps 1-3 until satisfied

#### Using Generated Prompt
1. Get file location from "Prompt File Path"
2. Import Prompt class into your operator
3. Specify `prompt_template` in operator's `__init__()`

---

## 5. Web Search/Data Collection

### Feature Overview
Automatically collect datasets from the web (HuggingFace, Kaggle, and other platforms) and convert to unified format, supporting intelligent search, download, and data cleaning.

### Use Cases
- Quickly build training datasets
- Collect domain-specific data
- Dataset format conversion
- Batch download and processing

### Input Parameters

#### Collection Configuration
- **Target Description** (Required)
  - Describe the type of data you want to collect
  - Example: `"Collect Python code example datasets"`
  - Example: `"Collect Chinese conversation data for training chatbots"`
  - Example: `"Collect image classification datasets with cat and dog pictures"`

- **Data Category**
  - `PT`: Pre-Training data
  - `SFT`: Supervised Fine-Tuning data
  - Default: `SFT`

- **Dataset Quantity Limit (Per Keyword)**
  - Number of datasets returned per search keyword
  - Range: 1-50
  - Default: 5
  - Note: For reference only, actual quantity may vary based on search results

- **Dataset Size Range**
  - Filter datasets by size range
  - Options:
    - `n<1K`: Less than 1000 records
    - `1K<n<10K`: 1000-10000 records
    - `10K<n<100K`: 10000-100000 records
    - `100K<n<1M`: 100000-1000000 records
    - `n>1M`: More than 1000000 records
  - Default: `1K<n<10K`

- **Download Subtask Limit**
  - Limit the number of download tasks finally executed
  - Leave empty for no limit
  - Used to control download scale and time

- **Maximum Dataset Size**
  - Size limit for single dataset
  - Enter value then select unit (B/KB/MB/GB/TB)
  - Leave empty for no limit

- **Download Directory**
  - Root directory for data storage
  - Default: `downloaded_data`

- **Prompt Language**
  - `zh`: Chinese
  - `en`: English
  - Default: `zh`

#### LLM Configuration
- **CHAT_API_URL**: LLM service address
  - Default: `http://123.129.219.111:3000/v1/chat/completions`
- **CHAT_API_KEY**: Access key
- **CHAT_MODEL**: Model name
  - Default: `deepseek-chat`

#### Other Environment Configuration
- **HF_ENDPOINT**: HuggingFace mirror address
  - Default: `https://hf-mirror.com`
- **KAGGLE_USERNAME**: Kaggle username
- **KAGGLE_KEY**: Kaggle API key
- **TAVILY_API_KEY**: Tavily search API key

#### RAG Configuration
- **RAG_EBD_MODEL**: Embedding model name
  - Default: `text-embedding-3-large`
- **RAG_API_URL**: RAG service address
- **RAG_API_KEY**: RAG API key

#### Advanced Configuration (Collapsible)

**Web Collection Advanced Configuration**
- **Download Task Max Loop Count**: 1-50, default 10
  - Controls maximum retry count for each download task
- **Research Phase Max Loop Count**: 1-50, default 15
  - Maximum loop count for research phase, allows visiting more websites
- **Search Engine**: `tavily` / `duckduckgo` / `jina`
  - Default: `tavily`
- **Use Jina Reader**: Whether to use Jina Reader to extract web content
  - Default: Enabled
  - Advantages: Fast, structured (Markdown format)
- **Enable RAG Enhancement**: Whether to use RAG to refine content
  - Default: Enabled
- **Parallel Page Processing Count**: 1-20, default 5
  - Number of pages processed in parallel
  - Recommendation: 3-10 (adjust based on network and machine performance)
- **Disable Cache**: Whether to disable HuggingFace and Kaggle cache
  - Default: Enabled
  - When enabled, uses temporary directory and auto-cleans after download
- **Temporary Directory**: Custom temporary directory path
  - Leave empty to use default temporary directory

**Data Conversion Advanced Configuration**
- **Conversion Model Temperature**: 0.0-2.0, default 0.0
  - Model temperature parameter during data conversion
- **Conversion Max Token Count**: 512-8192, default 4096
  - Maximum token count during data conversion
- **Max Sampling Length (Characters)**: 50-1000, default 200
  - Maximum sampling length for each field
- **Sampling Record Count**: 1-10, default 3
  - Number of sampling records for analysis

### Output Results

#### 1. Execution Log (Real-time Streaming Output)
```
============================================================
Starting Web Collection and Conversion Workflow
============================================================
Target: Collect Python code example datasets
Category: SFT
Download Directory: downloaded_data

【Web Collection Configuration】
  - Search Engine: tavily
  - Download Subtask Limit: No limit
  - Task Max Loop Count: 10
  - Research Phase Max Loop Count: 15
  - Use Jina Reader: Yes
  - Enable RAG: Yes
  - Parallel Pages: 5
  - Disable Cache: Yes

【Data Conversion Configuration】
  - Model Temperature: 0.0
  - Max Token Count: 4096
  - Max Sampling Length: 200
  - Sampling Record Count: 3

Dataset Size Limit: No limit
============================================================

2025-01-23 10:00:00 [INFO] Starting dataset search...
2025-01-23 10:00:05 [INFO] Found 15 candidate datasets
2025-01-23 10:00:10 [INFO] Starting download dataset 1/5...
2025-01-23 10:01:00 [INFO] Dataset 1 download complete
...
2025-01-23 10:15:00 [INFO] Starting data conversion...
2025-01-23 10:20:00 [INFO] Data conversion complete
Workflow execution complete!
```

#### 2. Result Summary
```json
{
  "download_dir": "downloaded_data",
  "processed_output": "downloaded_data/processed_output",
  "category": "SFT",
  "language": "zh",
  "chat_model": "deepseek-chat",
  "max_download_subtasks": null,
  "max_dataset_size_bytes": null,
  "max_dataset_size_unit": null,
  "max_dataset_size_value": null
}
```

### Output File Structure

```
downloaded_data/
├── raw/                          # Raw downloaded data
│   ├── dataset_1/
│   │   ├── data.jsonl
│   │   └── metadata.json
│   ├── dataset_2/
│   └── ...
└── processed_output/             # Converted unified format data
    ├── combined.jsonl           # Combined data
    ├── train.jsonl              # Training set (if split)
    ├── validation.jsonl         # Validation set (if split)
    └── metadata.json            # Metadata information
```

### Usage Steps

#### Basic Usage
1. Describe the type of data to collect in detail in "Target Description"
2. Select data category (PT or SFT)
3. Configure dataset quantity and size limits
4. Configure LLM API information
5. (Optional) Configure keys for Kaggle, Tavily, and other services
6. Click "Start Web Collection and Conversion" button
7. View execution log in real-time
8. View result summary after completion
9. Check collected data in download directory

#### Advanced Usage
1. Expand "⚙️ Advanced Configuration" area
2. Adjust according to needs:
   - Search engine selection
   - Parallel processing count
   - Cache strategy
   - Data conversion parameters
3. Execute collection task
4. Adjust parameters based on log to optimize results

### Notes

1. **API Keys**
   - Ensure necessary API keys are configured
   - Tavily for search, Kaggle for downloading Kaggle datasets

2. **Network Environment**
   - If in China, recommend using HuggingFace mirror
   - Adjust parallel count to suit network bandwidth

3. **Storage Space**
   - Ensure sufficient disk space
   - Large datasets may require several GB of space

4. **Execution Time**
   - Collection process may take considerable time (minutes to hours)
   - Can control time by limiting download task count

5. **Data Quality**
   - Enabling RAG enhancement can improve data quality
   - Adjust sampling parameters to balance quality and speed

---

## FAQ

### Q1: How to obtain API keys?
- **OpenAI/GPT**: Visit [OpenAI Platform](https://platform.openai.com/)
- **Tavily**: Visit [Tavily](https://tavily.com/)
- **Kaggle**: Visit [Kaggle Settings](https://www.kaggle.com/settings)

### Q2: How to choose the right model?
- **Quick Prototyping**: `gpt-3.5-turbo`, `deepseek-chat`
- **High-Quality Output**: `gpt-4o`, `claude-3-opus`
- **Chinese Optimization**: `qwen-max`, `deepseek-chat`

### Q3: What to do if Pipeline execution fails?
1. Check error messages in execution log
2. Confirm input data format is correct
3. Check operator parameter configuration
4. Enable debug mode for automatic fixing
5. View Agent results for detailed errors

### Q4: How to improve data collection quality?
1. Use more precise target descriptions
2. Enable RAG enhancement
3. Adjust dataset size range
4. Increase sampling record count
5. Use more powerful LLM models

### Q5: Can generated code be used directly?
- **Pipeline Recommendation**: Can run directly, but recommend validating on test data first
- **Operator Development**: Recommend testing first, manually adjust if necessary
- **Manual Orchestration**: Generated code has been tested and can be used directly
- **Prompt Templates**: Recommend multi-round optimization before using in production
