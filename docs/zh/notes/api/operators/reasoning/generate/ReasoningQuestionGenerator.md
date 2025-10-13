---
title: ReasoningQuestionGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/generate/reasoningquestiongenerator/
---

## 📘 概述

[ReasoningQuestionGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_question_generator.py) 是一个推理型问题生成算子，用于基于现有的问题调用大语言模型（LLM）生成新的、相似但多样化的问题。该算子可与多种 Prompt 模板（数学、通用、DIY）和 LLM 服务模块配合使用，实现问题的自动化扩增。

## \_\_init\_\_函数

```python
def __init__(self,
            num_prompts: int = 1,
            llm_serving: LLMServingABC = None,
            prompt_template = MathQuestionSynthesisPrompt | GeneralQuestionSynthesisPrompt | DiyQuestionSynthesisPrompt | DIYPromptABC
            )
```

### init参数说明

| 参数名            | 类型          | 默认值                                                                                           | 说明                                                         |
| :------------------ | :-------------- | :----------------------------------------------------------------------------------------------- | :----------------------------------------------------------- |
| **num_prompts**     | int             | 1                                                                                                | 每个输入问题要生成的新问题的数量，范围为1到5（含）。         |
| **llm_serving**     | LLMServingABC   | 必需                                                                                             | 大语言模型服务实例，用于执行问题的生成。                     |
| **prompt_template** | PromptABC       | 默认支持MathQuestionSynthesisPrompt, GeneralQuestionSynthesisPrompt, DiyQuestionSynthesisPrompt或者集成DIYPromptABC自定义prompt | 提示词模板对象，用于构建问题生成所用的提示词。支持数学、通用与自定义模板。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
|                                  |               |                         |                                                       |
|                                  |               |                         |                                                       |
|                                  |               |                         |                                                       |

## run函数

```python
def run(self, 
        storage: DataFlowStorage, 
        input_key: str,
        output_synth_or_input_flag: str = "Synth_or_Input"
        )
```

#### 参数

| 名称                         | 类型            | 默认值             | 说明                                                                 |
| :--------------------------- | :---------------- | :------------------- | :------------------------------------------------------------------- |
| **storage**                  | DataFlowStorage | 必需                 | 数据流存储实例，负责读取与写入数据。                                 |
| **input_key**                | str               | 必需                 | 输入列名，对应原始问题字段。                                         |
| **output_synth_or_input_flag** | str               | "Synth_or_Input"   | 输出列名，用于标识问题来源。'input'表示原始问题，'synth'表示生成的新问题。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段             | 类型 | 说明                                                               |
| :--------------- | :--- | :----------------------------------------------------------------- |
| [input\_key]     | str  | 输入的问题文本，此列将包含原始问题和新生成的问题。               |
| Synth\_or\_Input | str  | 标识该行问题是原始输入（'input'）还是模型生成的（'synth'）。 |

示例输入：

```json
{
"instruction":"法国的首都是哪里？"
}
```

示例输出（假设 `num_prompts=1`）：

```json
{
"instruction":"法国的首都是哪里？",
"Synth_or_Input":"input"
}
{
"instruction":"哪个城市是法国的首都？",
"Synth_or_Input":"synth"
}
```
