---
title: Model Capability Assessment Pipeline
createTime: 2025/08/30 14:27:02
icon: hugeicons:chart-evaluation
permalink: /en/guide/evaluation-pipeline/
---

# Model Capability Assessment Pipeline

⚠️Only supports QA pair format evaluation

## Quick Start
```bash
cd DataFlow
pip install -e .[eval]

cd ..
mkdir workspace
cd workspace

# Place the files you want to evaluate in the working directory

# Initialize evaluation configuration files
dataflow eval init

# IMPORTANT: You must modify the configuration files eval_api.py or eval_local.py
# By default, it finds the latest fine-tuned model and compares it with its base model
# Default evaluation method is semantic evaluation
# Evaluation metric is accuracy
dataflow eval api / dataflow eval local
```



## Step 1: Install Evaluation Environment

Download evaluation environment
```bash
cd DataFlow
pip install -e .[eval]
cd ..
```



## Step 2: Create and Enter DataFlow Working Directory

```bash
mkdir workspace
cd workspace
```



## Step 3: Prepare Evaluation Data and Initialize Configuration Files

Initialize configuration files
```bash
dataflow eval init
```

💡After initialization, the project directory structure becomes:
```bash
Project Root/
├── eval_api.py      # Configuration file for API model evaluator
└── eval_local.py    # Configuration file for local model evaluator
```



## Step 4: Prepare Evaluation Data

### Method 1: JSON Format

Please prepare a JSON format file with data structure similar to the example below:
```json
[
    {
        "input": "What properties indicate that material PI-1 has excellent processing characteristics during manufacturing processes?",
        "output": "Material PI-1 has high tensile strength between 85-105 MPa.\nPI-1 exhibits low melt viscosity below 300 Pa·s indicating good flowability.\n\nThe combination of its high tensile strength and low melt viscosity indicates that it can be easily processed without breaking during manufacturing."
    }
]
```

💡In this example data:
- `input` is the question (can also be question + answer choices merged into one input)

- `output` is the standard answer

  

### Method 2: Custom Field Mapping

You can also skip data preprocessing (as long as you have clear question and standard answer fields) and configure field name mapping through `eval_api.py` and `eval_local.py`:
```python
EVALUATOR_RUN_CONFIG = {
    "input_test_answer_key": "model_generated_answer",  # Field name for model-generated answers
    "input_gt_answer_key": "output",                    # Field name for standard answers (from original data)
    "input_question_key": "input"                       # Field name for questions (from original data)
}
```



## Step 5: Configure Parameters

If you want to use a local model as the evaluator, please modify the parameters in the `eval_local.py` file.

If you want to use an API model as the evaluator, please modify the parameters in the `eval_api.py` file.
```python
# Target Models Configuration (same as API mode)

TARGET_MODELS = [
    # Demonstrating all usage methods
    # The following methods can be used in combination
    
    # 1. Local path
    # "./Qwen2.5-3B-Instruct",
    
    # 2. HuggingFace path
    # "Qwen/Qwen2.5-7B-Instruct"
    
    # 3. Custom configuration
    # Add more models...
    # {
    #     "name": "llama_8b",
    #     "path": "meta-llama/Llama-3-8B-Instruct",
    #     "tensor_parallel_size": 2,
    #     "max_tokens": 2048,
    #     "gpu_memory_utilization": 0.9,
    
    #     # You can customize prompts for each model. If not specified, defaults to the template in build_prompt function.
    #     # Default prompt for evaluated models
    #     # IMPORTANT: This is the prompt for models being evaluated, NOT for the judge model!!!
    #     "answer_prompt": """please answer the questions：
    #      question：{question}
    #      answer："""
    # }
]
```



## Step 6: Run Evaluation

Run local evaluation:
```bash
dataflow eval local
```

Run API evaluation:
```bash
dataflow eval api
```