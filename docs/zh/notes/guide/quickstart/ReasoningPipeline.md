---
title: 强推理数据合成流水线
icon: mdi:brain
createTime: 2025/06/16 13:08:42  
permalink: /zh/guide/reasoningpipeline/  
---

# 强推理数据合成流水线

## 1. 概述

**强推理数据合成流水线**旨在：  
- 清洗并扩充现有的数学问答数据  
- 为每个样本生成包含长链推理过程（chain‐of‐thought）的高质量解答  

支持多种输入场景：  
1. 只有问题  
2. 问题 + 标准答案（golden answer）  
3. 问题 + 解答（solution）  
4. 上述场景的任意混合

该流水线分为**问题处理**、**分支调度**和**答案处理**三个阶段，通过配置化的 `yaml` 和统一的 `pipeline_step.py` 驱动，能一键完成所有步骤。

---

## 2. 一键运行

如果所有样本都包含标准答案：  
```bash
bash ReasoningPipeline/pipeline_GT.sh
```

如果所有样本都不包含标准答案：  
```bash
bash ReasoningPipeline/pipeline_withoutGT.sh
```

混合情景：
```bash
bash ReasoningPipeline/pipeline_full.sh
```

我们也同时支持一键合成大规模的预训练数据：
```bash
bash ReasoningPipeline/pipeline_Pretrain.sh
```

> 这四个脚本会调用对应的 YAML 配置，依次执行各算子，并在指定的目录下生成各阶段中间文件。

---

## 3. 数据格式

### 3.1 输入数据

- **支持格式**：`json`、`jsonl`  
- **必需字段**：  
  - `instruction`：问题文本  
  - `golden_answer`：标准答案  
  - `solution`：已有解答或推理过程  
- **可选字段**：其它字段会被忽略，但建议只保留必要字段，避免与后续处理冲突。  
- **示例**（`json`）：
  ```json
  {
    "instruction": "…设计的超曲线…(a) 求 d；(b) 写出双曲线方程。",
    "golden_answer": "8",
    "source": "Bigmath_synth"
  }
  ```
- **演示数据集**：  
  `demos/text_process/reasoners/pipeline_math.json`  
  包含问题 + 标准答案，适用于快速测试和演示。

### 3.2 输出数据

- **格式**：`jsonl`（每个步骤都会生成一个文件）  
- **字段说明**：
  - `instruction`：问题  
  - `generated_cot`：模型生成的长链推理过程  
  - `output`：模型生成的解答  
  - `golden_answer`：标准答案  
  - `Synth_or_Input`：`input`（原始数据）或 `synth`（流水线合成）  
  - `Difficulty`：难度分（0–10）  
  - `primary_category`：主要类别  
  - `secondary_category`：次要类别  
- **示例**：
  ```json
  {
    "instruction": "给定…求 δ？",
    "generated_cot": "…推导过程…",
    "output": "δ = 30°",
    "golden_answer": "30",
    "Synth_or_Input": "input",
    "Difficulty": 4.0,
    "primary_category": "Geometry and Topology",
    "secondary_category": "Euclidean Geometry"
  }
  ```

---

## 4. 流程与算子

整个流水线由若干算子组成，每个算子对应一个 `yaml` 配置，通过 `pipeline_step.py` 驱动执行。

### 4.1 问题处理算子

1. **数学问题过滤器 (MathProblemFilter)**  
   - 功能：剔除所有非数学类问题  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/MathProblemFilter.yaml \
       --step_name MathProblemFilter \
       --step_type process
     ```

2. **数学问题合成 (QuestionGenerator)**  
   - 功能：根据现有问题提示大模型生成新问题  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/QuestionGenerator.yaml \
       --step_name QuestionGenerator \
       --step_type generator
     ```

3. **问题正确性过滤 (QuestionVerify)**  
   - 功能：基于 [MathQ-Verify](https://arxiv.org/abs/2505.13903) 提供的方法，过滤掉包含错误描述或条件缺失的问题  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/QuestionVerify.yaml \
       --step_name QuestionVerify \
       --step_type process
     ```

4. **难度打分 (QuestionDifficultyClassifier)**  
   - 功能：参照 [Omni-Math](https://arxiv.org/abs/2410.07985) 提示词，对问题进行难度分类并打分  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/QuestionDifficultyClassifier.yaml \
       --step_name QuestionDifficultyClassifier \
       --step_type generator
     ```

5. **类别分类 (QuestionCategoryClassifier)**  
   - 功能：参考 [MSC-2020](https://msc2020.org/) 分类，将问题聚类为七大类与若干子类  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/QuestionCategoryClassifier.yaml \
       --step_name QuestionCategoryClassifier \
       --step_type generator
     ```

### 4.2 流水线分支器 (AnswerPipelineRoot)

- 功能：根据是否包含标准答案，将数据分为两条支线  
- 输出：  
  - `*_withGT.jsonl`（含标准答案）  
  - `*_withoutGT.jsonl`（不含标准答案）  
- 命令：
  ```bash
  python pipeline_step.py \
    --yaml_path ReasoningPipeline/yaml/AnswerPipelineRoot.yaml \
    --step_name AnswerPipelineRoot \
    --step_type generator
  ```

### 4.3 标准答案处理算子

本算子仅在“含标准答案”支线上执行。

1. **答案生成器 (AnswerGenerator)**  
   - 功能：提示推理模型生成带长链推理的解答  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/AnswerGenerator.yaml \
       --step_name AnswerGenerator \
       --step_type generator
     ```

2. **答案格式过滤 (AnswerFormatFilter)**  
   - 功能：过滤掉不符合预设格式的答案  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/AnswerFormatFilter.yaml \
       --step_name AnswerFormatFilter \
       --step_type process
     ```

3. **答案长度过滤 (AnswerLengthFilter)**  
   - 功能：剔除过长或过短的答案  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/AnswerLengthFilter.yaml \
       --step_name AnswerLengthFilter \
       --step_type process
     ```

4. **答案正确性过滤 (AnswerGroundTruthFilter)**  
   - 功能：利用 [Qwen2.5-Math](https://github.com/QwenLM/Qwen2.5-Math) 提取最终答案，并用 [Math-Verify](https://github.com/huggingface/Math-Verify) 比对标准答案  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/ReasonerAnsSelection.yaml \
       --step_name AnswerGroundTruthFilter \
       --step_type process
     ```

5. **问答去重 (AnswerNgramFilter)**  
   - 功能：基于 n-gram 方法，过滤相似度过高的问答对  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/ReasonerNgramFilter.yaml \
       --step_name AnswerNgramFilter \
       --step_type process
     ```
### 4.4 无标准答案处理算子

本算子仅在“无标准答案”支线上执行。

1. **伪答案生成器 (PseudoAnswerGenerator)**  
   - 功能：通过大模型为一个问题生成多个解答，投票选出出现次数最多的解答作为伪答案  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/PseudoAnswerGenerator.yaml \
       --step_name PseudoAnswerGenerator \
       --step_type generator
     ```

2. **答案格式过滤 (AnswerFormatFilter)**  
   - 功能：过滤掉不符合预设格式的答案  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/ReasonerFormatFilter_withoutGT.yaml \
       --step_name AnswerFormatFilter \
       --step_type process
     ```

3. **答案长度过滤 (AnswerLengthFilter)**  
   - 功能：剔除过长或过短的答案  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/ReasonerLengthFilter_withoutGT.yaml \
       --step_name AnswerLengthFilter \
       --step_type process
     ```

4. **问答去重 (AnswerNgramFilter)**  
   - 功能：基于 n-gram 方法，过滤相似度过高的问答对  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/ReasonerNgramFilter_withoutGT.yaml \
       --step_name AnswerNgramFilter \
       --step_type process
     ```

### 4.5 无标准答案处理算子

这部分算子主要做最终的格式转换，以支持特定下游任务的接口格式。

1. **问答格式（SFT）转预训练格式（PT） (Pretrain_FormatConvert_sft2pt)**  
   - 功能：将问答对格式的数据转换为预训练格式，即仅包含`text`键
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/Pretrain_FormatConvert_sft2pt.yaml \
       --step_name Pretrain_FormatConvert_sft2pt \
       --step_type generator
     ```
