---
title: KBCTextCleaner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/kbctextcleaner/
---

## 📘 概述
`KBCTextCleaner` 是一个知识清洗算子，对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化，旨在提升RAG知识库的质量和可靠性。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC, lang="en", prompt_template = KnowledgeCleanerPrompt)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **lang** | str | "en" | 语言设置，用于选择提示词模板的语言，支持'zh'和'en'。 |
| **prompt_template** | PromptABC | `KnowledgeCleanerPrompt()` | 提示词模板对象。若不提供，则使用默认的 `KnowledgeCleanerPrompt`。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key:str = "raw_chunk", output_key:str = "cleaned_chunk")
```
执行算子主逻辑，从存储中读取输入 DataFrame，生成清洗后的知识文本，并将结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "raw_chunk" | 输入列名，对应原始知识块字段。 |
| **output_key** | str | "cleaned_chunk" | 输出列名，对应清洗后的知识块字段。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| raw_chunk | str | 输入的原始知识文本。 |
| cleaned_chunk | str | 模型生成的清洗后知识文本。 |

示例输入：
```json
{
"raw_chunk":"<div class=\"container\">\n  <h1>标题文本</h1>\n  <p>正文段落，包括特殊符号，例如“弯引号”、–破折号等</p>\n  <img src=\"example.jpg\" alt=\"示意图\">\n  <a href=\"...\">链接文本</a>\n  <pre><code>代码片段</code></pre>\n</div>"
}
```
示例输出：
```json
{
"raw_chunk":"<div class=\"container\">\n  <h1>标题文本</h1>\n  <p>正文段落，包括特殊符号，例如“弯引号”、–破折号等</p>\n  <img src=\"example.jpg\" alt=\"示意图\">\n  <a href=\"...\">链接文本</a>\n  <pre><code>代码片段</code></pre>\n</div>",
"cleaned_chunk":"标题文本\n\n正文段落，包括特殊符号，例如\"直引号\"、-破折号等\n\n[Image: 示意图 example.jpg]\n\n链接文本\n\n<code>代码片段</code>"
}
```
