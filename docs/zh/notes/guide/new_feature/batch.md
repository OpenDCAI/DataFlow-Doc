---
title: 内测：Batch化推理
createTime: 2025/12/30 11:47:05
permalink: /zh/guide/batch/
---
# 内测：断点Resume
> 此功能处于内测阶段，可能有bug，发现问题请及时通过issue反馈，感谢理解

## 概述
推理时，如果一个算子持有大量数据，比如几千条数据，中间发生了异常中断，这几千条中已经推理的部分会原地丢失，相应的API也会被浪费掉。

为了解决这个问题，我们设计了Batch化推理的接口，流程如下：

1. 开始推理第一个算子
2. 第一个算子一次只给输入一个batch
3. 当前step输出的结果存放在一个可以append的输出step文件中（比如jsonl或者csv）
4. 直到整个数据集的数据都在当前算子推理完成，继续推理下一个算子。
5. 整个pipeline都按照这个方式推理完成

## 使用方法
与[框架设计-resume流水线](/zh/guide/basicinfo/framework/#断点恢复流水线-resume)相似，不过pipeline需要继承另一个基类`BatchedPipelineABC`来实现，也同样需要compile，并且在forward函数中传入更多的形参。此外目前`Storage`也需要继承另一个特殊的`BatchedFileStorage`类。
```python
import re
from dataflow.pipeline import BatchedPipelineABC  # [!code highlight]
from dataflow.operators.general_text import (
    LLMLanguageFilter,
)
from dataflow.operators.text_pt import MetaSampleEvaluator
from dataflow.operators.core_text import PromptedGenerator
from dataflow.serving import APILLMServing_request
from dataflow.utils.storage import BatchedFileStorage  # [!code highlight]

class AutoOPPipeline(BatchedPipelineABC):  # [!code highlight]
    
    def __init__(self):
        super().__init__()
        self.storage = BatchedFileStorage( # [!code highlight]
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/pt_input.jsonl",
            cache_path="./cache_autoop",
            file_name_prefix="dataflow_cache_auto_run",
            cache_type="jsonl",
        )
        self.llm_serving = APILLMServing_request(
                    api_url="http://api.openai.com/v1/chat/completions",
                    model_name="gpt-4o",
                    max_workers=30
        )
        self.op1 = PromptedGenerator(
            llm_serving=self.llm_serving1,
            system_prompt="请将以下内容翻译成中文：",
        )
        self.op2 = PromptedGenerator(
            llm_serving=self.llm_serving1,
            system_prompt="请将以下内容翻译成韩文：",
        )
        self.op3 = PromptedGenerator(
            llm_serving=self.llm_serving1,
            system_prompt="请将以下内容翻译成日语："
        )
        
    def forward(self):
        self.op1.run(
            self.storage.step(),
            input_key='raw_content',
            output_key='content_cn1'
        )
        self.op2.run(
            self.storage.step(),
            input_key='raw_content',
            output_key='content_cn2'
        )
        self.op3.run(
            self.storage.step(),
            input_key='raw_content',
            output_key='content_cn3'
        )
        
if __name__ == "__main__":
    pipeline = AutoOPPipeline()
    pipeline.compile() # [!code highlight]
    pipeline.forward(
        batch_size=2,  # [!code highlight]
        resume_from_last=True 
    )
```

`resume_from_last`可以直接从当前cache路径下读取到的最后一个step文件，自动继续训练。
特别的，也可以使用`resume_step`来从具体的一个之前的某一个具体的算子step恢复。不过这两个形参只能设置其中一个避免逻辑冲突。
```python
    # 以下调用方式也是可以的
    ...
    pipeline.compile()
    pipeline.forward(
        batch_size=2, 
        resume_step=2  # 从index为2的算子恢复，第一个算子的index是0
    )
```

