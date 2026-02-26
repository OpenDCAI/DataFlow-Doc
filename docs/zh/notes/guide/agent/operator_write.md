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

该功能由 `dataflow_agent/workflow/wf_pipeline_write.py` 编排，形成一个包含条件循环的有向图。

1. **Match Node**: 检索参考算子。
2. **Write Node**: 编写初始代码。
3. **Append Serving Node**: 注入 LLM 能力。
4. **Instantiate Node**: 尝试运行代码。
5. **Debugger Node** (条件触发): 分析错误。
6. **Rewriter Node**: 修复代码。

## 4. 使用指南

本功能提供 **图形界面 (Gradio UI)** 和 **命令行脚本** 两种使用方式。

### 4.1 界面操作

前端页面代码位于 `gradio_app/pages/operator_write.py`，提供了可视化的交互体验，适合交互式探索和快速验证。启动 Web 界面：
```python
python gradio_app/app.py
```
访问 `http://127.0.0.1:7860` 开始使用

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

对于开发者，推荐直接修改并运行 `script/run_dfa_operator_write.py`。这种方式可以更灵活地集成到自动化流程中，并保存生成的算子文件。

#### 1. 修改配置

打开 `script/run_dfa_operator_write.py`，在文件顶部的配置区域修改参数。

**任务配置**
  * **`TARGET`**: 用自然语言描述算子的功能。描述越具体，生成的代码越准确。建议包含对输入字段和预期输出的描述。
    * 示例：`"创建一个算子，用于对文本进行情感分析"`
    * 示例：`"实现一个数据去重算子，支持多字段组合去重"`
  * **`CATEGORY`**: 算子所属类别，用于匹配相似算子作为参考
    * 默认：`"Default"`
    * 可选：`"reasoning"`, `"agentic_rag"`, `"knowledge_cleaning"` 等
  * **`JSON_FILE`**: 用于测试算子的数据文件（`.jsonl` 格式）。
    * 默认：留空则使用项目自带的测试数据`tests/test.jsonl`。
  * **`OUTPUT_PATH`**: 生成的 Python 代码保存路径。如果留空，代码只会打印在控制台，不会保存文件。

**API 与 调试配置**
  * **`CHAT_API_URL`**: LLM 服务地址
  * **`api_key`**: 访问密钥（使用环境变量 DF_API_KEY）
  * **`MODEL`**: 模型名称，默认 gpt-4o
  * **`NEED_DEBUG`**: 是否开启自动调试循环 (`True` / `False`)
    * `True`：如果生成的代码在 `JSON_FILE` 上运行报错，Agent 会自动分析错误堆栈并尝试重写代码
    * `False`：生成代码并执行后立即结束，不管是否能运行成功
  * **`MAX_DEBUG_ROUNDS`**: 最大自动修复次数，默认 3 次

#### 2. 运行脚本

配置完成后，在终端执行：

```bash
python script/run_dfa_operator_write.py

```

#### 3. 结果输出

脚本执行过程中会输出以下关键信息：

* **[Match Operator Result]**: 显示 Agent 在现有算子库中找到的“参考算子”
* **[Writer Result]**: 生成的代码长度和保存位置
* **[Execution Result]**：代码执行结果
  * `Success: True`：表示代码生成成功，且在测试数据上运行无误。
  * `Success: False`：表示运行失败。
* **[Debug Runtime Preview]**：运行时捕获的 `stdout`/`stderr` 以及选定的输入字段键名 (`input_key`)

### 4.3 实战 Case：编写一个情感分析算子

你可以参考以下教程学习，也可以参考我们提供的[Google Colab](https://colab.research.google.com/drive/1oTkwMNwxMFGAe9rNtYCC47CQ9HxsA0uH?usp=sharing)样例来运行：

我们有一个日志文件 `tests/test.jsonl`，其中包含字段 `"raw_content"`。我们希望创建一个算子，对该字段的文本内容进行情感分析。

**配置示例：**

```python
# ===== Example config (edit here) =====、
# API KEY 通过设置环境变量 DF_API_KEY 传入
CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
MODEL = os.getenv("DF_MODEL", "gpt-4o")
LANGUAGE = "en"

# 1. 定义具体需求
TARGET = "创建一个算子，用于对文本进行情感分析"
CATEGORY = "Default"          
# 2. 指定结果保存路径
OUTPUT_PATH = "cache_local/my_operator.py"
# 3. 指定测试数据路径 
JSON_FILE = "tests/test.jsonl"
# 4. 开启调试
NEED_DEBUG = True
MAX_DEBUG_ROUNDS = 10

```

**运行：**
运行脚本后，终端会给出以下输出：
``` bash
==== Match Operator Result ====
Matched ops: ['LangkitSampleEvaluator', 'LexicalDiversitySampleEvaluator', 'PresidioSampleEvaluator', 'PerspectiveSampleEvaluator']

==== Writer Result ====
Code length: 3619
Saved to: cache_local/my_operator.py

==== Execution Result (instantiate) ====
Success: True

==== Debug Runtime Preview ==== 
input_key: raw_content
available_keys: ['raw_content']
[debug stdout]
 [selected_input_key] raw_content

[debug stderr]
Generating......: 100%|######### | 18/20 [00:08<00:00,  3.34it/s]
```
生成的代码保存到 `script/cache_local/my_operator.py`中，打开可以查看生成的代码：
``` python
from dataflow.core import OperatorABC
from dataflow.utils.registry import OPERATOR_REGISTRY
from dataflow.utils.storage import DataFlowStorage, FileStorage
from dataflow import get_logger
from dataflow.serving import APILLMServing_request
import pandas as pd

@OPERATOR_REGISTRY.register()
class SentimentAnalysisOperator(OperatorABC):
    def __init__(self, llm_serving=None):
        self.logger = get_logger()
        self.logger.info(f'Initializing {self.__class__.__name__}...')
        self.llm_serving = llm_serving
        self.score_name = 'SentimentScore'
        self.logger.info(f'{self.__class__.__name__} initialized.')

    @staticmethod
    def get_desc(lang: str = "zh"):
        if lang == "zh":
            return (
                "使用LLM进行文本情感分析，返回情感得分，得分越高表示情感越积极。\n"
                "输入参数：\n"
                "- llm_serving：LLM服务对象\n"
                "- input_key：输入文本字段名\n"
                "- output_key：输出得分字段名，默认'SentimentScore'\n"
                "输出参数：\n"
                "- 包含情感分析得分的DataFrame"
            )
        else:
            return (
                "Perform sentiment analysis on text using LLM, returning sentiment scores where higher scores indicate more positive sentiment.\n"
                "Input Parameters:\n"
                "- llm_serving: LLM serving object\n"
                "- input_key: Field name for input text\n"
                "- output_key: Field name for output score, default 'SentimentScore'\n"
                "Output Parameters:\n"
                "- DataFrame containing sentiment analysis scores"
            )

    def get_score(self, samples: list[dict], input_key: str) -> list[float]:
        texts = [sample.get(input_key, '') or '' for sample in samples]
        return self.llm_serving.generate_from_input(texts)

    def eval(self, dataframe: pd.DataFrame, input_key: str) -> list[float]:
        self.logger.info(f"Evaluating {self.score_name}...")
        samples = dataframe.to_dict(orient='records')
        scores = self.get_score(samples, input_key)
        self.logger.info("Evaluation complete!")
        return scores

    def run(self,
            storage: DataFlowStorage,
            input_key: str | None = None,
            output_key: str = 'SentimentScore'):
        dataframe = storage.read("dataframe")
        if input_key is None:
            input_key = self._auto_select_input_key(dataframe)
        dataframe[output_key] = self.eval(dataframe, input_key)
        storage.write(dataframe)

    def _auto_select_input_key(self, dataframe: pd.DataFrame) -> str:
        preferred_keys = ['raw_content', 'text', 'content', 'sentence', 'instruction', 'input', 'query', 'problem', 'prompt']
        for key in preferred_keys:
            if key in dataframe.columns and dataframe[key].notnull().any():
                return key
        return dataframe.columns[0]

# Runnable entry code

test_data_path = '/root/autodl-tmp/DataFlow-Agent/tests/test.jsonl'

# Initialize FileStorage
storage = FileStorage(first_entry_file_name=test_data_path, cache_path="./cache_local", file_name_prefix="dataflow_cache_step", cache_type="jsonl")
storage = storage.step()

# Initialize llm_serving
llm_serving = APILLMServing_request(api_url="http://123.129.219.111:3000/v1/chat/completions", key_name_of_api_key="DF_API_KEY", model_name="gpt-4o")

# Select input key
available_keys = ['raw_content']
preselected_input_key = 'raw_content'
input_key = preselected_input_key if preselected_input_key in available_keys else available_keys[0]
print(f"[selected_input_key] {input_key}")

# Instantiate and run the operator
operator = SentimentAnalysisOperator(llm_serving=llm_serving)
operator.run(storage=storage, input_key=input_key)
```