---

title: Quick Start – Your First Pipeline
createTime: 2025/06/30 19:19:16
permalink: /en/guide/first_pipeline/
icon: solar:flag-2-broken
---
# Quick Start

## Code for the First Pipeline

Here is a minimal DataFlow pipeline that allows you to use the same prompt to drive a large language model to transform your batch inputs. You can copy it and run it directly, or refer to the similar [Google Colab example](https://colab.research.google.com/drive/1haosl2QS4N4HM7u7HvSsz_MnLabxexXl?usp=sharing) we provide to run it.


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
            first_entry_file_name="./input.json", # input dataset path
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

## Dataset Preparation

Of course, you need to prepare the corresponding dataset. You can create a dataset named `./input.json` and fill it with some test data. Below is an out-of-the-box question set:

```json
[
    {"question": "Who are you."},
    {"question": "Which animal likes to eat banana."},
    {"question": "What color is an apple?"}
]
```

## API_KEY Preparation

Since the pipeline above uses an API-based large language model, you need to provide the corresponding `api_url` and secret key (token/key). For security reasons, you should export the `DF_API_KEY` environment variable. This design avoids writing the key into a GitHub repository and risking leakage. On Linux:

```bash
export DF_API_KEY=sh-xxxxx
```

On Windows CMD, you can use the following command to set the environment variable:

```cmd
set DF_API_KEY=sh-xxxxx
```

Or in PowerShell:

```powershell
$env:DF_API_KEY = "sh-xxxxx"
```

After setting it up, the program can read the API key from the environment for invocation. **Make sure not to expose the key in public code.**

## Run the Pipeline

You only need to run the Python file above:

```shell
python mypipeline.py
```

The output is as follows:

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

After that, you can find the output file in the default output directory `./cache/`. This file is the result of one DataFlow execution step:

```jsonl
{"question":"Who are you.","answer":"I am a virtual assistant designed to help you with a variety of tasks and answer questions to the best of my ability. Whether you need information, advice, or help with a specific task, I'm here to assist you!"}
{"question":"Which animal likes to eat banana.","answer":"Many animals enjoy eating bananas, but some of the most well-known banana lovers are primates, such as monkeys and apes. In addition to primates, many fruit bats, birds, and even some wild pigs and animals like elephants and squirrels occasionally enjoy bananas. These animals are often attracted to the sweetness and high energy content provided by bananas."}
{"question":"What color is an apple?","answer":"An apple can come in several different colors, including red, green, and yellow. Some apples may even have a combination of these colors, such as red with yellow or green with red patches. The color can vary depending on the variety of the apple."}
```

With this, you have completed the simplest operation of using DataFlow to perform batch inference on a set of content!


## Detailed Explanation: LLMServing Classes

If you do not have access to an API but do have your own GPU, we recommend using a local LLMServing to run inference. All available Serving classes can be found at this path ([./dataflow/serving/](https://github.com/OpenDCAI/DataFlow/tree/main/dataflow/serving)).

The local models are mainly the two classes defined in `local_model_llm_serving.py`: `LocalModelLLMServing_vllm` and `LocalModelLLMServing_sglang`. These two use the mainstream large-model inference engines [vLLM](https://github.com/vllm-project/vllm) and [SGLang](https://github.com/sgl-project/sglang) as inference backends, respectively.

To clearly distinguish Hugging Face–related parameters from engine-specific parameters, we separate them by prefixes when implementing the two local LLMServing classes. Taking vLLM as an example, you can see:

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

Parameters prefixed with `hf_` mainly relate to the model name, cache paths, and similar settings, while those prefixed with `vllm_` are built-in parameters of the vLLM engine. By filling in the relevant parameters according to the number of GPUs, you can perform local model inference. The same applies to SGLang.

To use it, simply add `from dataflow.serving import LocalVLMServing_vllm` at the top of your Python script, then replace the subsequently declared LLMServing variable with it to enable local LLM inference.

## Detailed Explanation: Storage Classes

The Storage classes of DataFlow are located in `dataflow.utils.storage` ([./dataflow/utils/storage.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/utils/storage.py)), and mainly include:

* `FileStorage`
* `LazyFileStorage`

`FileStorage` internally uses Pandas `DataFrame` to organize data. Operators read and write data by passing the storage object as a parameter to their `run` function. Storage connects operators and serves as the bridge for data communication; all operators need to interact with storage.

By default, `FileStorage` outputs all data in the current `DataFrame` to the file system after each operator step, until the execution finishes. It provides the following parameters:

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

The meaning of each parameter is as follows:

* `first_entry_file_name`: Path to the input entry file. In particular, if this is an empty string, an empty DataFrame will be provided to the operators by default.
* `cache_path`: The path where each operator step outputs its data, effectively storing all temporary files generated during pipeline execution.
* `file_name_prefix`: The filename prefix for intermediate files output by each operator step.
* `cache_type`: The file type of intermediate files output by each operator step. Supported types include `"json"`, `"jsonl"`, `"csv"`, `"parquet"`, and `"pickle"`.

In some cases, outputting an intermediate file for every operator step may put too much pressure on storage. In such situations, you can use `LazyFileStorage`, which only saves the final output file.

You only need to replace the storage class with this one in the pipeline above.
