---
title: Command Model Evaluation Pipeline
icon: hugeicons:chart-evaluation
createTime: 2025/10/17 15:00:50
permalink: /en/guide/qi6ikv5s/
---
# **Evaluation Pipeline** 

Only supports QA pair format evaluation 

## **Quick Start**

```
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

```
cd DataFlow
pip install -e .[llamafactory]
cd ..
```



## **Step 2: Create and Enter dataflow Working Folder**

```
mkdir workspace
cd workspace
```



## **Step 3: Prepare Evaluation Data and Initialize Configuration File** 

Initialize configuration file

```
dataflow eval init
```

After initialization is complete, the project directory becomes:

```
Project Root Directory/
├── eval_api.py  # Configuration file for API model evaluator
└──  eval_local.py # Configuration file for local model evaluator
```



## **Step 4: Prepare Evaluation Data** 

Initialize configuration file

```
dataflow eval init
```

After initialization is complete, the project directory becomes:

```
Project Root Directory/
├── eval_api.py  # Configuration file for API model evaluator
└──  eval_local.py # Configuration file for local model evaluator
```



**Method 1:** Please prepare a JSON format file with data format similar to the example shown

Please prepare a JSON format file with data format similar to the display

```
{
    "input": "What properties indicate that material PI-1 has excellent processing characteristics during manufacturing processes?",
    "output": "Material PI-1 has high tensile strength between 85-105 MPa.\nPI-1 exhibits low melt viscosity below 300 Pa·s indicating good flowability.\n\nThe combination of its high tensile strength and low melt viscosity indicates that it can be easily processed without breaking during manufacturing."
},
```

In this example data 

`input` is the question 

`output` is the standard answer 



**Method 2:** You can also skip data processing (requires clear question and standard answer fields), and configure field name mappings through eval_api.py and eval_local.py

```
EVALUATOR_RUN_CONFIG = {
    "input_test_answer_key": "model_generated_answer",  # Model generated answer field name
    "input_gt_answer_key": "output",  # Standard answer field name (corresponding to original data)
    "input_question_key": "input"  # Question field name (corresponding to original data)
}
```



## **Step 5: Configure Parameters** 

If you want to use a local model as the evaluator, please modify the parameters in the `eval_local.py` file If you want to use an API model as the evaluator, please modify the parameters in the `eval_api.py` file

```
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
    # {
    #     "name": "llama_8b",
    #     "path": "meta-llama/Llama-3-8B-Instruct",
    #     "tensor_parallel_size": 2
    #     "max_tokens": 2048,
    #     "gpu_memory_utilization": 0.9,
    # You can customize prompts for each model. If not specified, defaults to the template in build_prompt function.
    # Default prompt for evaluated models
    # IMPORTANT: This is the prompt for models being evaluated, NOT for the judge model!!!
    # "answer_prompt": """please answer the questions：
    #  question：{question}
    #  answer："""
    #     ""
    # }
    #
    
]
```



## **Step 6: Perform Evaluation** 

Run local evaluation

```
dataflow eval local
```

Run API evaluation

```
dataflow eval api
```