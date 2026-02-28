---
title: 案例9. 语音转文字
createTime: 2025/08/22 16:37:30
permalink: /zh/guide/du2akut8/
icon: fad:headphones
---


本示例展示使用SpeechTranscriptor算子进行语音转文字。

## 语音转文字
### 第一步:安装DataFlow环境
```bash
pip install open-dataflow[vllm]
```

### 第二步:创建新的dataflow工作文件夹
```shell
mkdir run_dataflow
cd run_dataflow
```

### 第三步:初始化Dataflow
```shell
dataflow init
```
这时你会看见
```shell
run_dataflow/gpu_pipelines/speechtranscription_pipeline.py
```

### 第四步:准备需要翻译的数据
```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/SpeechTranscription/pipeline_speechtranscription.jsonl", # 数据路径写在这里
    cache_path="./cache",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl",
)
```

数据格式如下
```jsonl
{"raw_content": "../example_data/SpeechTranscription/audio/test.wav"}
{"raw_content": "https://raw.githubusercontent.com/FireRedTeam/FireRedASR/main/examples/wav/IT0011W0001.wav"}
```

### 第五步:启动serving
```python
self.llm_serving = LocalModelLALMServing_vllm(
    hf_model_name_or_path='Qwen/Qwen2-Audio-7B-Instruct',   # 填入模型路径
    vllm_tensor_parallel_size=4,
    vllm_max_tokens=8192,
)
```

### 第六步:语音转文字算子
```python
self.speech_transcriptor = SpeechTranscriptor(
    llm_serving = self.llm_serving,  
    system_prompt="你是一个专业的翻译员，你需要将语音转录为文本。"  # 模型系统提示词
)
```

### 第七步:执行算子
```python
self.speech_transcriptor.run(
    storage=self.storage.step(),
    input_key="raw_content"
)
```
