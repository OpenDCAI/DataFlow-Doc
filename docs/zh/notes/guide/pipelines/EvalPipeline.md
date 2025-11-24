---
title: EvalPipeline
createTime: 2025/11/24 17:15:14
permalink: /zh/guide/2fcgpwro/
---
# 评估流水线

仅支持QA对形式的评估

## 快速开始

```bash
cd DataFlow
pip install -e .[llamafactory]

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

```bash
cd DataFlow
pip install -e .[llamafactory]
cd ..
```



## 第二步：创建并进入dataflow工作文件夹

```bash
mkdir workspace
cd workspace
```



## 第三步：准备评估数据初始化配置文件

初始化配置文件

```bash
dataflow eval init
```

初始化完成后，项目目录变成：

```json
项目根目录/
├── eval_api.py  # 评估器为api模型的配置文件
└──  eval_local.py # 评估器为本地模型的配置文件
```



## 第四步：准备评估数据

初始化配置文件

```bash
dataflow eval init
```

初始化完成后，项目目录变成：

```json
项目根目录/
├── eval_api.py  # 评估器为api模型的配置文件
└──  eval_local.py # 评估器为本地模型的配置文件
```

### 方式一

请准备好json格式文件，数据格式与展示类似

```json
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

### 方式二

也可以不处理数据（需要有明确的问题和标准答案这两个字段），通过eval_api.py以及eval_local.py来进行配置映射字段名字

```python
EVALUATOR_RUN_CONFIG = {
    "input_test_answer_key": "model_generated_answer",  # 模型生成的答案字段名
    "input_gt_answer_key": "output",  # 标准答案字段名（原始数据的字段）
    "input_question_key": "input"  # 问题字段名（原始数据的字段）
}
```



## 第五步：配置参数

### 模型参数配置

假设想用本地模型作为评估器，请修改`eval_local.py`文件中的参数

假设想用api模型作为评估器，请修改`eval_api.py`文件中的参数

```python
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
{
    "name": "qwen_7b",  # 模型名称
    "path": "./Qwen2.5-7B-Instruct",  # 模型路径
    # 大模型可以用不同的参数
    "vllm_tensor_parallel_size": 4,  # 显卡数量
    "vllm_temperature": 0.1,  # 随机性，值越大输出越随机
    "vllm_top_p": 0.9,  # 核采样概率阈值，控制候选词的累积概率范围
    "vllm_max_tokens": 2048,  # 最大生成token数
    "vllm_repetition_penalty": 1.0,  # 重复惩罚系数，大于1时抑制重复内容
    "vllm_seed": None,  # 随机种子，设置后可复现结果
    "vllm_gpu_memory_utilization": 0.9,  # 最大显存利用率
    # 可以为每个模型自定义提示词
    "answer_prompt": """please answer the following question:"""  # 回答提示词模板
}
    
]
```

### Bench参数配置

支持批量配置bench

```python
BENCH_CONFIG = [
    {
        "name": "bench_name",  # bench名称
        "input_file": "path_to_your_qa/qa.json",  # 数据文件
        "question_key": "input",  # 问题字段名
        "reference_answer_key": "output",  # 答案字段名
        "output_dir": "path_to_bench/bench_name",  # 输出目录
    },
    {
        "name": "other_bench_name",
        "input_file": "path_to_your_qa/other_qa.json",
        "question_key": "input",
        "reference_answer_key": "output",
        "output_dir":"path/other_bench_name",
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



## 第六步：进行评估

运行本地评估

```bash
dataflow eval local
```

运行api评估

```bash
dataflow eval api
```

