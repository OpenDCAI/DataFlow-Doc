---
title: Reasoning Data Synthesis Pipeline  
icon: mdi:brain  
createTime: 2025/06/16 13:08:42  
permalink: /en/guide/reasoningpipeline/  
---

# Reasoning Data Synthesis Pipeline

## 1. Overview

The **Reasoning Data Synthesis Pipeline** is an end-to-end framework to:  
- Clean and augment existing math QA datasets  
- Generate high-quality answers complete with chain-of-thought (CoT) rationales  

This pipeline natively handles four input scenarios:  
1. Question only  
2. Question + Golden Answer  
3. Question + Existing Solution  
4. Any combination of the above  

Under the hood, it’s split into three stages—**Question Processing**, **Branch Scheduling**, and **Answer Processing**—all orchestrated by configurable YAML specs and a unified `pipeline_step.py`. With a single command you trigger the entire pipeline and produce intermediate outputs at every stage.

---

## 2. One-Click Execution

Run the full pipeline with one of these scripts:

If **all samples include** golden answers:  
```bash
bash ReasoningPipeline/pipeline_GT.sh
```

If **no samples include** golden answers:  
```bash
bash ReasoningPipeline/pipeline_withoutGT.sh
```

For **mixed** scenarios:  
```bash
bash ReasoningPipeline/pipeline_full.sh
```

We also support synthesis large-scale **pre-trained** data:
```bash
bash ReasoningPipeline/pipeline_Pretrain.sh
```

> Each script loads its corresponding YAML config, invokes each operator in sequence, and writes intermediate files to the designated directories.

---

## 3. Data Format

### 3.1 Input Data

- Supported formats: `json`, `jsonl`  
- Required fields:  
  • `instruction`: the math problem prompt  
  • `golden_answer`: golden answer (if available)  
  • `solution`: any existing solution or CoT  
- Optional fields are ignored—keep only what you need to avoid conflicts.  
- Example (`json`):
  ```json
  {
    "instruction": "…For this super-ellipse… (a) find d; (b) write the hyperbola equation.",
    "golden_answer": "8",
    "source": "Bigmath_synth"
  }
  ```
- Demo dataset for quick testing:  
  `demos/text_process/reasoners/pipeline_math.json`  
  (contains question + golden answer)

### 3.2 Output Data

- Format: `jsonl` (one file per pipeline stage)  
- Key fields:
  • `instruction`: the question  
  • `generated_cot`: model-generated chain-of-thought  
  • `output`: model answer  
  • `golden_answer`: ground-truth answer  
  • `Synth_or_Input`: `input` (original data) or `synth` (synthesized by the pipeline)  
  • `Difficulty`: score from 0 to 10 
  • `primary_category`: primary category of math problem
  • `secondary_category`: secondary category of math problem
- Example:
  ```json
  {
    "instruction": "Given … find δ?",
    "generated_cot": "…detailed derivation…",
    "output": "δ = 30°",
    "golden_answer": "30",
    "Synth_or_Input": "input",
    "Difficulty": 4.0,
    "primary_category": "Geometry and Topology",
    "secondary_category": "Euclidean Geometry"
  }
  ```

---

## 4. Pipeline & Operators

All steps are implemented as operators driven by `pipeline_step.py` and configured via YAML.

### 4.1 Question Processing Operators

1. **MathProblemFilter**  
   - Function: Remove non-math questions  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/MathProblemFilter.yaml \
     --step_name MathProblemFilter \
     --step_type process
   ```

2. **QuestionGenerator**  
   - Function: Prompt a large model to synthesize new math questions  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/QuestionGenerator.yaml \
     --step_name QuestionGenerator \
     --step_type generator
   ```

3. **QuestionVerify**  
   - Function: Filter out questions with incorrect or missing conditions using [MathQ-Verify](https://arxiv.org/abs/2505.13903)
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/QuestionVerify.yaml \
     --step_name QuestionVerify \
     --step_type process
   ```

4. **QuestionDifficultyClassifier**  
   - Function: Score and classify difficulty according to [Omni-Math](https://arxiv.org/abs/2410.07985) prompts  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/QuestionDifficultyClassifier.yaml \
     --step_name QuestionDifficultyClassifier \
     --step_type generator
   ```

5. **QuestionCategoryClassifier**  
   - Function: Referring to the [MSC-2020](https://msc2020.org/) classification, the problems are clustered into seven primary categories and several secondary categories.
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/QuestionCategoryClassifier.yaml \
     --step_name QuestionCategoryClassifier \
     --step_type generator
   ```

### 4.2 Pipeline Brancher (AnswerPipelineRoot)

- Function: Split data into two streams based on the presence of golden answers  
- Output files:  
  - `*_withGT.jsonl` (with golden answers)  
  - `*_withoutGT.jsonl` (without golden answers)  
- Command:
```bash
python pipeline_step.py \
  --yaml_path ReasoningPipeline/yaml/AnswerPipelineRoot.yaml \
  --step_name AnswerPipelineRoot \
  --step_type generator
```

### 4.3 Golden Answer Processing Operators

Executed only on the “with golden answer” branch

1. **AnswerGenerator**  
   - Function: Generate answers with detailed CoT (Chain of Thought)
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/AnswerGenerator.yaml \
     --step_name AnswerGenerator \
     --step_type generator
   ```

2. **AnswerFormatFilter**  
   - Function: Discard answers that don’t match the expected format  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/AnswerFormatFilter.yaml \
     --step_name AnswerFormatFilter \
     --step_type process
   ```

3. **AnswerLengthFilter**  
   - Function: Remove answers that are too long or too short  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/AnswerLengthFilter.yaml \
     --step_name AnswerLengthFilter \
     --step_type process
   ```

4. **AnswerGroundTruthFilter**  
   - Function: Use [Qwen2.5-Math](https://github.com/QwenLM/Qwen2.5-Math) and [Math-Verify](https://github.com/huggingface/Math-Verify) to extract and verify the final answer  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/ReasonerAnsSelection.yaml \
     --step_name AnswerGroundTruthFilter \
     --step_type process
   ```

5. **AnswerNgramFilter**  
   - Function: Deduplicate QA pairs with an n-gram similarity filter  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/ReasonerNgramFilter.yaml \
     --step_name AnswerNgramFilter \
     --step_type process
   ```

### 4.4 No Golden Answer Processing Operators

Executed only on the “without golden answer” branch

1. **PseudoAnswerGenerator**  
   - Function: Generate multiple candidate answers, then vote to select the majority as a pseudo-answer  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/PseudoAnswerGenerator.yaml \
     --step_name PseudoAnswerGenerator \
     --step_type generator
   ```

2. **AnswerFormatFilter**  
   - Function: Discard answers not conforming to the expected format  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/ReasonerFormatFilter_withoutGT.yaml \
     --step_name AnswerFormatFilter \
     --step_type process
   ```

3. **AnswerLengthFilter**  
   - Function: Remove answers that are too long or too short  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/ReasonerLengthFilter_withoutGT.yaml \
     --step_name AnswerLengthFilter \
     --step_type process
   ```

4. **AnswerNgramFilter**  
   - Function: Deduplicate QA pairs with an n-gram similarity filter  
   - Command:
   ```bash
   python pipeline_step.py \
     --yaml_path ReasoningPipeline/yaml/ReasonerNgramFilter_withoutGT.yaml \
     --step_name AnswerNgramFilter \
     --step_type process
   ```

### 4.5 Format Conversion Operator

This part of the operators mainly performs the final format conversion to support the interface format of specific downstream tasks.

1. **Pretrain_FormatConvert_sft2pt**  
   - Function: Convert question-answer formatted data into pretraining format
   - Command:
     ```bash
     python pipeline_step.py \
       --yaml_path ReasoningPipeline/yaml/Pretrain_FormatConvert_sft2pt.yaml \
       --step_name Pretrain_FormatConvert_sft2pt \
       --step_type generator
     ```