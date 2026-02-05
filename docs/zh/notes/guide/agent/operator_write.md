---
title: 算子编写
createTime: 2026/02/05 22:11:00
permalink: /zh/guide/agent/operator_write/
---

## 1. 概述 

**算子编写 (Operator Write)** 是 DataFlow-Agent 的核心生产力模块。它不仅仅是根据用户需求生成一段 Python 代码，而是构建了一个闭环的**生成-执行-调试**系统。

该工作流能够：

1. **语义匹配**：理解用户意图（如“过滤缺失值”），在现有算子库中寻找最匹配的基类。
2. **代码生成**：基于基类和用户数据样例，编写可执行的算子代码。
3. **自动注入**：如果需要，为算子注入 LLM 服务能力。
4. **子进程执行**：在一个受控环境中实例化并运行生成的算子。
5. **自我修复**：如果执行报错，启动 Debugger 分析堆栈信息，自动修改代码并重试，直到成功或达到最大重试次数。

## 2. 核心特性 

### 2.1 智能代码生成

- **基于样例编程**：Agent 会读取实际的数据样例 (调用前置工具`local_tool_for_sample`) 和数据 Schema，确保生成的代码能够正确处理真实的字段名和数据类型。
- **算子复用**：系统优先检索现有的算子库（调用前置工具`match_operator`），生成继承自现有基类的代码，而不是从零开始，保证了代码的规范性和可维护性。

### 2.2 自动调试闭环 

这是一个具备自我反思能力的系统。

- **执行监控**：在 `llm_instantiate` 节点，系统尝试执行生成的代码 (`exec(code_str)`) 并捕获标准输出和标准错误。
- **错误诊断**：如果发生异常，`code_debugger` Agent 会分析错误堆栈 (`error_trace`) 和当前代码，生成修复建议 (`debug_reason`)。
- **自动重写**：`rewriter` Agent 根据修复建议重新生成代码，并自动更新文件，进入下一轮测试。

### 2.3 LLM 服务注入

对于需要调用大模型的复杂算子（如“根据内容生成摘要”），`llm_append_serving` 节点会自动在算子代码中注入标准的 LLM 调用接口 (`self.llm_serving`)，使其具备 AI 能力。

## 3. 工作流架构

该功能由 `wf_pipeline_write.py` 编排，形成一个包含条件循环的有向图。

1. **Match Node**: 检索参考算子。
2. **Write Node**: 编写初始代码。
3. **Append Serving Node**: 注入 LLM 能力。
4. **Instantiate Node**: 尝试运行代码。
5. **Debugger Node** (条件触发): 分析错误。
6. **Rewriter Node**: 修复代码。

## 4. 使用指南

本功能提供 **图形界面 (Gradio UI)** 和 **命令行脚本** 两种使用方式。

### 4.1 界面操作

前端页面代码位于 `operator_write.py`，提供了可视化的交互体验。

#### 1. 配置输入 

在页面的左侧面板进行配置：

- **目标描述**: 详细描述您想要创建的算子功能和用途。
  - 示例: "创建一个算子，用于对文本进行情感分析。"
- **算子类别**: 算子所属类别，用于匹配相似算子作为参考，默认为 `"Default"`，可选：`"filter"`, `"mapper"`, `"aggregator"` 等。
- **测试数据文件**: 指定用于测试生成的算子的 `.jsonl` 文件路径。默认为项目自带的 `tests/test.jsonl`。
- **调试设置**:
  - `启用调试模式 (Enable Debug Mode)`: 勾选后，如果代码报错，系统会自动尝试修复。
  - `最大调试轮次`: 设置自动修复的最大尝试次数（默认 3 次）。
- **输出路径**: 指定生成代码的保存路径（可选）。

#### 2. 查看结果

点击 **"生成算子"** 按钮后，右侧面板会展示详细结果：

- **生成的代码**: 最终可用的 Python 代码，支持语法高亮
- **匹配的算子**: 显示系统在算子库中找到的参考算子列表（如 `"LangkitSampleEvaluator"`,`"LexicalDiversitySampleEvaluator"`,`"PresidioSampleEvaluator"`,`"PerspectiveSampleEvaluator"`等）
- **执行结果**: 显示 `success: true/false` 以及具体的日志信息`stdout`/`stderr`。
- **调试信息**: 如果触发了调试，这里会显示运行时捕获的 `stdout`/`stderr` 以及选定的输入字段键名 (`input_key`)
- **Agent结果:** 各个 Agent 节点的详细执行结果
- **执行日志**: 完整的执行日志信息，方便排查 Agent 的思考过程

### 4.2 脚本调用与显式配置 

对于开发者或自动化任务，可以直接运行 `run_dfa_operator_write.py`。

#### 1. 修改配置

打开 `run_dfa_operator_write.py`，在文件顶部的配置区域修改参数：

```Python
CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
MODEL = os.getenv("DF_MODEL", "gpt-4o")
LANGUAGE = "en"

TARGET = "Create an operator that filters out missing values and keeps rows with non-empty fields."
CATEGORY = "Default"          # 兜底类别（若 classifier 未命中）
OUTPUT_PATH = ""              # e.g. "cache_local/my_operator.py"；空则不落盘
JSON_FILE = ""                # 空则使用项目自带 tests/test.jsonl

NEED_DEBUG = False
MAX_DEBUG_ROUNDS = 3
```

#### 2. 运行脚本

```Bash
python run_dfa_operator_write.py
```

#### 3. 结果输出

脚本会在控制台打印关键信息：

- `Matched ops`: 匹配到的参考算子。
- `Code preview`: 生成代码的预览片段。
- `Execution Result`:
  - `Success: True` 表示代码生成并运行通过。
  - `Success: False` 会打印 `stderr preview` 供排查。
- `Debug Runtime Preview`: 显示自动选择的 `input_key` 和运行时日志。