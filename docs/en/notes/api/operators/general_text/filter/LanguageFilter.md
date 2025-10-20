---
title: LanguageFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/languagefilter/
---

## 📘 Overview

`LanguageFilter` is a language filtering operator that uses the FastText language identification model to filter data. It downloads and loads a pre-trained FastText model, checks whether the input text's language is in the user-specified allowed language list, and only retains rows that meet the criteria.

## `__init__` Function

```python
def __init__(self, allowed_languages: list, model_cache_dir: str = None)
```

### Init Parameters

| Parameter              | Type   | Default | Description                                                         |
| :------------------ | :----- | :----- | :----------------------------------------------------------- |
| **allowed_languages** | list | Required   | List of allowed language tags, e.g., `['__label__en', '__label__zh']`. Supported language codes can be referenced in [FastText language identification documentation](https://github.com/facebookresearch/flores/tree/main/flores200#languages-in-flores-200). |
| **model_cache_dir** | str    | None   | Path to model cache directory. If `None`, uses default Hugging Face cache location. |

## `run` Function

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='language_label')
```

#### Parameters

| Name          | Type              | Default             | Description                                       |
| :------------ | :---------------- | :----------------- | :----------------------------------------- |
| **storage**   | DataFlowStorage   | Required               | DataFlow storage instance for reading and writing data.       |
| **input_key** | str               | Required               | Input column name corresponding to the text field for language detection.       |
| **output_key**  | str               | 'language_label'   | Output column name for storing language detection result labels (1 for pass, 0 for fail).     |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import LanguageFilter
from dataflow.utils.storage import FileStorage

class LanguageFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/language_filter_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        # Allow only English and Chinese
        self.filter = LanguageFilter(
            allowed_languages=['__label__en', '__label__zh'],
            model_cache_dir=None
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='language_label'
        )

if __name__ == "__main__":
    test = LanguageFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Original input text |
| language_label | int | Language filter label (1 means language is in allowed list, 0 means not) |

### 📋 Example Input

```json
{"text": "Hello, this is a test in English. How are you doing today?"}
{"text": "你好，这是一段中文测试文本。今天天气很好。"}
{"text": "Bonjour, ceci est un test en français."}
```

### 📤 Example Output

```json
{"text": "Hello, this is a test in English. How are you doing today?", "language_label": 1}
{"text": "你好，这是一段中文测试文本。今天天气很好。", "language_label": 1}
```

### 📊 Result Analysis

**Sample 1 (English text)**:
- Detected language: __label__en (English)
- Allowed languages list: ['__label__en', '__label__zh']
- **Passes filter** (English is in allowed list)

**Sample 2 (Chinese text)**:
- Detected language: __label__zh (Chinese)
- Allowed languages list: ['__label__en', '__label__zh']
- **Passes filter** (Chinese is in allowed list)

**Sample 3 (French text)**:
- Detected language: __label__fr (French)
- Allowed languages list: ['__label__en', '__label__zh']
- **Filtered out** (French is not in allowed list)

**Use Cases**:
- Filter training data for specific languages
- Build monolingual or multilingual datasets
- Filter text with mixed languages
- Ensure dataset language purity

**Supported Language Codes**:

FastText language identification model supports 200+ languages. The complete language code list can be referenced at:
- [FLORES-200 Language List](https://github.com/facebookresearch/flores/tree/main/flores200#languages-in-flores-200)

Common language code examples:
- English: `__label__en`
- Chinese: `__label__zh` (includes Simplified and Traditional)
- French: `__label__fr`
- Spanish: `__label__es`
- Japanese: `__label__ja`
- Korean: `__label__ko`
- German: `__label__de`
- Russian: `__label__ru`
- Arabic: `__label__ar`

**Notes**:
- First run will download the FastText language identification model from Hugging Face
- Language tag format is `__label__<language code>`, e.g., `__label__en`, `__label__zh`, `__label__fr`, etc.
- Supports all language codes recognized by FastText (200+ languages)
- Model makes Top-5 language predictions for text; passes if any of them are in the allowed list
