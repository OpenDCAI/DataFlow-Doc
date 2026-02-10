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

该功能由 `dataflow_agent/workflow/wf_pipeline_prompt.py` 定义，核心为一个**单节点**工作流。所有的生成与验证逻辑均高度内聚在 `PromptWriter` Agent 中。

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

本功能提供 **图形界面 (Gradio UI)** 和 **命令行脚本** 两种使用方式。

### 4.1 图形界面 

前端代码位于 `gradio_app/pages/PA_frontend.py`，提供了可视化的交互体验，适合交互式探索和快速验证。启动 Web 界面：
```python
python gradio_app/app.py
```
访问 `http://127.0.0.1:7860` 开始使用

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

**使用生成的 Prompt：**

1. 从"Prompt 文件路径"获取生成的 Prompt 文件位置
2. 将 Prompt 类导入到您的算子中
3. 在算子的 `init()` 中指定 `prompt_template`

### 4.2 脚本调用与显式配置

对于需要将 Prompt 生成集成到自动化流水线，或者习惯代码配置的开发者，可以使用 `script/run_dfa_pipeline_prompt.py`。

#### 1. 修改配置

打开 `script/run_dfa_pipeline_prompt.py`，在文件顶部的配置区域进行修改。

**API 配置**
  * **`CHAT_API_URL`**: LLM 服务地址
  * **`api_key`**: 访问密钥（使用环境变量 DF_API_KEY）
  * **`MODEL`**: 模型名称，默认 gpt-4o

**任务配置**
  * **`TASK_DESCRIPTION`**: 用自然语言描述您希望这个 Prompt 完成什么任务
    * 示例：`"我想写一个适用于金融问题的过滤器提示词."`
  * **`OP_NAME`**: 指定生成的 Prompt 将被哪个算子加载使用
  * **`OUTPUT_FORMAT`** (可选): 指定 Prompt 输出的格式。如果不填，Agent 会仿照已有提示词生成
  * **`ARGUMENTS`** (可选): Prompt 模板需要的参数，用逗号、空格或换行分隔
    * 示例：`["min_len=10", "drop_na=true"]`

**环境配置**
  * **`CACHE_DIR`**: 结果输出目录。生成的 Prompt 文件（`.py`）、临时的测试数据、测试代码等都会保存在这里
  * **`DELETE_TEST_FILES`**: 运行结束后是否自动清理临时的合成测试数据（`True`/`False`）

#### 2. 运行脚本

配置完成后，在终端执行：

```bash
python script/run_dfa_pipeline_prompt.py

```

#### 3. 结果输出

脚本执行完毕后，控制台会打印生成过程。您可以在 `CACHE_DIR` 目录下找到生成的文件

#### 4. 实战 Case：复用ReasoningQuestionFilter过滤器，编写适用金融问题的过滤器提示词

假设我们想复用系统中的 `ReasoningQuestionFilter` 算子，让它变成为一个金融领域问题的过滤器。打开脚本修改如下配置：

```python
# ===== Example config (edit here) =====

# 1. 定义任务
TASK_DESCRIPTION = "我想写一个适用于金融问题的过滤器提示词"

# 2. 指定复用的算子 (告诉 Agent 这个 Prompt 是给 PromptedGenerator 用的)
OP_NAME = "ReasoningQuestionFilter"

# 这两项在算子不拥有任何一个预置提示词时才需要提供，否则会仿照已有提示词生成
OUTPUT_FORMAT = ""  # e.g. "Return JSON with keys: ..."
ARGUMENTS = []      # e.g. ["min_len=10", "drop_na=true"]

# 缓存目录，用于存储测试数据和提示词
CACHE_DIR = "./pa_cache"
DELETE_TEST_FILES = False

```

**运行：**

运行脚本后，终端会输出执行的日志，您可以在 `CACHE_DIR` 目录下找到生成的 Prompt 文件`finance_question_filter_prompt20260209143556.py`、测试代码`test_FinanceQuestionFilterPrompt.py`以及测试数据，生成的 Prompt 内容如下：
``` python
__all__ = ['FinanceQuestionFilterPrompt']

from dataflow.core.prompt import DIYPromptABC

class FinanceQuestionFilterPrompt(DIYPromptABC):
    def __init__(self):
        pass
    
    def build_prompt(self, question: str) -> str:
        prompt = f"""
        # 角色：
        你是一个金融问题的审核助手。
        # 任务
        你的任务是检查给定的金融问题是否符合以下标准：
        0. 首先，确认输入仅包含一个明确的金融问题（没有额外的指令如“重写”、“翻译”或提供的答案）；如果不符合，输出 judgement_test=false。
        1. 检查拼写、语法和格式（例如货币符号、百分比表示），不解释语义。
        2. 对于每个最小前提（无法进一步分解），验证其是否违反常识、金融领域事实或任务要求（例如，“负利率”在某些情况下可能无效）；如果无效，则失败。
        3. 检查前提之间或推理过程中的任何矛盾，或者最终结果是否明显不合理或不可解；如果是，则失败。
        4. 如果以上都通过，检查是否有足够的信息来完成任务；缺少必要条件 ⇒ 失败，冗余细节是可以接受的。

        # 输出格式
        完成这些步骤后，输出格式必须为：
        {{
            "judgement_test": true/false,
            "error_type": "<错误描述或null>"
        }}
        你可以包括你的思维过程，但最终输出必须是上面的JSON格式。

        这里是需要评估的内容：
        -------------------------------
        {question}
        -------------------------------
        """
        return prompt
```
Agent 生成的测试代码`test_FinanceQuestionFilterPrompt.py`如下：
``` python
"""
Auto-generated by prompt_writer
"""
from dataflow.pipeline import PipelineABC
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request, LocalModelLLMServing_vllm

try:
    from dataflow.operators.reasoning.filter.reasoning_question_filter import ReasoningQuestionFilter
except Exception:
    from dataflow.operators.reasoning import ReasoningQuestionFilter
from finance_question_filter_prompt20260209143556 import FinanceQuestionFilterPrompt

class RecommendPipeline(PipelineABC):
    def __init__(self):
        super().__init__()
        # -------- FileStorage --------
        self.storage = FileStorage(
            first_entry_file_name="./pa_cache/prompt_test_data.jsonl",
            cache_path="./pa_cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        # -------- LLM Serving (Remote) --------
        self.llm_serving = APILLMServing_request(
            api_url="http://123.129.219.111:3000/v1/chat/completions",
            key_name_of_api_key="DF_API_KEY",
            model_name="gpt-4o",
            max_workers=100,
        )

        self.reasoning_question_filter = ReasoningQuestionFilter(system_prompt='You are a helpful assistant.', llm_serving=self.llm_serving, prompt_template=FinanceQuestionFilterPrompt())

    def forward(self):
        self.reasoning_question_filter.run(
            storage=self.storage.step(), input_key='math_problem'
        )

if __name__ == "__main__":
    pipeline = RecommendPipeline()
    pipeline.compile()
    pipeline.forward()
```