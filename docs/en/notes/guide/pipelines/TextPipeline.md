---
title: Text Pipeline
icon: mdi:file-text
createTime: 2025/06/16 13:08:42  
permalink: /en/guide/textpipeline/  
---

# Text Pipeline

## 1. Overview

The text pipeline aims to process text information in various formats, including pretraining text and SFT formatted text. Based on functionality, it can be divided into four types:

1. **Pretraining Data Filtering Pipeline**: Perform deduplication, rewriting, and filtering operations on raw pretraining text to obtain high-quality pretraining text data.
2. **Phi-4 Style Pretraining Data Synthesis Pipeline**: Based on **Pipeline 1**, use QA dialogue format to paraphrase pretraining documents, synthesize dialogue-style pretraining data, and apply quality filtering to obtain high-quality phi-4-style pretraining data.
3. **SFT Data Filtering Pipeline**: Filter raw SFT-format data to obtain high-quality SFT data.
4. **SFT Data Synthesis Pipeline**: Based on original pretraining text input and **Pipeline 1**, use high-quality pretraining text to synthesize SFT-format data, then apply **Pipeline 3** quality filtering to obtain high-quality synthesized SFT data.

---

## 2. One-Click Execution
Create a working folder outside the `DataFlow` project path, for example `workspace`, and run `dataflow init` inside it. This operation will copy the pipeline and sample data into the working folder.

```bash
cd workspace
dataflow init
```

The full GPU pipeline can be run as follows:

Pipeline 1: **Pretraining Data Filtering**
```bash
cd gpu_pipelines
python text_pt_filter.py
```

Pipeline 2: **Phi-4 Style Pretraining Data Synthesis**
```bash
cd gpu_pipelines
python text_pt_synthetic.py
```

Pipeline 3: **SFT Data Filtering**
```bash
cd gpu_pipelines
python text_sft_filter.py
```

Pipeline 4: **SFT Data Synthesis**
```bash
cd gpu_pipelines
python text_sft_synthetic.py
```

Additionally, there are simplified CPU pipelines (no GPU environment required) and API pipelines (require API key) defined in parallel directories. Run them as follows:

```bash
cd cpu_pipelines
python text_pt_filter.py # Simplified pretraining data filtering pipeline using heuristic rules
python text_sft_filter.py # Simplified SFT data filtering pipeline using length filtering
```

```bash
cd api_pipelines
python text_sft_synthesis_pipeline.py # Synthesize SFT data from scratch
python text_conversation_synthesis_pipeline.py # Synthesize multi-turn dialogue from scratch
```

---

## 3. Data Format

### 3.1 Input Data

- **Supported Formats**: `json`, `jsonl`, `parquet`
- **Field Detection Settings**:  
  Set the fields in the `keys` parameter. For pretraining data, set to the field to be processed, such as `'raw_content'`. For SFT data, it is recommended to set to `['instruction', 'input', 'output']`.
- **Optional Fields**: Other fields will be ignored, but it is recommended to only keep necessary fields to avoid conflicts with subsequent processing.
- **Demo Datasets**:  
  - Pretraining data: `text_pipeline/data/pt_input.jsonl`  
  - SFT data: `text_pipeline/data/sft_input.jsonl`

These input data can be stored in specified files (such as ` json `, ` json `) and managed and read through the ` FileStorage ` object. In the example, the default data path will be loaded (`dataflow/example/GeneralTextPipeline`). In actual usage scenarios, the path can be modified according to requirements to load custom data and cache paths:

```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/GeneralTextPipeline/pt_input.jsonl",
    cache_path="./cache",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl",
)
```

### 3.2 Output Data

- **Format**: `jsonl` (each step will generate one file)
- **Field Description**:
  - Deduplication and filtering operators do not change field structure, only remove data.
  - Rewriting operators do not change field names, only modify data.
  - The result of the phi-4-style pretraining synthesis operator is added to the `generated_content` field.
  - The SFT synthesis operator result is saved in `instruction`, `output`, and `raw_content` fields, representing the instruction, output, and original document content respectively.

---

## 4. Process & Operators

### 4.1 Pretraining Data Filtering Pipeline

1. **LanguageFilter**  
   -  Keep only English text (or specified language)  
    ```python
   self.language_filter = LanguageFilter(allowed_languages = '__label__eng_Latn', model_cache_dir = self.model_cache_dir)
   ```

2. **RemoveExtraSpacesRefiner**  
   -  Remove extra spaces  
    ```python
   self.remove_extra_spaces_refiner = RemoveExtraSpacesRefiner()
   ```
3. **RemoveEmojiRefiner**  
   -  Remove emojis  
    ```python
   self.remove_emoji_refiner = RemoveEmojiRefiner()
   ```
4. **HtmlUrlRemoverRefiner**  
   -  Remove HTML tags, such as \<tag\>
    ```python
   self.html_remove_refiner = HtmlUrlRemoverRefiner()
   ```
5. **MinHashDeduplicator**  
   -  Deduplicate data based on MinHash algorithm  
    ```python
   self.minhash_deduplicator = MinHashDeduplicator(num_perm=128, threshold=0.9, use_n_gram=True, ngram=5)
   ```
6. **BlocklistFilter**  
   -  Filter text containing too many blocked words, blocklist refers to [List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words)    
   ```python
   self.blocklist_filter = BlocklistFilter()
   ```
7. **WordNumberFilter**  
   -  Filter by word count in [20, 100000] (adjustable)
   ```python
   self.word_number_filter = WordNumberFilter(min_words=20, max_words=100000)
   ```

8. **ColonEndFilter**  
   -  Filter text ending with a colon 
   ```python
   self.colon_end_filter = ColonEndFilter()
   ```
   
9. **SentenceNumberFilter**  
   -  Filter by abnormal sentence count, keep documents which sentence count in [3, 7500] (adjustable)
   ```python
   self.sentence_number_filter = SentenceNumberFilter(min_sentences=3, max_sentences=7500)
   ```
  
10. **LineEndWithEllipsisFilter**  
    -  Filter text with ellipsis ending sentence ratio greater than 0.3 (adjustable)
    ```python
    self.line_end_with_ellipsis_filter = LineEndWithEllipsisFilter(threshold=0.3)
    ```
11. **ContentNullFilter**  
    -  Filter empty text  
    ```python
    self.content_null_filter = ContentNullFilter()
    ```
 
12. **MeanWordLengthFilter**  
    -  Filter by average word length in [3, 10] (adjustable)
    ```python
    self.mean_word_length_filter = MeanWordLengthFilter(min_length=3, max_length=10)
    ```
13. **SymbolWordRatioFilter**  
    -  Filter text with symbol(such as #)-to-word ratio > 0.4
    ```python
    self.symbol_word_ratio_filter = SymbolWordRatioFilter(threshold=0.4)
    ```
14. **HtmlEntityFilter**  
    -  Filter text with excessive HTML entities, such as nbsp, lt, gt... 
    ```python
    self.html_entity_filter = HtmlEntityFilter()
    ```
 
15. **IDCardFilter**  
    -  Privacy protection. Filter text containing ID card information, such as "身份证"，"ID NO.".
    ```python
    self.id_card_filter = IDCardFilter(threshold=3)
    ```

16. **NoPuncFilter**  
    -  Filter text without punctuation  
    ```python
    self.no_punc_filter = NoPuncFilter(threshold=112)
    ```
17. **SpecialCharacterFilter**  
    -  Filter text with any special characters (such as r"u200e")
    ```python
    self.special_character_filter = SpecialCharacterFilter()
    ```
18. **WatermarkFilter**  
    -  Filter text containing watermarks, such as“Watermark”, 
     ```python
    self.watermark_filter = WatermarkFilter(watermarks=['Copyright', 'Watermark', 'Confidential'])
    ```
19. **CurlyBracketFilter**  
    -  Filter text with curly bracket ratio greater than 0.025. (adjustable)
    ```python
    self.curly_bracket_filter = CurlyBracketFilter(threshold=0.025)
    ```
20. **CapitalWordsFilter**  
    -  Filter text with uppercase letter ratio greater than 0.2. (adjustable)
    ```python
    self.capital_words_filter = CapitalWordsFilter(threshold=0.2, use_tokenizer=False)
    ```
21. **LoremIpsumFilter**  
    -  Filter text containing "lorem ipsum". The text. Lorem Ipsum is a random pseudotext commonly used in typesetting design.
    ```python
    self.lorem_ipsum_filter = LoremIpsumFilter(threshold=3e-8)
    ```
22. **UniqueWordsFilter**  
    -  Filter text with unique words ratio < 0.1 (adjustable)
    ```python
    self.unique_words_filter = UniqueWordsFilter(threshold=0.1)
    ```
23. **CharNumberFilter**  
    -  Filter text with characters less than 100 (adjustable)
    ```python
    self.char_number_filter = CharNumberFilter(threshold=100)
    ```
24. **LineStartWithBulletpointFilter**  
    -  Filter text starting with bullet points ratio greater than 0.9 (adjustable) 
    ```python
    self.line_start_with_bulletpoint_filter = LineStartWithBulletpointFilter(threshold=0.9)
    ```
25. **LineWithJavascriptFilter**  
    -  Filter text containing JavaScript numbers > 3 (adjustable)
    ```python
    self.line_with_javascript_filter = LineWithJavascriptFilter(threshold=3)
    ```
26. **PairQualFilter**  
    -  Score text quality with a quality scorer, which is based on the bge model and supports both Chinese and English. It is trained using GPT to compare and score texts in pairs. [Model](https://huggingface.co/zks2856/PairQual-Scorer-en)
    ```python
    self.quality_filter = PairQualFilter(min_score=0, max_score=10000, lang='en')
    ```

### 4.2 Phi-4 Style Pretraining Data Synthesis Pipeline

Based on **Pipeline 1**, add the following operators:

1. **PretrainGenerator**  
   - Use llm to synthesize phi-4-style QA pair data from seed documents  
   - Prompt can be found in 'dataflow/prompts/generat_text.py', which can be modified
```python
self.llm_serving = LocalModelLLMServing(
            model_name_or_path='Qwen/Qwen2.5-7B-Instruct',
            tensor_parallel_size=1,
            max_tokens=8192,
            model_source="local"
        )
self.pt_generator = PretrainGenerator(
            llm_serving=self.llm_serving
        )
```
2. **QuratingFilter**  
   -  Score and filter synthesized text across writing_style, required_expertise, facts_and_trivia, educational_value dimensions. [Model](https://github.com/princeton-nlp/QuRating)
```python
self.qurating_filter = QuratingFilter(min_scores = {'writing_style': 0,'required_expertise': 0,'facts_and_trivia': 0,'educational_value': 0}, max_scores = {'writing_style': 9,'required_expertise': 9,'facts_and_trivia': 9,'educational_value': 9})
```

### 4.3 SFT Data Filtering Pipeline

1. **WordNumberFilter**  
   -  Filter by output length, keep between 20–1000 words (adjustable)
```python
self.word_number_filter_step1 = WordNumberFilter(
            min_words=20,
            max_words=1000
        )
```
2. **SuperfilteringFilter**  
   -  Filter by instruction IFD score. [Model](https://github.com/tianyi-lab/Superfiltering)
```python
self.super_filtering_filter_step2 = SuperfilteringFilter(
            min_score=0.5,
            max_score=1.0,
            model_cache_dir=self.model_cache_dir
        )
```
3. **DeitaQualityFilter**  
   -  Filter by instruction quality score. [Model](https://huggingface.co/hkust-nlp/deita-quality-scorer)
```python
self.deita_quality_filter_step3 = DeitaQualityFilter(
            min_score=2.5,
            max_score=10000,
            max_length=512,
            model_cache_dir=self.model_cache_dir
        )
```

### 4.4 SFT Data Synthesis Pipeline

Based on **Pipeline 1** and **Pipeline 3**, add the following operator:

1. **SFTGeneratorSeed**  
   - Use llm to synthesize SFT-format data from seed documents  
   - Prompt can be found in 'dataflow/prompts/generat_text.py', which can be modified
```python
self.llm_serving = LocalModelLLMServing(
            model_name_or_path='Qwen/Qwen2.5-7B-Instruct',
            tensor_parallel_size=1,
            max_tokens=8192,
            model_source="local"
        )
self.sft_generator = SFTGeneratorSeed(
            llm_serving=self.llm_serving
        )
```

## 5. Pipeline Example

The following provides an example pipeline demonstrating how to use multiple operators for text processing. This example shows how to initialize a text processing pipeline and sequentially execute various filtering and cleaning steps.


```python
class TextPipeline():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="../example_data/GeneralTextPipeline/pt_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        self.model_cache_dir = './dataflow_cache'
        self.remove_extra_spaces_refiner = RemoveExtraSpacesRefiner()
        self.remove_emoji_refiner = RemoveEmojiRefiner()
        self.html_remove_refiner = HtmlUrlRemoverRefiner()
        self.minhash_deduplicator = MinHashDeduplicator(num_perm=128, threshold=0.9, use_n_gram=True, ngram=5)
        self.blocklist_filter = BlocklistFilter()
        self.word_number_filter = WordNumberFilter(min_words=20, max_words=100000)
        self.colon_end_filter = ColonEndFilter()
        self.sentence_number_filter = SentenceNumberFilter(min_sentences=3, max_sentences=7500)

    def forward(self):
        self.remove_extra_spaces_refiner.run(
            storage=self.storage.step(),
            input_key="raw_content"
        )
        self.remove_emoji_refiner.run(
            storage=self.storage.step(),
            input_key="raw_content"
        )
        self.html_remove_refiner.run(
            storage=self.storage.step(),
            input_key="raw_content"
        )
        self.minhash_deduplicator.run(
            storage=self.storage.step(),
            input_key="raw_content"
        )
        self.blocklist_filter.run(
            storage=self.storage.step(),
            input_key="raw_content"
        )
        self.word_number_filter.run(
            storage=self.storage.step(),
            input_key="raw_content"
        )
        self.colon_end_filter.run(
            storage=self.storage.step(),
            input_key="raw_content"
        )
        self.sentence_number_filter.run(
            storage=self.storage.step(),
            input_key="raw_content"
        )

model = TextPipeline()
model.forward()

```
