---
title: LangkitSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/eval/langkitsampleevaluator/
---

## 📘 Overview

`LangkitSampleEvaluator` is a text quality assessment operator that uses the Langkit toolkit to calculate various statistical metrics of text, helping evaluate text structural complexity and readability. This operator can extract multiple linguistic features, including sentence length, lexical diversity, sentiment orientation, etc.

## __init__

```python
def __init__(self)
```

This operator requires no parameters during initialization.

## run

```python
def run(self, storage: DataFlowStorage, input_key: str)
```
Executes the operator's main logic, reading the input DataFrame from storage, performing Langkit evaluation on text in the specified column, and adding evaluation results (multiple scores) as new columns back to the DataFrame and writing to storage.

#### Parameters
| Name | Type | Default | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | Required | Input column name specifying the column containing the text to be evaluated. |

## 🧠 Example Usage
```python
from dataflow.operators.general_text import LangkitSampleEvaluator
from dataflow.utils.storage import FileStorage

class LangkitSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/eval_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = LangkitSampleEvaluator()
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = LangkitSampleEvaluatorTest()
    test.forward()
```

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | The original input text |
| flesch_reading_ease | float | Flesch Reading Ease score (0-100, higher indicates easier to read) |
| automated_readability_index | float | Automated Readability Index |
| syllable_count | int | Total number of syllables |
| lexicon_count | int | Total number of words |
| sentence_count | int | Total number of sentences |
| character_count | int | Total number of characters |
| letter_count | int | Total number of letters |
| polysyllable_count | int | Number of polysyllabic words |
| monosyllable_count | int | Number of monosyllabic words |
| difficult_words | int | Number of difficult words |

### 📋 Example Input
```json
{"text": "The quick brown fox jumps over the lazy dog. The sun is shining brightly in the clear blue sky. Birds are singing melodiously in the tall green trees. Children are playing happily in the beautiful park. Flowers are blooming magnificently everywhere you look. Nature displays its wonder through colorful butterflies dancing among fragrant roses. People enjoy peaceful walks along winding pathways surrounded by lush vegetation."}
{"text": "The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat. The cat sat on the mat."}
{"text": "In contemporary discourse surrounding technological advancement, one must acknowledge the multifaceted ramifications of artificial intelligence implementation. The epistemological considerations necessitate comprehensive analysis of socioeconomic implications. Furthermore, the paradigmatic shift toward automation requires meticulous examination of ethical frameworks governing algorithmic decision-making processes. Subsequently, organizational infrastructures must accommodate transformative methodologies while simultaneously addressing unprecedented complexities inherent within technological ecosystems."}
```

### 📤 Example Output
```json
{"text": "The quick brown fox...", "flesch_reading_ease": 72.53, "automated_readability_index": 6.94, "syllable_count": 128, "lexicon_count": 68, "sentence_count": 7, "character_count": 396, "letter_count": 325, "polysyllable_count": 6, "monosyllable_count": 47, "difficult_words": 8}
{"text": "The cat sat on the mat...", "flesch_reading_ease": 116.14, "automated_readability_index": -2.15, "syllable_count": 70, "lexicon_count": 84, "sentence_count": 14, "character_count": 348, "letter_count": 288, "polysyllable_count": 0, "monosyllable_count": 84, "difficult_words": 0}
{"text": "In contemporary discourse...", "flesch_reading_ease": -23.94, "automated_readability_index": 27.63, "syllable_count": 167, "lexicon_count": 53, "sentence_count": 4, "character_count": 497, "letter_count": 420, "polysyllable_count": 30, "monosyllable_count": 11, "difficult_words": 32}
```

### 📊 Result Analysis

**Sample 1 (Normal Descriptive Text):**
- Flesch Reading Ease: 72.53 (appropriate difficulty, suitable for general readers)
- Contains diverse vocabulary with 8 difficult words
- Readability level suitable for middle school students

**Sample 2 (Highly Repetitive Text):**
- Flesch Reading Ease: 116.14 (very easy to read)
- All words are monosyllabic with 0 difficult words
- But high repetition reduces text quality

**Sample 3 (Complex Academic Text):**
- Flesch Reading Ease: -23.94 (very difficult to read)
- Contains 32 difficult words and 30 polysyllabic words
- Automated Readability Index: 27.63 (requires professional-level education)
