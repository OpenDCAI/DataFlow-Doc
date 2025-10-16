---
title: RemoveEmoticonsRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removeemoticonsrefiner/
---

## 📘 概述 [RemoveEmoticonsRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refiners/remove_emoticons_refiner.py)
该算子用于移除文本中的文本型表情符号，例如':-)'、':D'、':('等字符组合表情。基于预定义的表情符号字典进行匹配替换，支持多种常见文本表情模式。

## __init__函数
```python
def __init__(self)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| - | - | - | 该算子在初始化时无需传入任何参数。 |

### Prompt模板说明


## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待处理的文本字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import RemoveEmoticonsRefiner
from dataflow.utils.storage import FileStorage

class RemoveEmoticonsRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_emoticons_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveEmoticonsRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveEmoticonsRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 移除文本表情符号后的文本 |

### 📋 示例输入

```json
{"text":"Hello world!"}
{"text":"I am happy :) today :D"}
{"text":"Sad face :( and angry >:("}
```

### 📤 示例输出

```json
{"text":"Hello world!"}
{"text":"I am happy  today "}
{"text":"Sad face  and angry >"}
```

### 📊 结果分析

**样本1**：无表情符号，保持不变
**样本2**：移除 `:)` 和 `:D`
**样本3**：移除 `:(` 但 `>:(` 只部分移除

**应用场景**：
- 清理社交媒体文本
- 移除文本表情符号（非 emoji）
- 文本标准化

**注意事项**：
- 仅移除基于字符的表情符号（如 :) :D :(）
- 不移除 Unicode emoji（请使用 RemoveEmojiRefiner）
