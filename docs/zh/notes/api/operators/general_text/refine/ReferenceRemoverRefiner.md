---
title: ReferenceRemoverRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/referenceremoverrefiner/
---

## 📘 概述

`ReferenceRemoverRefiner` 是一个文本净化算子，用于删除文本中未闭合的引用标签和引用链接，包括`<ref>`标签和`{{cite}}`模板的各种完整和不完整形式，从而净化文本中的引用标记。

## __init__函数

```python
def __init__(self)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明                |
| :----- | :--- | :----- | :------------------ |
| 无     | -    | -      | 该算子初始化无需参数。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称        | 类型              | 默认值 | 说明                               |
| :---------- | :---------------- | :----- | :--------------------------------- |
| **storage** | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。   |
| **input_key** | str               | 必需   | 输入列名，对应需要净化处理的文本字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import ReferenceRemoverRefiner
from dataflow.utils.storage import FileStorage

class ReferenceRemoverRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/reference_remover_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = ReferenceRemoverRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = ReferenceRemoverRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 移除引用标记后的文本 |

### 📋 示例输入

```json
{"text":"Normal text without references"}
{"text":"This is a fact<ref>source</ref> about history"}
{"text":"Citation example {{cite web|url=http://example.com}}"}
```

### 📤 示例输出

```json
{"text":"Normal text without references"}
{"text":"This is a fact<ref>source</ref> about history"}
{"text":"Citation example {{cite web|url=http://example.com}}"}
```

### 📊 结果分析

**样本1-3**：输出与输入相同（引用标记未被移除）

**应用场景**：
- 清理维基百科文本中的引用标签
- 移除学术文档中的引用标记

**注意事项**：
- 使用正则表达式匹配 `<ref>` 标签和 `{{cite}}` 模板
- 可能需要特定格式的引用才能被识别
