---
title: LanguageFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/languagefilter/
---

## 📘 概述

`LanguageFilter` 是一个语言过滤算子，使用 FastText 语言识别模型过滤数据。它会下载并加载预训练的 FastText 模型，检查输入文本的语言是否在用户指定的允许语言列表中，并只保留符合条件的行。

## `__init__`函数

```python
def __init__(self, allowed_languages: list, model_cache_dir: str = None)
```

### init参数说明

| 参数名              | 类型   | 默认值 | 说明                                                         |
| :------------------ | :----- | :----- | :----------------------------------------------------------- |
| **allowed_languages** | list | 必需   | 允许的语言标签列表，例如 `['__label__en', '__label__zh']`。支持的语言代码可参考 [FastText 语言识别文档](https://github.com/facebookresearch/flores/tree/main/flores200#languages-in-flores-200)。 |
| **model_cache_dir** | str    | None   | 模型缓存目录的路径。如果为 `None`，则使用默认的 Hugging Face 缓存位置。 |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='language_label')
```

#### 参数

| 名称          | 类型              | 默认值             | 说明                                       |
| :------------ | :---------------- | :----------------- | :----------------------------------------- |
| **storage**   | DataFlowStorage   | 必需               | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str               | 必需               | 输入列名，对应待检测语言的文本字段。       |
| **output_key**  | str               | 'language_label'   | 输出列名，用于存储语言检测结果的标签（1表示通过，0表示未通过）。     |

## 🧠 示例用法

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
        
        # 只允许英文和中文
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

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 原始输入文本 |
| language_label | int | 语言过滤标签（1表示语言在允许列表中，0表示不在） |

### 📋 示例输入

```json
{"text": "Hello, this is a test in English. How are you doing today?"}
{"text": "你好，这是一段中文测试文本。今天天气很好。"}
{"text": "Bonjour, ceci est un test en français."}
```

### 📤 示例输出

```json
{"text": "Hello, this is a test in English. How are you doing today?", "language_label": 1}
{"text": "你好，这是一段中文测试文本。今天天气很好。", "language_label": 1}
```

### 📊 结果分析

**样本1（英文文本）**：
- 检测语言：__label__en（英语）
- 允许语言列表：['__label__en', '__label__zh']
- **通过过滤**（英语在允许列表中）

**样本2（中文文本）**：
- 检测语言：__label__zh（中文）
- 允许语言列表：['__label__en', '__label__zh']
- **通过过滤**（中文在允许列表中）

**样本3（法语文本）**：
- 检测语言：__label__fr（法语）
- 允许语言列表：['__label__en', '__label__zh']
- **未通过过滤**（法语不在允许列表中）

**应用场景**：
- 筛选特定语言的训练数据
- 构建单语或多语数据集
- 过滤混杂语言的文本
- 确保数据集语言纯度

**支持的语言代码**：

FastText 语言识别模型支持 200+ 种语言。完整的语言代码列表可以参考：
- [FLORES-200 语言列表](https://github.com/facebookresearch/flores/tree/main/flores200#languages-in-flores-200)

常用语言代码示例：
- 英语：`__label__en`
- 中文：`__label__zh` (包括简体和繁体)
- 法语：`__label__fr`
- 西班牙语：`__label__es`
- 日语：`__label__ja`
- 韩语：`__label__ko`
- 德语：`__label__de`
- 俄语：`__label__ru`
- 阿拉伯语：`__label__ar`

**注意事项**：
- 首次运行会从 Hugging Face 下载 FastText 语言识别模型
- 语言标签格式为 `__label__<语言代码>`，如 `__label__en`、`__label__zh`、`__label__fr` 等
- 支持 FastText 识别的所有语言代码（200+ 种语言）
- 模型会对文本进行 Top-5 语言预测，只要其中任何一个在允许列表中即通过
