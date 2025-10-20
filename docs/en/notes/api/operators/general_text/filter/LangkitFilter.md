---
title: LangkitFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/langkitfilter/
---

## 📘 Overview
`LangkitFilter` is an operator for data filtering based on text quality metrics. It uses the Langkit toolkit to calculate various readability and complexity scores for text, filtering out data that meets user-defined thresholds.

## `__init__` Function
```python
def __init__(self, 
             min_scores = {
                "flesch_reading_ease": 0,
                "automated_readability_index": 0,
                "aggregate_reading_level": 0,
                "syllable_count": 32.0,
                "lexicon_count": 23.0,
                "sentence_count": 1.0,
                "character_count": 118.0,
                "letter_count": 109.0,
                "polysyllable_count": 0.0,
                "monosyllable_count": 13.0,
                "difficult_words": 4.0,
            },
            max_scores = {
                "flesch_reading_ease": 100,
                "automated_readability_index": 100,
                "aggregate_reading_level": 100,
                "syllable_count": 2331.9,
                "lexicon_count": 1554.0,
                "sentence_count": 89.1,
                "character_count": 7466.3,
                "letter_count": 7193.0,
                "polysyllable_count": 216.4,
                "monosyllable_count": 1044.1,
                "difficult_words": 213.4,
            },
            metrics_to_keep: list = [
                "flesch_reading_ease",
                "automated_readability_index",
                "aggregate_reading_level",
                "syllable_count",
                "lexicon_count",
                "sentence_count",
                "character_count",
                "letter_count",
                "polysyllable_count",
                "monosyllable_count",
                "difficult_words",
             ]):
```
### Init Parameters
| Parameter            | Type | Default       | Description                           |
| :------------------ | :--- | :----------- | :----------------------------- |
| **min_scores**      | dict | See code       | Minimum threshold for each text quality metric score. |
| **max_scores**      | dict | See code       | Maximum threshold for each text quality metric score. |
| **metrics_to_keep** | list | See code       | List of evaluation metrics to retain and use for filtering. |

## `run` Function
```python
def run(self, storage: DataFlowStorage, input_key: str, output_keys: list = ["flesch_reading_ease", "automated_readability_index", ...]):
```
#### Parameters
| Name          | Type              | Default | Description                                     |
| :------------ | :---------------- | :----- | :--------------------------------------- |
| **storage**   | DataFlowStorage   | Required   | DataFlow storage instance for reading and writing data.     |
| **input_key** | str               | Required   | Input column name corresponding to the text field to evaluate and filter. |
| **output_keys**| list              | See code | List of output metric names specifying which metrics to calculate and filter. |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import LangkitFilter
from dataflow.utils.storage import FileStorage

class LangkitFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/langkit_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        # Use custom thresholds for filtering
        self.filter = LangkitFilter(
            min_scores={
                "flesch_reading_ease": 0,
                "automated_readability_index": 0,
                "aggregate_reading_level": 0,
                "syllable_count": 10.0,
                "lexicon_count": 10.0,
                "sentence_count": 1.0,
                "character_count": 50.0,
                "letter_count": 40.0,
                "polysyllable_count": 0.0,
                "monosyllable_count": 5.0,
                "difficult_words": 0.0,
            },
            max_scores={
                "flesch_reading_ease": 100,
                "automated_readability_index": 50,
                "aggregate_reading_level": 50,
                "syllable_count": 500.0,
                "lexicon_count": 300.0,
                "sentence_count": 20.0,
                "character_count": 2000.0,
                "letter_count": 1800.0,
                "polysyllable_count": 100.0,
                "monosyllable_count": 200.0,
                "difficult_words": 50.0,
            }
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_keys=[
                "flesch_reading_ease",
                "automated_readability_index",
                "aggregate_reading_level",
                "syllable_count",
                "lexicon_count",
                "sentence_count",
                "character_count",
                "letter_count",
                "polysyllable_count",
                "monosyllable_count",
                "difficult_words",
            ]
        )

if __name__ == "__main__":
    test = LangkitFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

The operator adds two columns for each metric: one for the score (with `Score` suffix) and one for the label (`Score_label` suffix, 1 for pass, 0 for fail). Finally, only text rows where all metrics pass are retained.

| Field | Type | Description |
| :--- | :---- | :---------- |
| text | str | Original input text |
| LangkitFleschReadingEaseScore | float | Flesch readability score (0-100, higher is easier) |
| LangkitAutomatedReadabilityIndexScore | float | Automated Readability Index |
| LangkitAggregateReadingLevelScore | float | Aggregate reading level |
| LangkitSyllableCountScore | float | Total syllable count |
| LangkitLexiconCountScore | float | Lexicon count |
| LangkitSentenceCountScore | float | Sentence count |
| LangkitCharacterCountScore | float | Total character count |
| LangkitLetterCountScore | float | Total letter count |
| LangkitPolysyllableCountScore | float | Polysyllable word count |
| LangkitMonosyllableCountScore | float | Monosyllable word count |
| LangkitDifficultWordsScore | float | Difficult word count |
| *_label | int | Filter label for each metric (1 for pass, 0 for fail) |

### 📋 Example Input

```json
{"text": "The quick brown fox jumps over the lazy dog. This is a simple sentence for testing."}
{"text": "A"}
{"text": "In the field of natural language processing, various algorithms and methodologies have been developed to analyze, understand, and generate human language in a computationally efficient manner. These sophisticated techniques enable computers to perform complex linguistic tasks such as machine translation, sentiment analysis, named entity recognition, and text summarization with remarkable accuracy and efficiency."}
```

### 📤 Example Output

```json
{"text": "The quick brown fox jumps over the lazy dog. This is a simple sentence for testing.", "LangkitFleschReadingEaseScore": 88.74, "LangkitAutomatedReadabilityIndexScore": 2.6, "LangkitAggregateReadingLevelScore": 3.0, "LangkitSyllableCountScore": 20, "LangkitLexiconCountScore": 16, "LangkitSentenceCountScore": 2, "LangkitCharacterCountScore": 68, "LangkitLetterCountScore": 66, "LangkitPolysyllableCountScore": 0, "LangkitMonosyllableCountScore": 12, "LangkitDifficultWordsScore": 0, "LangkitFleschReadingEaseScore_label": 1, "LangkitAutomatedReadabilityIndexScore_label": 1, "LangkitAggregateReadingLevelScore_label": 1, "LangkitSyllableCountScore_label": 1, "LangkitLexiconCountScore_label": 1, "LangkitSentenceCountScore_label": 1, "LangkitCharacterCountScore_label": 1, "LangkitLetterCountScore_label": 1, "LangkitPolysyllableCountScore_label": 1, "LangkitMonosyllableCountScore_label": 1, "LangkitDifficultWordsScore_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Simple English text)**:
- Text: Standard test sentence
- Flesch reading ease score: 88.74 (very easy to read)
- Automated readability index: 2.6 (early elementary school level)
- Syllables: 20, Lexicon: 16, Sentences: 2
- Characters: 68, Letters: 66
- Monosyllable words: 12, Polysyllable words: 0
- Difficult words: 0
- **Passes filter** (all metrics within set ranges)

**Sample 2 (Very short text "A")**:
- Flesch reading ease score: 121.22 (extremely high readability)
- Automated readability index: -16.3 (abnormal value)
- Syllables: 1 (< minimum 10)
- Lexicon: 1 (< minimum 10)
- Characters: 1 (< minimum 50)
- Letters: 1 (< minimum 40)
- Monosyllable words: 1 (< minimum 5)
- **Filtered out** (multiple metrics below minimum thresholds)

**Sample 3 (Complex academic text)**:
- Text: Long paragraph of academic NLP description
- Flesch reading ease score: -14.65 (extremely difficult, < minimum 0)
- Automated readability index: 24.1 (college and above level)
- Aggregate reading level: 22.0 (graduate level)
- Syllables: 123, Lexicon: 53, Sentences: 2
- Characters: 363, Letters: 355
- Polysyllable words: 24, Monosyllable words: 21
- Difficult words: 28
- **Filtered out** (readability score is negative, below minimum threshold)

### 📈 Metric Descriptions

1. **Flesch Reading Ease (readability score)**:
   - Range: Usually 0-100, higher scores mean easier reading
   - 90-100: Elementary school level
   - 60-70: Middle school level
   - 0-30: College and above level
   - Negative values: Extremely complex text

2. **Automated Readability Index**:
   - Based on character count, word count, and sentence count
   - Value roughly corresponds to required education grade

3. **Syllable and lexicon statistics**:
   - syllable_count: Total syllable count
   - lexicon_count: Lexicon count (before deduplication)
   - monosyllable_count: Monosyllable word count
   - polysyllable_count: Polysyllable (≥3 syllables) word count

4. **Difficult Words**:
   - Count of words not in common word lists

**Use Cases**:
- Filter training text of appropriate complexity
- Filter content that is too simple or too complex
- Ensure text quality meets specific education levels
- Build datasets suitable for specific user groups
- Remove low-quality text with statistical anomalies

**Notes**:
- Thresholds need to be adjusted based on specific application scenarios
- Academic or technical text may require more lenient complexity thresholds
- Very short text may produce statistical anomalies
- Recommended to perform statistical analysis on sample data before setting reasonable threshold ranges
