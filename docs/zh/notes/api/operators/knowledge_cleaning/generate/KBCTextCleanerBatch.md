---
title: KBCTextCleanerBatch
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/kbctextcleanerbatch/
---

## 📘 概述

`KBCTextCleanerBatch` 是一个批处理知识清洗算子，用于对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化，以提升RAG知识库的质量。

## \_\_init\_\_函数

```python
def __init__(self, llm_serving: LLMServingABC, lang="en", prompt_template = None)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **lang** | str | "en" | 指定提示词语言，支持 "zh" (中文) 和 "en" (英文)。 |
| **prompt_template** | PromptABC | None | 提示词模板对象，用于构建清洗指令。若不指定，则使用内置的 `KnowledgeCleanerPrompt`。 |

### Prompt模板说明

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
|KnowledgeCleanerPrompt |多维度清洗用户文本 |私有知识库清洗 |去隐私，去噪声，标准化 |

## run函数

```python
def run(storage, input_key="chunk_path", output_key="cleaned_chunk_path")
```

执行算子主逻辑，从存储中读取输入 DataFrame，对指定路径的文件内容进行清洗，并将结果写回原文件。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "chunk_path" | 输入列名，对应待清洗知识文件路径的字段。 |
| **output_key** | str | "cleaned_chunk_path" | 输出列名，对应已清洗知识文件路径的字段。 |

## 🧠 示例用法
```python
self.knowledge_cleaning_step3 = KBCTextCleanerBatch(
    llm_serving=self.llm_serving,
    lang="en"
)
self.knowledge_cleaning_step3.run(
    storage=self.storage.step(),
)
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| chunk_path | str | 输入的原始知识文本路径。 |
| cleaned_chunk_path | str | 模型生成的清洗后知识文本路径。 |

示例输入chunk_path指向的文件内容：
```json
{
"raw_chunk":"<div class=\"container\">\n  <h1>标题文本</h1>\n  <p>正文段落，包括特殊符号，例如“弯引号”、–破折号等</p>\n  <img src=\"example.jpg\" alt=\"示意图\">\n  <a href=\"...\">链接文本</a>\n  <pre><code>代码片段</code></pre>\n</div>"
}
```
示例输出cleaned_chunk_path指向的文件内容：
```json
{
"raw_chunk":"<div class=\"container\">\n  <h1>标题文本</h1>\n  <p>正文段落，包括特殊符号，例如“弯引号”、–破折号等</p>\n  <img src=\"example.jpg\" alt=\"示意图\">\n  <a href=\"...\">链接文本</a>\n  <pre><code>代码片段</code></pre>\n</div>",
"cleaned_chunk":"标题文本\n\n正文段落，包括特殊符号，例如\"直引号\"、-破折号等\n\n[Image: 示意图 example.jpg]\n\n链接文本\n\n<code>代码片段</code>"
}
```