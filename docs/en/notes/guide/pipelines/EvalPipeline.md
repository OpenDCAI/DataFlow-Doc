---
title: EvalPipeline
createTime: 2025/11/24 17:15:13
permalink: /en/guide/f67gj6f6/
---
# **Evaluation Pipeline** 

Only supports QA pair format evaluation 

## **Quick Start**

```bash
cd DataFlow
pip install -e .[llamafactory]

cd ..
mkdir workspace
cd workspace

#Place the files you want to evaluate in the working directory

#Initialize the evaluation configuration file
dataflow eval init

#Note: You must modify the configuration file eval_api.py or eval_local.py
#By default, it finds the latest fine-tuned model and compares it with its base model
#Default evaluation method is semantic evaluation
#Evaluation metric is accuracy
dataflow eval api / dataflow eval local
```

## **Step 1: Install Evaluation Environment**

Download evaluation environment

```bash
cd DataFlow
pip install -e .[llamafactory]
cd ..
```



## **Step 2: Create and Enter dataflow Working Folder**

```bash
mkdir workspace
cd workspace
```



## **Step 3: Prepare Evaluation Data and Initialize Configuration File** 

Initialize configuration file

```bash
dataflow eval init
```

After initialization is complete, the project directory becomes:

```json
Project Root Directory/
├── eval_api.py  # Configuration file for API model evaluator
└──  eval_local.py # Configuration file for local model evaluator
```



## **Step 4: Prepare Evaluation Data** 

Initialize configuration file

```bash
dataflow eval init
```

After initialization is complete, the project directory becomes:

```json
Project Root Directory/
├── eval_api.py  # Configuration file for API model evaluator
└──  eval_local.py # Configuration file for local model evaluator
```



**Method 1:** Please prepare a JSON format file with data format similar to the example shown

Please prepare a JSON format file with data format similar to the display

```json
{
    "input": "What properties indicate that material PI-1 has excellent processing characteristics during manufacturing processes?",
    "output": "Material PI-1 has high tensile strength between 85-105 MPa.\nPI-1 exhibits low melt viscosity below 300 Pa·s indicating good flowability.\n\nThe combination of its high tensile strength and low melt viscosity indicates that it can be easily processed without breaking during manufacturing."
}
```

In this example data 

`input` is the question 

`output` is the standard answer 



**Method 2:** You can also skip data processing (requires clear question and standard answer fields), and configure field name mappings through eval_api.py and eval_local.py

```python
EVALUATOR_RUN_CONFIG = {
    "input_test_answer_key": "model_generated_answer",  # Model generated answer field name
    "input_gt_answer_key": "output",  # Standard answer field name (corresponding to original data)
    "input_question_key": "input"  # Question field name (corresponding to original data)
}
```



## **Step 5: Configure Parameters** 

### Model Parameter Configuration

If you want to use a local model as the evaluator, please modify the parameters in the `eval_local.py` file If you want to use an API model as the evaluator, please modify the parameters in the `eval_api.py` file

```python
Target Models Configuration (same as API mode)

TARGET_MODELS = [
    # Shows all usage methods
    # The following methods can be mixed and used together
    # 1. Local path
    # "./Qwen2.5-3B-Instruct",
    # 2. Huggingface path
    # "Qwen/Qwen2.5-7B-Instruct"
    # 3. Individual configuration
    # Add more models...
{
    "name": "qwen_7b",  # Model name
    "path": "./Qwen2.5-7B-Instruct",  # Model path
    # Large language models can use different parameters
    "vllm_tensor_parallel_size": 4,  # Number of GPUs
    "vllm_temperature": 0.1,  # Randomness
    "vllm_top_p": 0.9,  # Top-p sampling
    "vllm_max_tokens": 2048,  # Maximum number of tokens
    "vllm_repetition_penalty": 1.0,  # Repetition penalty
    "vllm_seed": None,  # Random seed
    "vllm_gpu_memory_utilization": 0.9,  # Maximum GPU memory utilization
    # Custom prompt can be defined for each model
    "answer_prompt": """please answer the following question:"""
}
    
]
```



### Benchmark Parameter Configuration

Supports batch configuration of benchmarks

```python
BENCH_CONFIG = [
    {
        "name": "bench_name",  # Benchmark name
        "input_file": "path_to_your_qa/qa.json",  # Data file
        "question_key": "input",  # Question field name
        "reference_answer_key": "output",  # Answer field name
        "output_dir": "path_to_bench/bench_name",  # Output directory
    },
    {
        "name": "other_bench_name",
        "input_file": "path_to_your_qa/other_qa.json",
        "question_key": "input",
        "reference_answer_key": "output",
        "output_dir": "path/other_bench_name",
    },
    # {
    #     "name": "code_bench",
    #     "input_file": "./.cache/data/code_qa.json",
    #     "question_key": "problem",
    #     "reference_answer_key": "solution",
    #     "output_dir": "./eval_results/code_bench",
    # },
]
```



## **Step 6: Perform Evaluation** 

Run local evaluation

```bash
dataflow eval local
```

Run API evaluation

```bash
dataflow eval api
```