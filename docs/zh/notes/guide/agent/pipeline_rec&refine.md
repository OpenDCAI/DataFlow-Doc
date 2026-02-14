---
title: 智能 Pipeline 推荐与优化
createTime: 2026/02/05 22:11:00
permalink: /zh/guide/agent/pipeline_rec&refine/
---


本模块包含两个紧密协作的核心子系统：

1. **智能 Pipeline 推荐 (Recommendation)**：负责“从 0 到 1”，将自然语言需求转化为完整的可执行 Pipeline。
2. **Pipieline 迭代优化 (Refinement)**：负责“从 1 到 N”，基于用户反馈对现有 Pipeline 结构进行微调。

## 第一部分：Pipeline 推荐 (Pipeline Recommendation)

### 1. 概述 

**Pipeline 推荐** 是 DataFlow-Agent 的核心编排引擎。它能够理解复杂的业务需求，自动拆解任务步骤，从算子库中检索最佳组件，规划数据流向，并生成可执行的 Python 代码。

该系统具备自我修复能力：在生成代码执行失败时，Agent 会主动查阅算子源码文档，分析错误原因并修正代码，直至执行成功。

### 2. 系统架构

该功能由 `dataflow_agent/workflow/wf_pipeline_recommend_extract_json.py` 编排，形成一个包含多级智能体的有向图。以下是详细的节点职责说明：

#### 2.1 分析与规划阶段

1. **Classifier Node** 
   1. **职责**: 读取少量数据样例，识别数据类型和业务领域。这决定了后续推荐算子的倾向性。
   2. **输入**: `state.request.json_file` (数据文件路径)。
   3. **输出**: `state.category`。
2. **Target Parser Node** 
   1. **核心任务 (What it does)**: 充当业务分析的角色。它不直接生成代码，而是将用户模糊的需求转化为逻辑严密的步骤。
   2. **输入**: 用户的自然语言需求（例如：“过滤掉pdf中长度小于10的文本，然后去重，最后提取关键词”）。
   3. **LLM 思考**: 将需求拆解为标准的、符合数据处理逻辑的步骤列表（如 `["读取解析pdf成纯文本", "过滤掉长度小于10个字符的文本数据", "对文本数据进行去重处理，移除重复内容","从文本数据中提取关键词"]`）。
   4. **后续动作**: 利用拆解出的步骤描述，去算子向量数据库中检索最相似的物理算子，形成**候选算子池**，供下一阶段使用。
3. **Recommender Node** 
   1. **核心任务**: 负责将散乱的候选算子变成有序的执行方案。
   2. **输入**:
      - `target`: 用户的原始需求。
      - `sample`: 数据样本（了解数据特征，如字段名、格式）。
      - `split_ops`: 上一步 `target_parser` 通过 RAG 检索出来的候选算子列表及其功能描述。
   3. **LLM** **思考**:
      - **逻辑排序**: 每个阶段不是只能有一个算子，而是遵循 “需求”
      - **数据兼容性**: 若某算子需要字段“X”但样例数据中不存在，必须确保在它之前有算子创建该字段
      - **查漏补缺**: 现有算子能满足需求吗？如果不行，需要插入一个万能的 `PromptedGenerator` 
   4. **输出**: 一个有序的算子名称列表以及推荐理由，如
   ```JSON
   {
      "ops": [
         "Text2SQLQuestionGenerator",
         "SQLExecutionFilter",
         "SQLConsistencyFilter",
         "SQLVariationGenerator",
         "Text2SQLQuestionGenerator",
         "Text2SQLPromptGenerator",
         "Text2SQLCoTGenerator",
         "ReasoningQuestionSolvableSampleEvaluator",
         "SQLComponentClassifier",
         "PromptedGenerator"
      ],
      "reason": "该流水线设计旨在满足用户的所有需求。
      1. 首先，通过 Text2SQLQuestionGenerator 解析 SQL 数据文件并提取 SQL 语句和对应的自然语言问题。
      2. 接着，使用 SQLExecutionFilter 在数据库中执行 SQL 语句以验证其有效性。
      3. 然后，使用 SQLConsistencyFilter 进行一致性过滤，确保 SQL 语句与其对应的自然语言问题一致。
      4. 接下来，使用 SQLVariationGenerator 对有效的 SQL 语句进行扩增，包括替换数值、提高语法难度和更改书写方式。
      5. 随后，使用 Text2SQLQuestionGenerator 基于扩增后的 SQL 语句生成对应的自然语言问题。
      6. 接着，使用 Text2SQLPromptGenerator 生成 Prompt 提示词内容，并通过 Text2SQLCoTGenerator 生成思维链推理过程。
      7. 然后，使用 ReasoningQuestionSolvableSampleEvaluator 对生成的数据进行分类，评估大模型解决问题的难度，并使用 SQLComponentClassifier 评估 SQL 组成部分的难度。
      8. 最后，使用 PromptedGenerator 输出合成的 SQL 数据及其对应的自然语言问题和推理过程，以确保所有需求得到满足。"
   }
   ```

#### 2.2 构建与执行阶段

1. **Builder Node**
   1. **职责**: 将推荐方案（JSON）转化为实际的 Python 代码文件，并启动子进程执行该代码。
   2. **机制**: 支持创建子进程执行代码，捕获标准输出 (stdout) 和标准错误 (stderr)。
   3. **输出**: `state.execution_result` (Success/Fail 状态及日志)。

#### 2.3 自动修复闭环 

当 `builder` 执行失败且 `need_debug=True` 时，进入此循环：

1. **Debugger Node**
   
   - **职责**: 分析错误堆栈 (`error_trace`) 和当前代码，判断错误类型（参数错误、逻辑错误等）。
2. **Info Requester Node** 
   
   - **职责**: 这是一个主动学习节点。如果 Debugger 认为信息不足，它会调用工具读取相关算子的**源代码**或**文档**，获取上下文信息。
3. **Rewriter Node** 
   1. **职责**: 综合错误日志和 InfoRequester 查到的源码知识，生成修复后的完整代码。
   2. **流转**: 修复后的代码会再次送入 `builder` 进行测试，直到成功或达到最大重试次数 (`max_debug_rounds`)。

#### 2.4 输出阶段

- **Exporter Node**

   - **职责**: 执行成功后，整理最终的 Pipeline 信息、代码路径及数据样例，格式化输出给用户。

### 3. 使用指南 

本功能提供 **图形界面 (Gradio UI)** 和 **命令行脚本** 两种使用方式。

#### 3.1 图形界面

代码位于 `gradio_app/pages/pipeline_rec.py`，适合交互式探索和快速验证。启动 Web 界面：
```python
python gradio_app/app.py
```
访问 `http://127.0.0.1:7860` 开始使用

1. **配置输入**：
   1. 在"目标描述"框中输入您的需求
   2. 输入需要处理jsonl文件
   3. 配置 API 信息（URL、Key、模型）
   4. (可选)配置嵌入模型和调试选项
   5. 选择是否需要自动更新向量索引（如果出现算子不在注册机里，则需要勾选）
   6. 选择是否使用debug模式（debug模式会自动运行生成的 Pipeline 代码，直到最大迭代轮次）
2. **生成pipeline**：

   点击 **" Generate Pipeline"**。
3. **结果查看**：
   1. **Pipeline Code**: 查看最终生成的pipeline 代码
   2. **Execution Log**: 查看执行的日志信息
   3. **Agent Results:** 各个 Agent 节点的详细执行结果，包含推荐的算子列表、构建过程等
   4. **Pipeline JSON:** 生成的Pipeline拓扑结构JSON，包含算子节点列表和节点间连接关系

#### 3.2 脚本调用 

对于自动化任务或批量生成，推荐直接修改并运行 `script/run_dfa_pipeline_recommend.py`。
##### 1. 修改配置

打开 `script/run_dfa_pipeline_recommend.py`，在文件顶部的配置区域进行修改。

**API 配置**

  * **`CHAT_API_URL`**: LLM 服务地址
  * **`api_key`**: 访问密钥（使用环境变量 DF_API_KEY）
  * **`MODEL`**: 模型名称，默认 gpt-4o

**任务配置**

   * **`TARGET`**: 用自然语言详细描述您的数据处理需求
      * 示例：`"请帮我编排一个专门用于大规模预训练数据清洗的流水线，涵盖从去重、改写到质量过滤的全过程"`
   * **`TEST_JSON_REL_PATH`**: 用于测试 Pipeline 的数据文件的相对路径
      * 格式：每行一个 JSON 对象
      * 默认：`{项目根目录}/tests/test.jsonl`

**调试配置**

   * **`NEED_DEBUG`**: 是否启用自动调试和修复
      * **`True`**: Agent 生成代码后会立即尝试运行。如果报错（如 `ImportError`, `KeyError`），它会启动 Debugger Agent 分析错误堆栈，自动修改代码并重试
      * **`False`**：生成代码运行后立即结束，不进行自动调试和修复
   * **`MAX_DEBUG_ROUNDS`**: 最大自动修复次数，默认 5 次

**文件配置**

   * **`CACHE_DIR`**: 结果输出目录。生成的 pipeline 代码、执行的日志、中间结果等都会保存在这里

##### 2. 运行脚本

```bash
python script/run_dfa_pipeline_recommend.py

```

##### 3. 结果输出

脚本执行完毕后，控制台会打印执行的日志和最终执行状态，脚本运行后会在 `CACHE_DIR` 下生成 `my_pipeline.py`, `final_state.json` 和 `graph.png`。

##### 4. 实战 Case：预训练数据清洗流水线

你可以参考以下教程学习，也可以参考我们提供的[Google Colab](https://colab.research.google.com/drive/1MMJxRpfYi7Zd-jc_pyhvM1Y2WoQXOFcu?usp=sharing)样例来运行：

假设我们有一个包含脏数据的预训练数据 `tests/test.jsonl`，我们希望清洗出一份高质量数据。打开脚本修改如下配置：

**场景配置：**

```python
# ===== Example config (edit here) =====

# 1. 定义任务流程
TARGET = """
- 1.请帮我编排一个专门用于大规模预训练数据清洗的流水线，涵盖从去重、改写到质量过滤的全过程。  - 1. 请帮我编排一个专门用于大规模预训练数据清洗的流水线，涵盖从去重、改写到质量过滤的全过程。
- 2. 在预训练阶段，原始的网页数据（如Common Crawl）往往充斥着大量的噪声、广告、乱码以及重复内容，数据质量参差不齐。我需要先做对原始数据做适当的改写，比如删除大量多余空格、html标签等。接着，需要通过基于规则的启发式过滤，把那些显而易见的垃圾文本、不完整文本和过短的无效数据剔除掉。同时，考虑到网络上内容复杂，我需要筛选指定语言的数据来训练大模型。网络数据的重复率很高，最好能通过模糊去重算法把相似的文档都清理掉，只保留一份。最后，为了保证模型学到的是高质量知识，我希望还能有一个质量分类模型，对清洗后的数据打分，只留下那些高教育价值的内容，从而构建一个高质量的预训练语料库。
- 3. 我需要一个专门处理海量预训练语料的端到端流水线。首先，你可以对原始文本进行基础的规范化处理，删除多余空格、html标签和表情符号。接着，利用启发式规则进行初步过滤，筛掉显着的低质量文本。这些启发式规则覆盖广泛，需要过滤掉符号/单词比例过高的文段、含敏感词的文段、单词数量异常的文段、以冒号/省略号结尾的不完整文段、语句数量异常的文段、空文本、平均单词长度异常的文段、含html标签的文段、无标点符号的文段、含特殊符号或水印的文段、括号比例过高的文段、大写字母比例过高的文段、含lorem ipsum（随机假文）的文段、独立单词比例过小的文段、字符数量较少的文段、以项目符号开头的文段和含有Javascript数量过多的文段。在此基础上，使用MinHash或类似算法进行文档级的模糊去重，大幅降低数据冗余。随后，利用训练好的质量评估模型对剩余数据进行打分和筛选。最后，还可以加入一个语言识别步骤，确保最终留下的都是目标语言的高质量纯净文本。
"""

# 2. 指定测试数据路径
TEST_JSON_REL_PATH = "tests/test.jsonl" 

# 3. 开启 Debug 
NEED_DEBUG = True
MAX_DEBUG_ROUNDS = 5

```

**运行：**
运行脚本后，工作流会按以下步骤执行：

1. **分析用户的数据和意图**：分析用户的数据的特征。
2. **拆解用户任务，推荐算子**：将用户的意图拆解成多个任务，检索匹配出与用户意图相关的算子。
3. **生成代码**：分析需求顺序，串联这些算子，编写 pipeline 代码。
4. **自动测试**：启动子进程试运行。如果出现了错误并启动了调试模式，Debugger Node 会尝试修复。
5. **最终交付**：在成功执行或者达到最大调试轮数时结束工作流。

用户可以在`CACHE_DIR`目录下找到生成的 Pipeline 代码文件和执行的日志文件。



## 第二部分：Pipeline 迭代优化 (Pipeline Refinement)

### 1. 概述 

Pipeline 迭代优化 (Refinement) 允许用户通过自然语言对已生成的 DataFlow Pipeline 进行微调。用户无需手动修改复杂的 JSON 配置或 Python 代码，只需输入如“删除中间的过滤节点”等指令，系统便会智能解析意图并自动调整 Pipeline 的拓扑结构。

### 2. 系统架构 

该功能由 `dataflow_agent/workflow/wf_pipeline_refine.py` 编排，采用 **Analyzer -> Planner -> Refiner** 的三段式架构：

#### 2.1 Refine Target Analyzer 

- **核心职责**:
  - **意图识别**: 比较当前的 Pipeline 结构（`state.pipeline_structure_code`）和用户的自然语言需求（`target`），分析用户希望进行的修改类型（增、删、改）。
  - **RAG 预检索 (Pre-emptive RAG)**: 这是关键特性。Analyzer 会解析出用户需求中隐含的子操作描述，并直接调用 RAG 搜索 `_get_operators_by_rag_with_scores`。它会计算相似度分数、评估匹配质量，并将最佳匹配的算子代码`code_snippet`和警告信息打包进 `op_contexts`。
- **输入**: `state.pipeline_structure_code` (当前 pipeline 代码), `state.request.target` (用户修改指令)。
- **输出**: 包含 `needed_operators_desc` 的意图分析结果，以及包含丰富上下文的 `op_contexts`（算子代码、匹配度评分）。

#### 2.2 Refine Planner 

- **职责**: 基于 Analyzer 提供的意图和预检索到的算子上下文，制定具体的**修改计划**。它不直接修改代码，而是生成结构化的操作步骤。
- **输入**: Analyzer 的分析结果 (`intent`)、算子上下文 (`op_context`)、当前节点摘要。
- **输出**: 结构化的操作步骤列表，例如：
  - `REMOVE_NODE: node_filter_1`
  - `ADD_NODE: node_deduplicate (after node_loader)`
  - `UPDATE_EDGE: node_loader -> node_deduplicate`。

#### 2.3 JSON Pipeline Refiner 

- **职责**: 执行 Planner 的计划，直接操作 Pipeline 的 JSON 数据结构 Nodes 和 Edges。
- **工具增强**: 该 Agent 挂载了 `search_operator_by_description` 和 `get_operator_code_by_name` 作为后置工具。虽然 Analyzer 已经提供了 `op_context`，但如果 Refiner 在执行过程中发现信息不足，它仍可以主动发起搜索来补充算子信息。
- **输出**: 更新后的 `state.pipeline_structure_code`。

### 3. 使用指南

本功能提供 **图形界面 (Gradio UI)** 和 **命令行脚本** 两种使用方式。

#### 3.1 图形界面

集成在 `gradio_app/pages/pipeline_rec.py`，适合交互式探索和快速验证。启动 Web 界面：
```python
python gradio_app/app.py
```
访问 `http://127.0.0.1:7860` 开始使用

1. **前提**：必须先在页面上方点击 "Generate Pipeline" 生成初始 pipeline 代码，此时 `pipeline_json_state` 会被初始化。
2. **输入优化指令**：在 "优化需求" 文本框中输入指令。
3. **执行优化**：点击 **"Refine Pipeline"**。系统将显示更新后的 Python 代码、JSON 结构以及 Agent 的执行日志。
4. **历史回溯**：使用 "上一轮" 和 "下一轮" 按钮在不同的优化版本间切换，查看代码演进过程。
5. **警告提示**: 如果 RAG 匹配度较低，代码顶部会自动添加 `优化警告` 注释，提示用户当前生成的算子可能未完全匹配需求。

#### 3.2 脚本调用 

使用 `script/run_dfa_pipeline_refine.py` 对已有的 Pipeline 结构进行微调。

##### 1. 修改配置

**API 配置**

  * **`CHAT_API_URL`**: LLM 服务地址
  * **`api_key`**: 访问密钥（使用环境变量 DF_API_KEY）
  * **`MODEL`**: 模型名称，默认 gpt-4o

**任务配置**

  * **`INPUT_JSON`**: 待优化的 Pipeline 结构文件路径
  * **`OUTPUT_JSON`**: 优化后的 Pipeline JSON 结构文件保存路径
  * **`TARGET`**: 用自然语言描述您希望如何修改 Pipeline
      * 示例：`"请将Pipeline调整为只包含3个节点，简化数据流"`

##### 2. 运行脚本

```bash
python script/run_dfa_pipeline_refine.py

```

##### 3. 实战 Case：简化流水线

你可以参考以下教程学习，也可以参考我们提供的[Google Colab](https://colab.research.google.com/drive/1MMJxRpfYi7Zd-jc_pyhvM1Y2WoQXOFcu?usp=sharing)样例来运行：

假设上一步生成的流水线太复杂，包含了多余的“清洗”算子，我们希望将其移除来简化 Pipeline。

**场景配置：**

```python
# ===== Example config (edit here) =====

# 1. 指定上一步生成的 Pipeline 结构文件
INPUT_JSON = "dataflow_agent/tmps/pipeline.json"

# 2. 下达修改指令
TARGET = "请简化中间的清洗算子，简化数据流。"

# 3. 指定结果保存位置
OUTPUT_JSON = "cache_local/pipeline_refine_result.json.json"

```

**运行：**
Agent 会分析当前 Pipeline 的 JSON 拓扑结构，找到对应的去重节点，将其移除。