---
title: RemoveExtraSpacesRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removeextraspacesrefiner/
---

## 📘 概述

[RemoveExtraSpacesRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refine/remove_extra_spaces_refiner.py) 是一个文本优化算子，用于移除指定文本字段中的多余空格。它会将连续的多个空格替换为单个空格，并移除文本开头和结尾的空白字符，以实现文本格式的标准化。

## \_\_init\_\_函数

```python
def __init__(self)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :----- | :--- | :----- | :--- |
| **-**  | -    | -      | 无初始化参数 |

## run函数

```python
def run(self, storage, input_key)
```

#### 参数

| 名称        | 类型            | 默认值 | 说明                                     |
| :---------- | :-------------- | :----- | :--------------------------------------- |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | str             | 必需   | 输入列名，对应需要进行空格标准化的文本字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import RemoveExtraSpacesRefiner
from dataflow.utils.storage import FileStorage

class RemoveExtraSpacesRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_extra_spaces_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveExtraSpacesRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveExtraSpacesRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 经过空格标准化处理后的文本 |

### 📋 示例输入

```json
{"text":"This  is   a    test     with      extra       spaces."}
{"text":"  Leading spaces and trailing spaces  "}
{"text":"Multiple   spaces    between     words"}
{"text":"Normal text without extra spaces"}
{"text":"Tab\tand\t\tnewline\n\ncharacters   mixed"}
```

### 📤 示例输出

```json
{"text":"This is a test with extra spaces."}
{"text":"Leading spaces and trailing spaces"}
{"text":"Multiple spaces between words"}
{"text":"Normal text without extra spaces"}
{"text":"Tab and newline characters mixed"}
```

### 📊 结果分析

在本测试中，5条输入数据中有4条被修改：

**样本1（多余空格）**：
- 原文："This  is   a    test     with      extra       spaces."
- 将所有连续空格替换为单个空格
- 结果："This is a test with extra spaces."
- **已修改**

**样本2（前后空格）**：
- 原文："  Leading spaces and trailing spaces  "
- 移除前后空白字符，保留单个空格
- 结果："Leading spaces and trailing spaces"
- **已修改**

**样本3（单词间多余空格）**：
- 原文："Multiple   spaces    between     words"
- 将所有连续空格替换为单个空格
- 结果："Multiple spaces between words"
- **已修改**

**样本4（正常文本）**：
- 原文："Normal text without extra spaces"
- 文本本身没有多余空格
- **未修改**（保持原样）

**样本5（制表符和换行符）**：
- 原文："Tab\tand\t\tnewline\n\ncharacters   mixed"
- Tab 和换行符被视为空白字符，转换为单个空格
- 结果："Tab and newline characters mixed"
- **已修改**

**应用场景**：
- 文本格式标准化
- 清理 OCR 识别结果中的格式问题
- 数据预处理阶段统一文本格式
- 移除复制粘贴带来的多余空格

**注意事项**：
- 该算子使用 Python 的 `split()` 和 `join()` 方法实现
- 会自动处理所有类型的空白字符（空格、Tab、换行等）
- 建议在文本清洗流程的后期使用，配合其他 refiner 清理残留空格
