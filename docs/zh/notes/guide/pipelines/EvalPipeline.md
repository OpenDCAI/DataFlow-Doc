---
title: EvalPipeline
createTime: 2025/10/20 11:30:42
permalink: /zh/guide/cqro9oa8/
---
# 模型能力评估流水线

仅支持QA对形式的评估

## 快速开始

```
cd DataFlow
pip install -e .[eval]

cd ..
mkdir workspace
cd workspace

#将想要评估的文件放到工作目录下

#初始化评估的配置文件
dataflow eval init

#注意 一定要修改配置文件eval_api.py 或者 eval_local.py
#默认找到最新的微调模型与其基础模型对比
#默认评估方法是语义评估
#评估指标是准确度
dataflow eval api / dataflow eval local
```

## 第一步：安装评估环境

下载评估环境

```
cd DataFlow
pip install -e .[eval]
cd ..
```



## 第二步：创建并进入dataflow工作文件夹

```
mkdir workspace
cd workspace
```



## 第三步：准备评估数据初始化配置文件

初始化配置文件

```
dataflow eval init
```

初始化完成后，项目目录变成：

```
项目根目录/
├── eval_api.py  # 评估器为api模型的配置文件
└──  eval_local.py # 评估器为本地模型的配置文件
```



## 第四步：准备评估数据

### 方式一:

请准备好json格式文件，数据格式与展示类似

```
[
    {
        "input": "What properties indicate that material PI-1 has excellent processing characteristics during manufacturing processes?",
        "output": "Material PI-1 has high tensile strength between 85-105 MPa.\nPI-1 exhibits low melt viscosity below 300 Pa·s indicating good flowability.\n\nThe combination of its high tensile strength and low melt viscosity indicates that it can be easily processed without breaking during manufacturing."
    },
]
```

这里示例数据中

`input`是问题（也可以是问题+选择的选项合并为一个input）

`output`是标准答案



### 方式二:

也可以不处理数据（需要有明确的问题和标准答案这两个字段），通过eval_api.py以及eval_local.py来进行配置映射字段名字

```
EVALUATOR_RUN_CONFIG = {
    "input_test_answer_key": "model_generated_answer",  # 模型生成的答案字段名
    "input_gt_answer_key": "output",  # 标准答案字段名（原始数据的字段）
    "input_question_key": "input"  # 问题字段名（原始数据的字段）
}
```



## 第五步：配置参数

假设想用本地模型作为评估器，请修改`eval_local.py`文件中的参数

假设想用api模型作为评估器，请修改`eval_api.py`文件中的参数

```
Target Models Configuration (same as API mode)

TARGET_MODELS = [
	# 展示所有用法
	# 以下用法可混合使用
	# 1.本地路径
    # "./Qwen2.5-3B-Instruct",
    # 2.huggingface路径
    # "Qwen/Qwen2.5-7B-Instruct"
    # 3.单独配置
    # 添加更多模型...
    # {
    #     "name": "llama_8b",
    #     "path": "meta-llama/Llama-3-8B-Instruct",
    #     "tensor_parallel_size": 2
    #     "max_tokens": 2048,
    #     "gpu_memory_utilization": 0.9,
    # 可以为每个模型自定义提示词 不写就为默认模板 即				build_prompt函数中的prompt
    # 默认被评估模型提示词 
    # 再次提示:该prompt为被评估模型的提示词，请勿与评估模型提示词混淆！！！
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



## 第六步：进行评估

运行本地评估

```
dataflow eval local
```

运行api评估

```
dataflow eval api
```