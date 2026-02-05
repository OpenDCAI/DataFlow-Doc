---
title: 算子复用/提示词优化
createTime: 2026/02/05 22:11:00
permalink: /zh/guide/agent/pipeline_prompt/
---

## 1. 概述

**提示词优化**是 DataFlow-Agent 面向 **Prompt-Engineering** 的核心模块。它的设计目标是解决“通用算子逻辑复用”的问题。

该模块采用**单节点架构**。当用户提出一个新的数据处理需求时，Agent 不仅会编写符合算子规范的 Prompt，还会**自动生成合成测试数据**，并在内部构建和运行测试脚本。

## 2. 核心特性

### 2.1 基于范例的生成 

- **算子代码分析**：Agent 会自动读取目标算子（`OP_NAME`）的源码，提取其参数定义。
- **Prompt 迁移**：系统检索算子库中已有的 Prompt 案例，将其作为上下文，指导 LLM 生成符合该算子接口规范（如 `init` 参数结构）的新 Prompt 类。

### 2.2 基于合成数据的自我验证 

生成的 Prompt 不会仅停留在文本层面，Agent 会立即对其进行测试。

- **数据合成**：Agent **不需要**用户的大规模业务数据进行测试，而是利用 LLM 分析算子逻辑，自动生成一组覆盖多种边界情况的**合成测试数据**，保存为临时的 JSONL 文件。
- **子进程执行**：Agent 内部会自动构建一个临时 Python 测试脚本，并启动子进程执行该脚本，验证生成的 Prompt 是否能正确跑通并产生预期结果。

### 2.3 迭代优化 

- **交互式反馈**：系统不进行盲目的自动重试。用户在前端查看测试结果、生成的 Prompt 和数据预览后，输入修改意见。
- **定向热更新**：后端 `PromptWriter` 接收反馈后，调用 `revise_with_feedback` 方法，在保持现有上下文的基础上定向修改 Prompt 代码，并自动触发新一轮的测试循环。

## 3. 系统架构 

该功能由 `wf_pipeline_prompt.py` 定义，核心为一个**单节点**工作流。所有的生成与验证逻辑均高度内聚在 `PromptWriter` Agent 中。

### 3.1 核心节点流程

**Prompt Writer Node** 是图中唯一的节点，它按顺序执行以下内部逻辑：

1. **上下文检索**: 调用 Pre-tools 获取目标算子的源码、用户的target 和 Prompt 范例。
2. **提示词生成**: 调用 LLM 生成 Python 形式的 Prompt 类代码。随后通过 `update_state_result` 方法将生成的代码保存到 `state` 对象并写入本地文件，为后续测试步骤提供依赖。
3. **测试数据合成**: 调用内部方法 `_build_test_data_by_llm`，根据任务描述生成合成测试数据。
4. **测试脚本构建**: 调用内部方法 `_build_test_code`，利用字符串模板生成临时的测试脚本。
5. **子进程执行**: 使用 `subprocess` 运行测试脚本，捕获标准输出 (stdout) 和标准错误 (stderr)。
6. **测试结果输出**: 扫描读取子进程运行生成的测试结果文件，将测试结果更新到 `state.temp_data` 中，完成流程。

### 3.2 迭代优化机制

优化过程依赖于**前端交互**：

1. 用户在 UI 查看执行结果。
2. 用户提交反馈。
3. 前端调用 `_on_chat_submit`，触发 Agent 的 `revise_with_feedback` 接口。
4. Agent 根据反馈修改代码并重新复用执行上述的验证阶段，即测试数据合成 -> 测试脚本构建 -> 子进程执行。

## 4. 使用指南

### 4.1 图形界面 

前端代码位于 `PA_frontend.py`，提供了完整的交互式开发环境。

**初次生成：**

1. 配置 API 信息（URL、Key、模型）
2. 填写任务描述、算子名称
3. （可选）指定输出格式、参数列表和文件输出根路径
4. 点击"生成 Prompt 模板"按钮
5. 查看 Agent 生成的测试数据、测试结果、Prompt 代码和测试代码

**多轮优化：**

1. 如果结果不符合预期，在右侧对话框中输入改进建议
2. 点击"发送改写指令"
3. 查看更新后的代码和测试结果
4. 重复步骤 1-3 直到获得满意结果

使用生成的 Prompt**：**

1. 从"Prompt 文件路径"获取生成的 Prompt 文件位置
2. 将 Prompt 类导入到您的算子中
3. 在算子的 `init()` 中指定 `prompt_template`

### 4.2 脚本调用

使用 `run_dfa_pipeline_prompt.py` 脚本进行自动化生成。

**配置参数**:

```Python
CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
MODEL = os.getenv("DF_MODEL", "gpt-4o")
LANGUAGE = "en"

TASK_DESCRIPTION = "Write a prompt for an operator that filters missing values"
OP_NAME = "PromptedFilter"

# 这两项在算子不拥有任何一个预置提示词时才需要提供，否则会仿照已有提示词生成
OUTPUT_FORMAT = ""  # e.g. "Return JSON with keys: ..."
ARGUMENTS = []      # e.g. ["min_len=10", "drop_na=true"]

# 缓存目录，用于存储测试数据和提示词
CACHE_DIR = "./pa_cache"
DELETE_TEST_FILES = True
```

**运行命令**:

```Bash
python run_dfa_pipeline_prompt.py
```