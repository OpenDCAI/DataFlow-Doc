---
title: RemoveContractionsRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removecontractionsrefiner/
---

## 📘 概述 [RemoveContractionsRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refine/remove_contractions_refiner.py)
该算子用于扩展文本中的英语缩写词，将缩写形式转换为完整形式（例如将"can't"扩展为"cannot"）。 使用`contractions`库进行缩写词扩展，提高文本标准化程度。

## `__init__`函数
```python
def __init__(self)
```
### init参数说明
该函数无参数。

### Prompt模板说明

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称          | 类型              | 默认值 | 说明                                     |
| :------------ | :---------------- | :----- | :--------------------------------------- |
| **storage**   | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str               | 必需   | 输入列名，对应需要处理缩写词的文本字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import RemoveContractionsRefiner
from dataflow.utils.storage import FileStorage

class RemoveContractionsRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_contractions_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveContractionsRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveContractionsRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 扩展缩写词后的文本 |

### 📋 示例输入

```json
{"text":"I can't believe it's so easy"}
{"text":"We'll meet at 3 o'clock"}
{"text":"They're isn't any problem"}
```

### 📤 示例输出

```json
{"text":"I cannot believe it is so easy"}
{"text":"We will meet at 3 of the clock"}
{"text":"They are is not any problem"}
```

### 📊 结果分析

**样本1**："can't" → "cannot", "it's" → "it is"
**样本2**："We'll" → "We will", "o'clock" → "of the clock"  
**样本3**："They're" → "They are", "isn't" → "is not"

**应用场景**：
- 文本标准化
- 提高文本一致性
- NLP 预处理

**注意事项**：
- 使用 contractions 库进行扩展
- 仅处理英文缩写
