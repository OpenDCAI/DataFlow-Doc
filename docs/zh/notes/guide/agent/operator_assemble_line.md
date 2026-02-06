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

该功能模块主要由前端交互逻辑 (op_assemble_line.py) 和后端执行工作流 (wf_df_op_usage.py) 组成。

### 2.1 动态算子加载与自省

系统启动时会自动扫描 `OPERATOR_REGISTRY`，加载所有注册的算子，并根据其模块路径自动分类。

- **参数自动解析**：系统通过 Python 的 `inspect` 模块自动提取算子类的 `init` 和 `run` 方法签名，在 UI 上生成对应的配置框。
- **Prompt 模板支持**：对于支持 Prompt 的算子，UI 会自动读取 `ALLOWED_PROMPTS` 并提供下拉选择框。

### 2.2 智能参数链接 

在 UI 编排过程中，系统具备“自动接线”能力。它会分析相邻两个算子的输入输出关系，自动匹配名称相似的 Key，并通过可视化连线展示数据流向。

## 3. 使用指南 

本功能提供 **图形界面 (Gradio UI)** 和 **命令行脚本** 两种使用方式。

### 3.1 界面操作 

适合交互式探索和快速验证。

1. **环境配置**：在页面顶部填写 API 相关信息和输入 JSONL 文件路径。
2. **编排流水线**：
   1. **选择算子**：从左侧下拉框选择算子分类和具体算子。
   2. **配置参数**：在 JSON 编辑框中填入参数。
   3. **添加算子**：点击“添加算子到 Pipeline”按钮，并在下方列表中拖拽调整执行顺序。
3. **运行与结果**：点击“运行 Pipeline”，在下方执行结果处查看生成的代码和处理结果数据预览。

### 3.2 脚本调用与显式配置

对于自动化任务或批量处理，可以使用 `run_dfa_op_assemble.py` 脚本。此方式跳过 UI，直接通过代码定义算子序列。

> **注意：显式配置要求** 与 UI 的“自动链接”不同，脚本模式下您必须**显式配置**所有参数。您需要确保上一个算子的 `output_key` 与下一个算子的 `input_key` 严格匹配，脚本不会自动为您纠正参数名。

#### 1. 修改配置 

打开 `run_dfa_op_assemble.py`，在文件顶部的配置区域进行修改。

**关键配置项**：**`PIPELINE_STEPS`** 这是一个列表，定义了 Pipeline 的执行步骤。每个元素包含 `op_name` 和 `params`。

```Python
# [Pipeline 定义]
PIPELINE_STEPS = [
    {
        "op_name": "ReasoningAnswerGenerator",
        "params": {
            # __init__ 参数 (注意：在 wf_df_op_usage 中统一合并为 params)
            "prompt_template": "dataflow.prompts.reasoning.math.MathAnswerGeneratorPrompt",
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

**其他必要配置：**

- `CACHE_DIR`: **必须使用绝对路径**，以避免生成的 Python 脚本在子进程执行时出现路径错误。
- `INPUT_FILE`: 初始数据文件的绝对路径。

#### 2. 运行脚本

```Bash
python run_dfa_op_assemble.py
```

#### 3. 结果输出

脚本执行后，控制台将打印：

- **[Generation]**: 生成的 Python 脚本路径 (`pipeline_script_pipeline_001.py`)。
- **[Code Preview]**: 生成代码的前 20 行预览。
- **[Execution]**:
  - `Status: success` 表示执行成功。
  - `STDOUT`: 打印 pipeline 运行时的标准输出日志。