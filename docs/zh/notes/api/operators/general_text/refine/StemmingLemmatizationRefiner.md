---
title: StemmingLemmatizationRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/stemminglemmatizationrefiner/
---

好的，这是根据您提供的代码和模板生成的 `StemmingLemmatizationRefiner` 算子的教程 Markdown。

---

## 📘 概述

[StemmingLemmatizationRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refine/stemming_lemmatization_refiner.py) 算子用于对文本进行词干提取（Stemming）或词形还原（Lemmatization）处理，将文本中的词语转换为其基本或词根形式。这有助于文本标准化，减少词汇的变体，从而提高后续处理任务的性能。该算子支持 Porter 词干提取算法和 WordNet 词形还原方法。

## __init__函数

```python
def __init__(self, method: str = "stemming"):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **method** | str | "stemming" | 指定处理方法。可选值为 'stemming'（词干提取）或 'lemmatization'（词形还原）。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
|---|---|---|---|
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，指定了 DataFrame 中需要进行处理的文本字段。 |

## 📦 依赖说明

该算子依赖 NLTK 的 WordNet 数据。

**方法1：使用预下载的 NLTK 数据（推荐）**

1. 从 [https://github.com/nltk/nltk_data](https://github.com/nltk/nltk_data) 下载 NLTK 数据包，确保包含：
   - `wordnet/`
   - `omw-1.4/`

2. 设置环境变量指向数据路径：
   ```bash
   export NLTK_DATA=/path/to/nltk_data
   ```

**方法2：自动下载**

首次使用时，算子会自动下载所需数据到默认位置（`~/nltk_data` 或 `./dataflow_cache/nltk_data`）

## 🧠 示例用法

```python
from dataflow.operators.general_text import StemmingLemmatizationRefiner
from dataflow.utils.storage import FileStorage

class StemmingLemmatizationRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/stemming_lemmatization_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = StemmingLemmatizationRefiner()  # 默认使用 stemming
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = StemmingLemmatizationRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 词干提取或词形还原后的文本 |

### 📋 示例输入

```json
{"text":"running jumps quickly"}
{"text":"cats dogs playing"}
{"text":"studied studying studies"}
```

### 📤 示例输出（method="stemming"）

```json
{"text":"run jump quickli"}
{"text":"cat dog play"}
{"text":"studi studi studi"}
```

### 📊 结果分析

**样本1**："running" → "run", "jumps" → "jump", "quickly" → "quickli"
**样本2**："cats" → "cat", "dogs" → "dog", "playing" → "play"
**样本3**：三种形式 "studied" "studying" "studies" 都变为 "studi"

**应用场景**：
- 文本标准化和归一化
- 信息检索中的词汇匹配
- 文本分类特征提取
- 减少词汇表规模

**注意事项**：
- Stemming（词干提取）：速度快但可能产生非真实词（如 "quickli"）
- Lemmatization（词形还原）：准确但速度较慢，需要 WordNet 数据
- 仅适用于英文文本
