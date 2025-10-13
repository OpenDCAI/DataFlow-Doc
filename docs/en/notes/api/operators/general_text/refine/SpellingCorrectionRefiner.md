---
title: SpellingCorrectionRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/spellingcorrectionrefiner/
---

## 📘 Overview
The `SpellingCorrectionRefiner` is an operator designed to correct spelling errors in text using the SymSpell algorithm. It supports custom edit distances and dictionary paths, and will automatically download a standard English frequency dictionary if one is not found locally. This operator uses approximate string matching to perform its correction tasks.

## __init__ function
```python
def __init__(self, max_edit_distance: int = 2, prefix_length: int = 7, dictionary_path: str = "frequency_dictionary_en_82_765.txt")
```
### init Parameters
| Parameter Name        | Type | Default Value                               | Description                                                                                          |
| :-------------------- | :--- | :------------------------------------------ | :--------------------------------------------------------------------------------------------------- |
| **max_edit_distance** | int  | 2                                           | The maximum edit distance (Levenshtein distance) for a spelling correction suggestion.               |
| **prefix_length**     | int  | 7                                           | The prefix length used to index the dictionary. Affects performance and memory.                      |
| **dictionary_path**   | str  | "frequency_dictionary_en_82_765.txt"        | Path to the frequency dictionary file. If the file does not exist locally, it will be downloaded.    |

### Prompt Template Descriptions
| Prompt Template Name | Main Purpose | Applicable Scenarios | Feature Description |
| -------------------- | ------------ | -------------------- | ------------------- |
|                      |              |                      |                     |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### Parameters
| Name        | Type            | Default Value | Description                                                                   |
| :---------- | :-------------- | :------------ | :---------------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required      | The data flow storage instance, responsible for reading and writing data.     |
| **input_key** | str             | Required      | The name of the input column containing the text to be spell-checked.         |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
The operator modifies the column specified by `input_key` in place and preserves all other columns.

| Field       | Type | Description                                        |
| :---------- | :--- | :------------------------------------------------- |
| [input_key] | str  | The text from the input column after correction.   |
| ...         | any  | Other columns from the original input are preserved. |

Example Input:
```json
{
"id": 123,
"text_with_errors": "This is a sentance with severel speling mistaks."
}
```
Example Output (with `input_key="text_with_errors"`):
```json
{
"id": 123,
"text_with_errors": "This is a sentence with several spelling mistakes."
}
```
