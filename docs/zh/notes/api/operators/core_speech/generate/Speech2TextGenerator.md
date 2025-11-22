---
title: Speech2TextGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_speech/generate/speech2textgenerator/
---

## 📘 概述
`Speech2TextGenerator` 是一个语音转文本算子，用于将语音内容转录为文本。它接收语音文件路径或URL，使用大语言模型进行转录，并将转录结果保存到数据框中。

## \_\_init\_\_函数
```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "You are a helpful assistant")
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行语音转录。 |
| **system_prompt** | str | "You are a helpful assistant" | 系统提示词，用于定义模型行为。 |

### Prompt模板说明

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "generated_content")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "raw_content" | 输入列名，对应语音文件路径或URL字段。 |
| **output_key** | str | "generated_content" | 输出列名，对应生成的转录文本字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| raw_content | str | 输入的语音文件路径或URL。 |
| generated_content | str | 模型生成的转录文本。 |

示例输入：
```json
{
"raw_content":"path/to/your/audio.mp3"
}
```
示例输出：
```json
{
"raw_content":"path/to/your/audio.mp3",
"generated_content":"这是从音频文件中转录出来的文本。"
}
```
