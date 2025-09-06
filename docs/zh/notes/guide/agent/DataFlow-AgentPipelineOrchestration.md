---
title: Agent-快速开始
icon: carbon:ibm-consulting-advantage-agent
createTime: 2025/06/19 10:29:31
permalink: /zh/guide/DataFlow-AgentPipelineOrchestration/

---

## 快速开始

### 1. 概述

DataFlow Agent 是一个基于多智能体协同的自动化任务处理系统，覆盖 **任务拆解 → 工具注册 → 调度执行 → 结果验证 → 报告生成** 的完整流程，致力于复杂任务的智能化管理与执行。根据用户的数据类型和用户要求，支持：

1. `recommend`: 专属算子推荐、编排、执行和总结
2. `write`: Dataflow风格的用户个性化算子生成


运行脚本的示例位于`test\test_dataflow_agent.py`。其中，大部分配置可通过配置`ChatAgentRequest`类的参数来设置，包括：
- 用户请求 (`target`)
- 本地数据读取路径 (`json_file`)
- 调用模型方式和模型类型 (`model`)
- 生成代码的存储路径 (`py_path`)


### 2. 数据准备

- **支持格式**：`json`, `jsonl`, `pdf`格式。
- 当前示例脚本`test\test_dataflow_agent.py`中默认数据存放位置为`example/ReasoningPipeline/pipeline_math_short.json`。可设置`json_file`参数为用户数据文件路径。


### 3. 模型准备
DataFlow Agent 需要先配置环境变量以支持大模型API调用。在Linux系统下：
```bash
export DF_API_KEY=your_api_key
export DF_API_URL=your_api_base_url
```
在Windows CMD中：
```cmd
set DF_API_KEY=your_api_key
set DF_API_URL=your_api_base_url
```
在Windows PowerShell中：
```powershell
$env:DF_API_KEY = "your_api_key"
$env:DF_API_URL = "your_api_base_url"
```


模型类型可在实例化`ChatAgentRequest`类时通过`model`参数指定。


### 4. `recommend`: 算子推荐、编排、执行和总结


用户可运行以下指令执行示例脚本，通过传入`recommend`参数，实现一个简易的针对数学类数据的数据处理Pipeline推荐和生成，生成的Pipeline代码将保存在`test/recommend_pipeline_2.py`中。

```bash
cd DataFlow
# set API_KEY and API_URL
python test/test_dataflow_agent.py recommend
```

生成的Pipeline代码（由于所选大模型类型和版本差异，结果可能不同）大致为：
```python
import pytest
from dataflow.operators.generate.Reasoning.ReasoningQuestionGenerator import ReasoningQuestionGenerator
from dataflow.operators.process.Reasoning.ReasoningQuestionFilter import ReasoningQuestionFilter
from dataflow.operators.generate.Reasoning.ReasoningQuestionDifficultySampleEvaluator import ReasoningQuestionDifficultySampleEvaluator
from dataflow.operators.generate.Reasoning.ReasoningQuestionCategorySampleEvaluator import ReasoningQuestionCategorySampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request, LocalModelLLMServing_vllm, LocalModelLLMServing_sglang


class RecommendPipeline():
    def __init__(self):

        # -------- FileStorage (请根据需要修改参数) --------
        self.storage = FileStorage(
            first_entry_file_name="/mnt/public/data/lh/ygc/dataflow-agent/DataFlow/dataflow/example/ReasoningPipeline/pipeline_math_short.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )


        # -------- LLM Serving (Local) --------
        llm_serving = LocalModelLLMServing_vllm(
            hf_model_name_or_path="/mnt/public/model/huggingface/Qwen2.5-7B-Instruct",
            vllm_tensor_parallel_size=1,
            vllm_max_tokens=8192,
            hf_local_dir="local",
        )

        self.questiongenerator = ReasoningQuestionGenerator(num_prompts=1, llm_serving=llm_serving)
        self.questionfilter = ReasoningQuestionFilter(system_prompt="You are a helpful assistant.", llm_serving=llm_serving)
        self.questiondifficultyclassifier = ReasoningQuestionDifficultySampleEvaluator(llm_serving=llm_serving)
        self.questioncategoryclassifier = ReasoningQuestionCategorySampleEvaluator(llm_serving=llm_serving)

    def forward(self):
        self.questiongenerator.run(
            storage=self.storage.step(), input_key=""
        )
        self.questionfilter.run(
            storage=self.storage.step(), input_key="math_problem"
        )
        self.questiondifficultyclassifier.run(
            storage=self.storage.step(), input_key="", output_key="difficulty_score"
        )
        self.questioncategoryclassifier.run(
            storage=self.storage.step(), input_key="instruction", output_key="question_category"
        )


if __name__ == "__main__":
    pipeline = RecommendPipeline()
    pipeline.forward()
```

用户可通过修改`ChatAgentRequest`中参数实现个性化配置。

### 5. `write`: 用户个性化算子生成

用户可运行以下指令执行示例脚本，通过传入`write`参数，实现一个简易的针对数学类数据的MinHash文本去重算子生成，生成的算子代码将保存在`test/operator.py`中。

```shell
cd DataFlow
# set API_KEY and API_URL
python test/test_dataflow_agent.py write
```

生成的算子代码（由于所选大模型类型和版本差异，结果可能不同）大致为：
```python
from tqdm import tqdm
from datasketch import MinHash, MinHashLSH
from dataflow import get_logger
from dataflow.core import OperatorABC
from dataflow.utils.storage import DataFlowStorage
from dataflow.utils.registry import OPERATOR_REGISTRY

@OPERATOR_REGISTRY.register()
class TextMinHashDeduplicator(OperatorABC):
    def __init__(self, num_perm: int = 128, threshold: float = 0.9, ngram: int = 5):
        self.logger = get_logger()
        self.num_perm = num_perm
        self.threshold = threshold
        self.ngram = ngram

    @staticmethod
    def get_desc(lang: str = "zh"):
        return "使用 MinHash 算法对文本去重" if lang == "zh" else "Deduplicate text with MinHash"

    def _build_minhash(self, text: str):
        m = MinHash(num_perm=self.num_perm)
        for i in range(max(len(text) - self.ngram + 1, 1)):
            m.update(text[i:i + self.ngram].encode("utf8"))
        return m

    def run(self, storage: DataFlowStorage, input_key: str = "text", output_key: str = "dedup_label"):
        df = storage.read("dataframe")
        lsh = MinHashLSH(threshold=self.threshold, num_perm=self.num_perm)
        labels = [0] * len(df)
        with lsh.insertion_session() as session:
            for idx, row in tqdm(df.iterrows(), total=len(df)):
                text = str(row[input_key])
                mh = self._build_minhash(text)
                if len(lsh.query(mh)) == 0:
                    labels[idx] = 1
                    session.insert(idx, mh)
        df[output_key] = labels
        storage.write(df[df[output_key] == 1])
        return [output_key]
```

用户可通过修改`ChatAgentRequest`中参数实现个性化配置。


### 6. 通过Gradio体验DataFlow-Agent
#### 启动方式
##### 方式一：直接启动
安装好`dataflow`包之后，通过 `dataflow webui agent` 直接启动 Gradio 前后端，默认端口为 7862。
##### 方式二：前后端分离启动
- 启动前端：
``` bash
python test/test_agent_fronted_gradio.py
```

- 启动后端：

``` bash
python test/test_dataflow_agent_with_ui.py
```
### 7. `dataflow init`之后通过命令行的方式体验agent

- 算子编写
``` bash 
python dataflow_agent/run_dataflow_agent_with_console.py write
```
- 算子编排
``` bash 
python dataflow_agent/run_dataflow_agent_with_console.py recommend
```





