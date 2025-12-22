---
title: 快速上手-第一个Pipeline
createTime: 2025/06/30 19:19:16
permalink: /zh/guide/first_pipeline/
icon: solar:flag-2-broken
---
# 快速上手
## 第一个Pipeline的代码
以下是一个DataFlow最简的pipeline，它可以让你用同一个prompt来驱动大模型来转化你的批量输入，你可以拷贝下来它来运行:
```python
# mypipeline.py
from dataflow.pipeline import PipelineABC
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.operators.core_text import PromptedGenerator

class MyPipeline(PipelineABC):
    def __init__(self):
        super().__init__()
        # -------- FileStorage --------
        self.storage = FileStorage(
            first_entry_file_name="./input.json", # 输入数据集路径
        )
        # -------- LLM Serving (Remote) --------
        self.llm_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/chat/completions", # change to your API
            model_name="gpt-4o",
        )
        # -------- LLM Serving (Remote) --------
        self.op = PromptedGenerator(
            llm_serving=self.llm_serving,
            system_prompt="Please answer the question."
        )
    def forward(self):
        self.op.run(
            storage=self.storage.step(),
            input_key="question",
            output_key="answer"
        )

if __name__ == "__main__":
    pipeline = MyPipeline()
    pipeline.compile()
    pipeline.forward()
```

## 数据集准备
当然，你需要准备好相应的数据集合，你可以创建一个名为`./input.json`的数据集，并在其内填入一些测试用的数据集，下面是开箱即用的问题集合：
```json
[
    {"question": "Who are you."},
    {"question": "Which animal likes to eat banana."},
    {"question": "What color is an apple?"}
]
```


## API_KEY准备
当然，上面的pipeline使用了基于API的大模型，所以你需要填入相应的`api_url`以及相应的秘钥（token/key）。为了安全需要向环境变量输出 `DF_API_KEY` 字段，该设计是为了避免将key写入Github仓库导致泄露的途径。在 Linux 下是：
```bash
export DF_API_KEY=sh-xxxxx
```

在 Windows CMD下，可以使用以下命令设置环境变量：
```cmd
set DF_API_KEY=sh-xxxxx
```
或者在 PowerShell 中使用：
```powershell
$env:DF_API_KEY = "sh-xxxxx"
```

设置完成后，程序就可以从环境中读取该 API 密钥进行调用。**确保不要将密钥暴露在公开代码中。**
## 运行Pipeline
你只需要运行上述py文件即可:
```shell
python mypipeline.py
```

运行结果如下：
```shell
$ python ./mypipeline.py
2025-12-22 17:23:37.767 | INFO     | DataFlow:registry.py:__getattr__:358 - Lazyloader ['dataflow/operators/core_text/'] trying to import PromptedGenerator 
storage POSITIONAL_OR_KEYWORD
input_key POSITIONAL_OR_KEYWORD
output_key POSITIONAL_OR_KEYWORD
2025-12-22 17:23:37.768 | INFO     | DataFlow:Pipeline.py:compile:51 - Compiling pipeline and validating key integrity across 1 operator runtimes.
2025-12-22 17:23:37.769 | INFO     | DataFlow:storage.py:read:477 - Reading data from ./input.json with type dataframe
2025-12-22 17:23:37.769 | INFO     | DataFlow:storage.py:read:481 - Reading remote dataset from ./input.json with type dataframe
2025-12-22 17:23:37.772 | INFO     | DataFlow:prompted_generator.py:run:57 - Running PromptGenerator...
2025-12-22 17:23:37.772 | INFO     | DataFlow:storage.py:read:477 - Reading data from ./input.json with type dataframe
2025-12-22 17:23:37.772 | INFO     | DataFlow:storage.py:read:481 - Reading remote dataset from ./input.json with type dataframe
2025-12-22 17:23:37.774 | INFO     | DataFlow:prompted_generator.py:run:61 - Loading, number of rows: 3
2025-12-22 17:23:37.774 | INFO     | DataFlow:prompted_generator.py:run:75 - Generating text using the model...
Generating......: 100%|██████████████████████████████████████████████████████████████████████████████████████████| 3/3 [00:06<00:00,  2.13s/it]
2025-12-22 17:23:44.171 | INFO     | DataFlow:prompted_generator.py:run:80 - Text generation completed.
2025-12-22 17:23:44.172 | SUCCESS  | DataFlow:logger.py:success:12 - Writing data to ./df_cache/dataflow_cache_step_step1.json with type json
```
随后你可以在默认的输出文件夹`./cache/`路径下看到输出的文件，它就是DataFlow运行一步的输出：
```jsonl
{"question":"Who are you.","answer":"I am a virtual assistant designed to help you with a variety of tasks and answer questions to the best of my ability. Whether you need information, advice, or help with a specific task, I'm here to assist you!"}
{"question":"Which animal likes to eat banana.","answer":"Many animals enjoy eating bananas, but some of the most well-known banana lovers are primates, such as monkeys and apes. In addition to primates, many fruit bats, birds, and even some wild pigs and animals like elephants and squirrels occasionally enjoy bananas. These animals are often attracted to the sweetness and high energy content provided by bananas."}
{"question":"What color is an apple?","answer":"An apple can come in several different colors, including red, green, and yellow. Some apples may even have a combination of these colors, such as red with yellow or green with red patches. The color can vary depending on the variety of the apple."}
```

这样就完成了使用DataFlow批量推理一组内容的最简操作！

## 详解：LLMServing类
如果你没有API，但是有自己的显卡，我们则推荐你使用本地的LLMServing来运行，所有的可用Serving类可以在此路径找到([./dataflow/serving/](https://github.com/OpenDCAI/DataFlow/tree/main/dataflow/serving))。

这里的本地模型主要是`local_model_llm_serving.py`下定义的`LocalModelLLMServing_vllm`和`LocalModelLLMServing_sglang`这两个分别使用了主流的大模型推理引擎[vLLM](https://github.com/vllm-project/vllm) 和 [SGLang](https://github.com/sgl-project/sglang)作为推理后端。
为了明确区分Huggingface相关的形参以及引擎相关的形参，我们在实现两个本地LLMServing时将其形参按前缀区分，以vLLM为例可以看到：
```python
class LocalModelLLMServing_vllm(LLMServingABC):
    '''
    A class for generating text using vllm, with model from huggingface or local directory
    '''
    def __init__(self, 
                 hf_model_name_or_path: str = None,
                 hf_cache_dir: str = None,
                 hf_local_dir: str = None,
                 vllm_tensor_parallel_size: int = 1,
                 vllm_temperature: float = 0.7,
                 vllm_top_p: float = 0.9,
                 vllm_max_tokens: int = 1024,
                 vllm_top_k: int = 40,
                 vllm_repetition_penalty: float = 1.0,
                 vllm_seed: int = None,
                 vllm_max_model_len: int = None,
                 vllm_gpu_memory_utilization: float=0.9,
                 ):
```
`hf_`前缀的主要是模型名和缓存路径等等，而`vllm_`前缀的则是vllm引擎的内置参数，按显卡数量填入相关参数即可实现本地模型推理，SGLang也同理。

使用时直接在python脚本头部填入`from dataflow.serving import LocalVLMServing_vllm`即可使用，将后续声明的LLMServing变量换成它，即可实现本地推理LLM。


## 详解: Storage类
`dataflow.utils.storage`([./dataflow/utils/storage.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/utils/storage.py))中存放着DataFlow的Storage类，主要包括：
- `FileStorage`:
- `LazyFileStorage`: 


`FileStorage`内部使用Pandas库的`DataFrame`来组织数据。算子通过在run函数中传入storage作为形参来实现对数据的读写，storage是串联算子，实现数据沟通的桥梁，所有算子都需要和storage交互。

默认的`FileStorage`会在每一个算子step后输出当前`Dataframe`内的所有数据到文件系统，直到运行结束。它提供了如下形参：
```python
class FileStorage(DataFlowStorage):
    """
    Storage for file system.
    """
    def __init__(
        self, 
        first_entry_file_name: str,
        cache_path:str="./cache",
        file_name_prefix:str="dataflow_cache_step",
        cache_type:Literal["json", "jsonl", "csv", "parquet", "pickle"] = "jsonl"
    ):
```
其中各形参含义如下：
- `first_entry_file_name`：输入的入口文件路径。特别的，如果这里是空字符串，则默认提供一个空的Dataframe给算子使用。
- `cache_path`: 每个算子step输出数据的路径，相当于存放pipeline运行时产生的所有临时文件的路径
- `file_name_prefix`: 每个算字step输出的中间文件的文件名前缀。
- `cache_type`: 每个算字step输出的中间文件的文件的文件类型，这里支持"json", "jsonl", "csv", "parquet", "pickle"这些类型。

有些时候可能会觉得每一个算子Step都输出一个中间文件会给存储带来太大压力，即可通过`LazyFileStorage`来存储，它只保存最最终的输出文件。
只需要在上述的pipeline中把storage类换成该类即可。

