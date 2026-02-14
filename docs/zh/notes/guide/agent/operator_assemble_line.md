---
title: 可视化算子编排
createTime: 2026/02/05 22:11:00
permalink: /zh/guide/agent/operator_assemble_line/
---

## 1. 概述

**可视化算子编排** 是 DataFlow-Agent 平台提供的一个“低代码/无代码”开发工具。它允许用户跳过复杂的 Python 编码或 AI 规划过程，直接通过图形用户界面（UI）浏览系统中的可用算子（Operators），手动配置参数，并将它们组装成有序的数据处理流水线。

该功能的核心价值在于：

- **所见即所得**：实时查看算子参数定义和流水线结构。
- **自动链接**：系统会自动尝试将上一个算子的输出（Output）与下一个算子的输入（Input）进行匹配，简化数据流配置。
- **代码生成与执行**：编排好的逻辑会被自动转换为标准的 Python 代码并在后台执行。

## 2. 功能特性 

该功能模块主要由前端交互逻辑 (`gradio_app/pages/op_assemble_line.py`) 和后端执行工作流 (`dataflow_agent/workflow/wf_df_op_usage.py`) 组成。

### 2.1 动态算子加载与自省

系统启动时会自动扫描 `OPERATOR_REGISTRY`，加载所有注册的算子，并根据其模块路径自动分类。

- **参数自动解析**：系统通过 Python 的 `inspect` 模块自动提取算子类的 `init` 和 `run` 方法签名，在 UI 上生成对应的配置框。
- **Prompt 模板支持**：对于支持 Prompt 的算子，UI 会自动读取 `ALLOWED_PROMPTS` 并提供下拉选择框。

### 2.2 智能参数链接 

在 UI 编排过程中，系统具备“自动接线”能力。它会分析相邻两个算子的输入输出关系，自动匹配名称相似的 Key，并通过可视化连线展示数据流向。

## 3. 使用指南 

本功能提供 **图形界面 (Gradio UI)** 和 **命令行脚本** 两种使用方式。

### 3.1 界面操作 

适合交互式探索和快速验证。启动 Web 界面：
```python
python gradio_app/app.py
```
访问 `http://127.0.0.1:7860` 开始使用

1. **环境配置**：在页面顶部填写 API 相关信息和输入 JSONL 文件路径。
2. **编排流水线**：
   1. **选择算子**：从左侧下拉框选择算子分类和具体算子。
   2. **配置参数**：在 JSON 编辑框中填入参数。
   3. **添加算子**：点击“添加算子到 Pipeline”按钮，并在下方列表中拖拽调整执行顺序。
3. **运行与结果**：点击“运行 Pipeline”，在下方执行结果处查看生成的代码和处理结果数据预览。

### 3.2 脚本调用与显式配置

对于自动化任务或批量处理，可以使用 `script/run_dfa_op_assemble.py` 脚本。此方式跳过 UI，直接通过代码定义算子序列。

#### 1. 修改配置 

打开 `script/run_dfa_op_assemble.py`，在文件顶部的配置区域进行修改。

##### API 和文件配置
- CHAT_API_URL: LLM 服务地址
- API_KEY: 模型调用的鉴权密钥，如果您的 Pipeline 中包含需要调用大模型的算子（如推理生成、内容改写等），此项为必填，否则算子将无法运行。
- MODEL: 模型名称，默认 gpt-4o
- INPUT_FILE: 输入 JSONL 文件路径，测试数据文件
##### 其他配置
- CACHE_DIR: 结果和 pipeline 代码的存储目录。脚本运行过程中生成的 pipeline 代码文件、执行的中间数据和最终数据结果都会保存在这里。
- SESSION_ID: 任务的唯一标识符。

#### 2.定义 Pipeline 步骤
这是脚本中最关键的部分。您需要在`PIPELINE_STEPS`列表中定义算子的执行顺序和参数。 每一个步骤由 **算子名称 (op_name)** 和 **参数集合 (params)** 组成。

```Python
# [Pipeline 定义]
PIPELINE_STEPS = [
    {
        "op_name": "ReasoningAnswerGenerator",
        "params": {
            # __init__ 参数 (注意：在 wf_df_op_usage 中统一合并为 params)
            "prompt_template": "dataflow.prompts.reasoning.general.GeneralAnswerGeneratorPrompt",
            # run 参数
            "input_key": "raw_content",
            "output_key": "generated_cot"
        }
    },
    {
        "op_name": "ReasoningPseudoAnswerGenerator",  
        "params": {
            "max_times": 3,
            "input_key": "generated_cot",
            "output_key_answer": "pseudo_answers",
            "output_key_answer_value": "pseudo_answer_value",
            "output_key_solutions": "pseudo_solutions",
            "output_key_correct_solution_example": "pseudo_correct_solution_example"
        }
    }
]
```
> **注意：显式配置要求** 与 UI 的“自动链接”不同，脚本模式下您必须**显式配置**所有参数。您需要确保上一个算子的 `output_key` 与下一个算子的 `input_key` 严格匹配，脚本不会自动为您纠正参数名。

#### 3. 运行脚本

```Bash
python script/run_dfa_op_assemble.py
```

#### 4. 结果输出

脚本执行后，控制台将打印：

- **[Generation]**: 生成的 Pipeline 代码路径。
- **[Code Preview]**: 生成代码的前 20 行预览。
- **[Execution]**: 执行情况。

#### 5. 实战 Case：通用文本推理与伪答案生成

你可以参考以下教程学习，也可以参考我们提供的[Google Colab](https://colab.research.google.com/drive/1W3Wb1sTyea1xDAGmVu3Tyn7fcvrsppAp?usp=sharing)样例来运行：

我们有一个 `tests/test.jsonl` 文件，里面每行都有一个 `"raw_content"` 字段。我们希望：基于该字段的通用英文文本内容，先调用大语言模型针对文本内容生成推理式答案，再通过多轮生成候选答案并统计选优的方式生成伪答案，最终输出候选答案列表、最优伪答案、对应推理过程及典型正确推理示例等关键字段。所以我们选择 `ReasoningAnswerGenerator` 和 `ReasoningPseudoAnswerGenerator` 两个算子来编排 Pipeline。

以下是完整的配置示例：

```Python
# [Pipeline 定义]
PIPELINE_STEPS = [
    {
        "op_name": "ReasoningAnswerGenerator",
        "params": {
            # __init__ 参数 (注意：在 wf_df_op_usage 中统一合并为 params)
            "prompt_template": "dataflow.prompts.reasoning.general.GeneralAnswerGeneratorPrompt",
            # run 参数
            "input_key": "raw_content",
            "output_key": "generated_cot"
        }
    },
    {
        "op_name": "ReasoningPseudoAnswerGenerator",
        "params": {
            "max_times": 3,
            "input_key": "generated_cot",
            "output_key_answer": "pseudo_answers",
            "output_key_answer_value": "pseudo_answer_value",
            "output_key_solutions": "pseudo_solutions",
            "output_key_correct_solution_example": "pseudo_correct_solution_example"
        }
    }
]
```
配置完成后，在终端执行：

```Bash
python script/run_dfa_op_assemble.py
```
脚本会自动完成以下动作：

1. 构建图：解析您的 PIPELINE_STEPS。
2. 生成代码：将配置转换为标准的 Python 代码，存储在 `dataflow_cache/generated_pipelines/` 下。
3. 执行任务：启动子进程运行生成的 Pipeline。
4. 输出报告：终端会显示 [Execution] Status: success 以及代码部分预览。

您可以直接去 `CACHE_DIR` 目录下查看生成的 JSONL 结果文件，验证数据是否符合预期。