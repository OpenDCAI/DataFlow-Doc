---
title: RemoveEmojiRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/removeemojirefiner/
---

## 📘 Overview

The `RemoveEmojiRefiner` is an operator designed to remove Unicode emojis from text. It uses a regular expression to identify and filter out a wide range of emojis, including emoticons, symbols, transport icons, and flags, ensuring clean text data for downstream processing.

## `__init__` function

```python
def __init__(self)
```

This operator has no parameters for initialization.

## `run` function

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### Parameters

| Name          | Type              | Default | Description                                                        |
| :------------ | :---------------- | :------ | :----------------------------------------------------------------- |
| **storage**   | `DataFlowStorage` | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_key** | `str`             | Required | The name of the input column containing the text to be processed.     |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import RemoveEmojiRefiner
from dataflow.utils.storage import FileStorage

class RemoveEmojiRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_emoji_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveEmojiRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveEmojiRefinerTest()
    test.forward()
```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Text with emojis removed |

### 📋 Sample Input

```json
{"text":"Hello world! This is a test without emoji."}
{"text":"Great work 👍 Keep it up! 🎉"}
{"text":"看这个表情😊很开心😄🎊"}
{"text":"Mixed text with 🚀 rocket and 🌟 star emojis"}
{"text":"Celebration time 🎉🎊🎈 with party emojis"}
```

### 📤 Sample Output

```json
{"text":"Hello world! This is a test without emoji."}
{"text":"Great work  Keep it up! "}
{"text":"看这个表情很开心"}
{"text":"Mixed text with  rocket and  star emojis"}
{"text":"Celebration time  with party emojis"}
```

### 📊 Results Analysis

In this test, 4 out of 5 input samples were modified:

**Sample 1 (No Emojis)**:
- Text: "Hello world! This is a test without emoji."
- Contains no emoji symbols
- **Unchanged** (remains as is)

**Sample 2 (English + Emojis)**:
- Original: "Great work 👍 Keep it up! 🎉"
- Removed 👍 and 🎉 emojis
- Result: "Great work  Keep it up! "
- **Modified**

**Sample 3 (Chinese + Emojis)**:
- Original: "看这个表情😊很开心😄🎊"
- Removed all emojis 😊😄🎊
- Result: "看这个表情很开心"
- **Modified**

**Sample 4 (Mixed Emojis)**:
- Original: "Mixed text with 🚀 rocket and 🌟 star emojis"
- Removed 🚀 and 🌟 emojis
- Result: "Mixed text with  rocket and  star emojis"
- **Modified**

**Sample 5 (Celebration Emojis)**:
- Original: "Celebration time 🎉🎊🎈 with party emojis"
- Removed all celebration emojis 🎉🎊🎈
- Result: "Celebration time  with party emojis"
- **Modified**

**Use Cases**:
- Text data standardization and normalization
- Remove emoji interference from social media text
- Prepare clean text data for NLP models
- Clean graphic symbols from user-generated content

**Notes**:
- This operator matches emojis based on Unicode ranges
- Covers common emojis, symbols, flags, and other graphic symbols
- May leave extra spaces after emoji removal; recommend using with `RemoveExtraSpacesRefiner`
