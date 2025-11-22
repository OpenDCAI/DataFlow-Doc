---
title: LLMLanguageFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/llmlanguagefilter/
---

## 📘 Overview

`LLMLanguageFilter` is a large language model (LLM)-based language filtering operator. It identifies the language of input text by calling an LLM and filters data according to a preset list of allowed languages. This operator is mainly used in data cleaning, multilingual data classification, and other scenarios to ensure that text in the data flow meets specific language requirements.

## `__init__` Function

```python
def __init__(self, llm_serving: LLMServingABC = None, allowed_languages: list[str] = ['en'])
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | Large language model service instance for performing language identification. |
| **allowed_languages** | list[str] | ['en'] | List of allowed languages, using ISO 639-1 two-letter language codes (e.g., 'en' for English, 'zh' for Chinese). |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'language_label')
```

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name corresponding to the text field for language identification. |
| **output_key** | str | 'language_label' | Output column name corresponding to the LLM-generated language label field (1 for pass, 0 for fail). |

## 🧠 Example Usage

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
        
        # Initialize LLM service
        llm_serving = LocalModelLLMServing(
            model_name="Qwen/Qwen2.5-7B-Instruct",
            device="cuda"
        )
        
        # Allow only English and Chinese
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

#### 🧾 Default Output Format

After execution, the operator adds a `output_key` column (default `language_label`) to the DataFrame to store the identified language labels. Subsequently, it filters rows where this column's value is in the `allowed_languages` list and writes them back to storage.

| Field | Type | Description |
| :--- | :--- | :--- |
| text | str | Original input text field. |
| language_label | str | Language label identified by LLM (e.g., 'en', 'zh', 'fr', etc.). |

### 📋 Example Input

```json
{"text": "Hello, this is a test message in English."}
{"text": "你好，这是一条中文测试消息。"}
{"text": "Bonjour, ceci est un message de test en français."}
```

### 📤 Example Output

```json
{"text": "Hello, this is a test message in English.", "language_label": "en"}
{"text": "你好，这是一条中文测试消息。", "language_label": "zh"}
```

### 📊 Result Analysis

**Sample 1 (English text)**:
- LLM identified language: en
- Allowed languages list: ['en', 'zh']
- **Passes filter** (en is in allowed list)

**Sample 2 (Chinese text)**:
- LLM identified language: zh
- Allowed languages list: ['en', 'zh']
- **Passes filter** (zh is in allowed list)

**Sample 3 (French text)**:
- LLM identified language: fr
- Allowed languages list: ['en', 'zh']
- **Filtered out** (fr is not in allowed list)

**Use Cases**:
- Use LLM for more accurate language identification
- Process complex, mixed-language text
- Build high-quality multilingual datasets
- Filter training data for specific languages

**Notes**:
- Requires configured LLM service (e.g., LocalModelLLMServing, APILLMServing, etc.)
- Uses ISO 639-1 two-letter language codes (e.g., 'en', 'zh', 'fr', 'es', 'ja', etc.)
- LLM identification accuracy depends on model quality
- Compared to FastText, LLM identification is more accurate but slower
- Suitable for smaller-scale datasets requiring high accuracy
