---
title: LLMLanguageFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/llmlanguagefilter/
---

## 📘 概述

`LLMLanguageFilter` 是一个基于大语言模型（LLM）的语言过滤算子。它通过调用 LLM 识别输入文本的语言，并根据预设的允许语言列表对数据进行筛选。该算子主要用于数据清洗、多语言数据分类等场景，确保数据流中的文本符合特定的语言要求。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC = None, allowed_languages: list[str] = ['en'])
```

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行语言识别。 |
| **allowed_languages** | list[str] | ['en'] | 允许通过的语言列表，使用 ISO 639-1 双字母语言代码（例如 'en' 代表英语，'zh' 代表中文）。 |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'language_label')
```

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要进行语言识别的文本字段。 |
| **output_key** | str | 'language_label' | 输出列名，对应 LLM 生成的语言标签字段（1表示通过，0表示未通过）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import LLMLanguageFilter
from dataflow.serving import LocalModelLLMServing
from dataflow.utils.storage import FileStorage

class LLMLanguageFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/llm_language_filter_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        # 初始化 LLM 服务
        llm_serving = LocalModelLLMServing(
            model_name="Qwen/Qwen2.5-7B-Instruct",
            device="cuda"
        )
        
        # 只允许英文和中文
        self.filter = LLMLanguageFilter(
            llm_serving=llm_serving,
            allowed_languages=['en', 'zh']
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='language_label'
        )

if __name__ == "__main__":
    test = LLMLanguageFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

算子执行后，会向 DataFrame 中添加一个 `output_key`（默认为 `language_label`）列，用于存储识别出的语言标签。随后，它会筛选出该列值在 `allowed_languages` 列表中的行，并写回存储。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| text | str | 输入的原始文本字段。 |
| language_label | str | LLM识别出的语言标签（例如 'en', 'zh', 'fr' 等）。 |

### 📋 示例输入

```json
{"text": "Hello, this is a test message in English."}
{"text": "你好，这是一条中文测试消息。"}
{"text": "Bonjour, ceci est un message de test en français."}
```

### 📤 示例输出

```json
{"text": "Hello, this is a test message in English.", "language_label": "en"}
{"text": "你好，这是一条中文测试消息。", "language_label": "zh"}
```

### 📊 结果分析

**样本1（英文文本）**：
- LLM 识别语言：en
- 允许语言列表：['en', 'zh']
- **通过过滤**（en 在允许列表中）

**样本2（中文文本）**：
- LLM 识别语言：zh
- 允许语言列表：['en', 'zh']
- **通过过滤**（zh 在允许列表中）

**样本3（法语文本）**：
- LLM 识别语言：fr
- 允许语言列表：['en', 'zh']
- **未通过过滤**（fr 不在允许列表中）

**应用场景**：
- 使用 LLM 进行更精准的语言识别
- 处理复杂、混合语言的文本
- 构建高质量的多语言数据集
- 过滤特定语言的训练数据

**注意事项**：
- 需要配置 LLM 服务（如 LocalModelLLMServing、APILLMServing 等）
- 使用 ISO 639-1 双字母语言代码（如 'en', 'zh', 'fr', 'es', 'ja' 等）
- LLM 识别的准确性取决于模型质量
- 相比 FastText，LLM 识别更准确但速度较慢
- 适合处理较小规模但要求高准确性的数据集
