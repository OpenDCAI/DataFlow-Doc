---
title: 算子问答
createTime: 2026/02/05 22:11:00
permalink: /zh/guide/agent/operator_qa/
---

## 1. 概述 

**算子智能问答 (Operator QA)** 是 DataFlow-Agent 平台内置的垂直领域专家助手。它的核心使命是帮助用户快速在海量的 DataFlow 算子库中找到所需的工具，理解其用法，并查看底层源码。

不同于通用的聊天机器人，Operator QA 集成了 **RAG（检索增强生成）** 技术。它挂载了 DataFlow 项目的完整算子索引（FAISS）和元数据知识库。当用户提问时，Agent 会自主决定是否需要检索知识库，检索哪些算子，并将准确的技术细节（包括代码片段、参数说明）反馈给用户。

## 2. 核心特性 

该功能模块由前端 UI (`gradio_app/pages/operator_qa.py`)、执行工作流 (`dataflow_agent/workflow/wf_operator_qa.py`) 和后端智能体 (`dataflow_agent/agentroles/data_agents/operator_qa_agent.py`) 共同驱动，具备以下核心能力：

### 2.1 智能检索与推荐

Agent 并非简单地进行关键词匹配，而是基于语义理解用户的需求。

- **语义搜索**：用户只需描述“我想过滤掉缺失值”，Agent 会通过向量检索找到 `ContentNullFilter`等相关算子。
- **按需调用**：基于 `BaseAgent` 的图模式 (`use_agent=True`)，Agent 会根据对话上下文自动判断是否需要调用 `search_operators` 工具，或者直接基于上下文回答。

### 2.2 多轮对话 

利用 `AdvancedMessageHistory` 模块，系统维护了完整的会话上下文。

- **上下文记忆**：用户可以先问“有哪些加载数据的算子？”，接着问“**它**的参数怎么填？”。Agent 能识别“它”指的是上一轮推荐的算子。
- **状态保持**：在脚本交互模式或 UI 中，通过复用同一个 `state` 和 `graph` 实例，`messages` 列表会在多轮对话中累积，确保 LLM 拥有完整记忆。

### 2.3 可视化与交互 

- **Gradio UI**：提供代码预览、算子高亮和快捷提问按钮。
- **交互**：支持多轮问答，支持清除历史、查看历史等。

## 3. 架构组件

### 3.1 OperatorQAAgent

- 继承自 `BaseAgent`，配置为 ReAct/Graph 模式。
- 它拥有后置工具（Post-Tools）权限，可以调用 RAG 服务获取数据。
- 它负责解析用户的自然语言，规划是否查库，并生成最终的自然语言回复。

### 3.2 OperatorRAGService 

- 这是一个与 Agent 解耦的服务层。
- 管理 FAISS 向量索引和 `ops.json` 元数据。
- 提供 `search`（向量搜索）、`get_operator_info`（获取详情）、`get_operator_source`（获取源码）等底层能力。

## 4. 使用指南

本功能提供 **图形界面 (Gradio UI)** 和 **命令行脚本** 两种使用方式。

### 4.1 界面操作

适合交互式探索和快速验证。启动 Web 界面：
```python
python gradio_app/app.py
```
访问 `http://127.0.0.1:7860` 开始使用

1. **配置模型**：在右侧“配置”面板确认 API URL 和 Key，并选择模型（默认使用 `gpt-4o`）。
2. **发起提问**：
   1. **对话框**：输入你的问题。
   2. **快捷按钮**：也可以点击下方的“快捷问题”按钮，如“过滤缺失值用什么算子？”快速开始。
3. **查看结果**：
   1. **对话区**：显示 Agent 的回答和引用来源。
   2. **右侧面板**：
      - `相关算子`：列出 Agent 检索到的算子名称。
      - `代码片段`：如果涉及具体实现，这里会显示 Python 源码。

### 4.2 脚本调用与显式配置 

除了 UI 界面，系统提供了 `script/run_dfa_operator_qa.py` 脚本。这种方式适合开发调试，或者通过代码自动化地查询算子用法。

#### 1. 修改配置

打开 `script/run_dfa_operator_qa.py`，在文件顶部的配置区域进行修改。

**API 和文件配置**

* **CHAT_API_URL**: LLM 服务地址。
* **API_KEY**: 模型调用密钥。Agent 需要调用大模型来理解您的问题并总结答案。
* **MODEL**: 模型名称，默认为 `gpt-4o`。
* **CACHE_DIR**: 缓存目录。
* **TOP_K**: 检索深度。指定 Agent 在知识库中检索相关算子时，最多返回多少个候选结果（默认 5 个）。

**查询与交互模式配置**

* **INTERACTIVE**: **交互控制开关**（`True` / `False`）。
   * `True` (交互模式)：启动终端内的连续对话模式，您可以像聊天一样不断追问，支持 `clear` 清除历史。
   * `False` (单次模式)：脚本只执行 `QUERY` 指定的一个问题，输出结果后立即结束。
* **QUERY**: 单次查询的问题内容。仅在 `INTERACTIVE = False` 时生效。
* **OUTPUT_JSON**: 结果保存路径。
   * 仅在单次模式下生效。
   * 如果设置了路径，Agent 的回答、检索到的算子列表及代码片段会被完整保存为 JSON 文件；留空则只打印到控制台。



#### 2. 运行脚本

配置完成后，在终端执行：

```bash
python script/run_dfa_operator_qa.py

```

#### 3. 结果输出

脚本执行后，根据模式不同，控制台会有不同表现：

* **交互模式**：终端会出现 `🧑 你:` 提示符，等待输入。
   * 输入 `exit` 或 `quit` 退出。
   * 输入 `clear` 清除对话历史
   * 输入 `history` 查看历史对话。
* **单次模式**：控制台将直接打印 Agent 的思考过程、检索到的算子列表以及最终回答。如果配置了 `OUTPUT_JSON`，还会提示文件保存成功。

#### 4. 实战 Case：查找“清洗数据”的算子

假设您在开发 Pipeline 时遇到数据需要清洗，想知道 DataFlow 库里有没有现成的算子可以处理。

**场景配置：** 我们将其设置为单次查询模式，并指定将结果保存到本地，以便后续在代码中查看详细参数。

打开脚本修改如下配置：

```python
# ===== Example config (edit here) =====

# 1. 关闭交互模式，执行单次查询
INTERACTIVE = False 

# 2. 定义您的具体需求
QUERY = "我想清洗数据，应该用哪个算子？"

# 3. 确保 API 配置正确
CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
API_KEY = os.getenv("DF_API_KEY", "")
MODEL = os.getenv("DF_MODEL", "gpt-4o")

# 4. 指定结果保存位置 
OUTPUT_JSON = "cache_local/operator_qa_result.json"


```

**运行：**

运行脚本后，Agent 会执行 RAG 检索并生成回答。打开生成的 `script/cache_local/operator_qa_result.json`，您可以看到如下结构的数据：

```json
{
  "success": true,
  "query": "我想清洗数据，应该用哪个算子？",
  "answer": "对于数据清洗任务，您可以考虑使用以下算子：\n\n1. **KBCTextCleanerBatch**：用于对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化，提升RAG知识库的质量。\n\n2. **KBCTextCleaner**：类似于KBCTextCleanerBatch，专注于知识内容的标准化处理。\n\n3. **HtmlUrlRemoverRefiner**：去除文本中的URL链接和HTML标签，净化文本内容。\n\n4. **RemoveNumberRefiner**：移除文本中的数字字符，保留纯文本内容。\n\n5. **ReferenceRemoverRefiner**：删除文本中未闭合的引用标签和引用链接，净化文本中的引用标记。",
  "related_operators": [
    "KBCTextCleanerBatch",
    "KBCTextCleaner",
    "HtmlUrlRemoverRefiner",
    "RemoveNumberRefiner",
    "ReferenceRemoverRefiner"
  ],
  "code_snippet": null,
  "follow_up_suggestions": [
    "您需要清洗哪种类型的数据？",
    "是否需要了解某个算子的详细参数配置？",
    "需要查看算子的源码实现吗？"
  ],
  "messages": [
    {
      "type": "SystemMessage",
      "content": "\n[角色]\n你是 DataFlow 算子库的智能问答助手。你的职责是帮助用户了解和使用 DataFlow 中的各种数据处理算子。\n\n[能力]\n1. 根据用户描述的需求，推荐合适的算子\n2. 解释算子的功能、用途和使用场景\n3. 详细说明算子的参数含义和配置方法\n4. 在需要时展示算子的源码实现\n5. 基于多轮对话理解用户的上下文需求\n\n[DataFlow 算子简介]\nDataFlow 是一个数据处理框架，提供了丰富的算子用于数据清洗、过滤、生成、评估等任务。\n每个算子都是一个 Python 类，通常包含：\n- `__init__` 方法：初始化算子，配置必要的参数（如 LLM 服务、提示词等）\n- `run` 方法：执行数据处理逻辑，接收输入数据并产出处理结果\n\n[可用工具]\n你可以调用以下工具来获取算子信息：\n\n1. **search_operators(query, top_k)** - 根据功能描述搜索相关算子\n   - 当用户询问某类功能的算子时使用\n   - 如果对话历史中已有相关算子信息，可以不调用直接回答\n\n2. **get_operator_info(operator_name)** - 获取指定算子的详细描述\n   - 当用户询问特定算子的功能时使用\n\n3. **get_operator_source_code(operator_name)** - 获取算子的完整源代码\n   - 当用户需要了解算子实现细节时使用\n\n4. **get_operator_parameters(operator_name)** - 获取算子的参数详情\n   - 当用户询问算子如何配置、参数含义时使用\n\n[工具调用策略]\n- 如果是新问题且对话历史中没有相关信息 → 调用 search_operators 检索\n- 如果对话历史中已有相关算子信息 → 可以直接回答，无需重复检索\n- 如果用户追问某个算子的细节 → 调用 get_operator_info/get_operator_source_code/get_operator_parameters\n\n[回答风格]\n1. 清晰简洁，重点突出\n2. 使用中文回答（除非用户要求英文）\n3. 对于技术细节，提供具体的代码示例\n4. 在解释参数时，说明参数类型、默认值和作用\n\n[输出格式]\n请以 JSON 格式返回，包含以下字段：\n{\n    \"answer\": \"对用户问题的详细回答\",\n    \"related_operators\": [\"相关算子名称列表\"],\n    \"source_explanation\": \"说明答案的信息来源，例如：'通过search_operators检索到的XXX算子'、'基于对话历史中的算子信息'、'基于我的知识库'\",\n    \"code_snippet\": \"如有必要，提供代码片段（可选）\",\n    \"follow_up_suggestions\": [\"可能的后续问题建议（可选）\"]\n}\n\n\n请以JSON格式返回结果，不要包含其他文字说明!!!直接返回json内容，不要```json进行包裹！！",
      "role": "",
      "additional_kwargs": {},
      "metadata": {}
    },
    {
      "type": "HumanMessage",
      "content": "\n[用户问题]\n我想清洗数据，应该用哪个算子？\n\n[任务]\n请根据用户问题回答。对话历史会自动包含在消息中，你可以参考之前的对话。\n\n工具调用指南：\n1. 如果需要查找算子，调用 search_operators 工具\n2. 如果需要某个算子的详细信息，调用 get_operator_info 工具\n3. 如果需要源码，调用 get_operator_source_code 工具\n4. 如果需要参数详情，调用 get_operator_parameters 工具\n5. 如果之前的对话中已有相关信息，可以直接回答，无需重复调用工具\n\n回答要求：\n- 基于工具返回的信息或对话上下文中的信息回答\n- 在 source_explanation 中说明答案来源\n- 如果问题不明确，可以在 follow_up_suggestions 中给出澄清建议\n\n请以 JSON 格式返回你的回答。\n",
      "role": "",
      "additional_kwargs": {},
      "metadata": {}
    },
    {
      "type": "AIMessage",
      "content": "",
      "role": "",
      "additional_kwargs": {
        "tool_calls": [
          {
            "id": "call_DZer3f6W1WLsvDeHBktupSXw",
            "function": {
              "arguments": "{\"query\":\"数据清洗\"}",
              "name": "search_operators"
            },
            "type": "function"
          }
        ],
        "refusal": null
      },
      "metadata": {}
    },
    {
      "content": "{\n  \"query\": \"数据清洗\",\n  \"matched_operators\": [\n    \"KBCTextCleanerBatch\",\n    \"KBCTextCleaner\",\n    \"HtmlUrlRemoverRefiner\",\n    \"RemoveNumberRefiner\",\n    \"ReferenceRemoverRefiner\"\n  ],\n  \"operator_details\": [\n    {\n      \"node\": 1,\n      \"name\": \"KBCTextCleanerBatch\",\n      \"description\": \"知识清洗算子：对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化，提升RAG知识库的质量。主要功能：\\n1. 移除冗余HTML标签但保留语义化标签\\n2. 标准化引号/破折号等特殊字符\\n3. 处理超链接同时保留文本\\n4. 保持原始段落结构和代码缩进\\n5. 确保事实性内容零修改\",\n      \"category\": \"knowledge_cleaning\"\n    },\n    {\n      \"node\": 2,\n      \"name\": \"KBCTextCleaner\",\n      \"description\": \"知识清洗算子：对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化，提升RAG知识库的质量。主要功能：\\n1. 移除冗余HTML标签但保留语义化标签\\n2. 标准化引号/破折号等特殊字符\\n3. 处理超链接同时保留文本\\n4. 保持原始段落结构和代码缩进\\n5. 确保事实性内容零修改\\n\\n输入格式示例：\\n<div class=\\\"container\\\">\\n  <h1>标题文本</h1>\\n  <p>正文段落，包括特殊符号，例如“弯引号”、–破折号等</p>\\n  <img src=\\\"example.jpg\\\" alt=\\\"示意图\\\">\\n  <a href=\\\"...\\\">链接文本</a>\\n  <pre><code>代码片段</code></pre>\\n  ...\\n</div>\\n\\n输出格式示例：\\n标题文本\\n\\n正文段落，包括特殊符号，例如\\\"直引号\\\"、-破折号等\\n\\n[Image: 示例图 example.jpg]\\n\\n链接文本\\n\\n<code>代码片段</code>\\n\\n[结构保持，语义保留，敏感信息脱敏处理（如手机号、保密标记等）]\",\n      \"category\": \"knowledge_cleaning\"\n    },\n    {\n      \"node\": 3,\n      \"name\": \"HtmlUrlRemoverRefiner\",\n      \"description\": \"去除文本中的URL链接和HTML标签，净化文本内容。使用正则表达式匹配并移除各种形式的URL和HTML标签。输入参数：\\n- input_key：输入文本字段名\\n输出参数：\\n- 包含净化后文本的DataFrame\\n- 返回输入字段名，用于后续算子引用\",\n      \"category\": \"general_text\"\n    },\n    {\n      \"node\": 4,\n      \"name\": \"RemoveNumberRefiner\",\n      \"description\": \"该算子用于移除文本中的数字字符，包括0-9的阿拉伯数字。\\n通过字符过滤实现数字移除，保留纯文本内容。\\n输入参数：\\n- 无初始化参数\\n运行参数：\\n- input_key：输入文本字段名\\n输出参数：\\n- 处理后的DataFrame，包含去除数字的文本\\n- 返回包含输入字段名的列表，用于后续算子引用\",\n      \"category\": \"general_text\"\n    },\n    {\n      \"node\": 5,\n      \"name\": \"ReferenceRemoverRefiner\",\n      \"description\": \"删除文本中未闭合的引用标签和引用链接，包括<ref>标签和{{cite}}模板的各种完整和不完整形式。净化文本中的引用标记。输入参数：\\n- input_key：输入文本字段名\\n输出参数：\\n- 包含移除引用标记后文本的DataFrame\\n- 返回输入字段名，用于后续算子引用\",\n      \"category\": \"general_text\"\n    }\n  ]\n}",
      "additional_kwargs": {},
      "response_metadata": {},
      "type": "tool",
      "name": "search_operators",
      "id": "63bb6bcd-5184-456f-91d8-72fb06b9cdc0",
      "tool_call_id": "call_DZer3f6W1WLsvDeHBktupSXw",
      "artifact": null,
      "status": "success"
    },
    {
      "type": "AIMessage",
      "content": "{\n    \"answer\": \"对于数据清洗任务，您可以考虑使用以下算子：\\n\\n1. **KBCTextCleanerBatch**：用于对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化，提升RAG知识库的质量。\\n\\n2. **KBCTextCleaner**：类似于KBCTextCleanerBatch，专注于知识内容的标准化处理。\\n\\n3. **HtmlUrlRemoverRefiner**：去除文本中的URL链接和HTML标签，净化文本内容。\\n\\n4. **RemoveNumberRefiner**：移除文本中的数字字符，保留纯文本内容。\\n\\n5. **ReferenceRemoverRefiner**：删除文本中未闭合的引用标签和引用链接，净化文本中的引用标记。\",\n    \"related_operators\": [\n        \"KBCTextCleanerBatch\",\n        \"KBCTextCleaner\",\n        \"HtmlUrlRemoverRefiner\",\n        \"RemoveNumberRefiner\",\n        \"ReferenceRemoverRefiner\"\n    ],\n    \"source_explanation\": \"通过search_operators检索到的相关算子\",\n    \"code_snippet\": null,\n    \"follow_up_suggestions\": [\n        \"您需要清洗哪种类型的数据？\",\n        \"是否需要了解某个算子的详细参数配置？\",\n        \"需要查看算子的源码实现吗？\"\n    ]\n}",
      "role": "",
      "additional_kwargs": {
        "refusal": null
      },
      "metadata": {}
    }
  ]
}

```

