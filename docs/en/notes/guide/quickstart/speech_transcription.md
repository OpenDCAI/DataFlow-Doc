---
title: Case 9. Speech transcription
createTime: 2025/08/22 16:38:49
permalink: /en/guide/5pdipkiv/
icon: fad:headphones
---


This example demonstrates how to use the SpeechTranscriptor operator for speech-to-text transcription.

## Speech Transcription
### Step 1: Install the Dataflow Environment
```bash
pip install open-dataflow[vllm]
```

### Step 2: Create a New Dataflow Working Directory
```shell
mkdir run_dataflow
cd run_dataflow
```

### Step 3: Initialize Dataflow
```shell
dataflow init
```
After this step, you should see:
```shell
run_dataflow/gpu_pipelines/speechtranscription_pipeline.py
```

### Step 4: Prepare the data to be translated.
```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/SpeechTranscription/pipeline_speechtranscription.jsonl", # your data path
    cache_path="./cache",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl",
)
```

Data format is as follows
```jsonl
{"raw_content": "../example_data/SpeechTranscription/audio/test.wav"}
{"raw_content": "https://raw.githubusercontent.com/FireRedTeam/FireRedASR/main/examples/wav/IT0011W0001.wav"}
```

### Step 5: Launch serving
```python
self.llm_serving = LocalModelLALMServing_vllm(
    hf_model_name_or_path='Qwen/Qwen2-Audio-7B-Instruct',   # your model path
    vllm_tensor_parallel_size=4,
    vllm_max_tokens=8192,
)
```

### Step 6: Speech transcription operator
```python
self.speech_transcriptor = SpeechTranscriptor(
    llm_serving = self.llm_serving,                  
    system_prompt="You are a professional translator; your task is to transcribe speech into text and then translate it into English."  # model system prompt
)
```

### Step 7: Run the operator
```python
self.speech_transcriptor.run(
    storage=self.storage.step(),
    input_key="raw_content"
)
```
