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

Pipeline 1: **Pretraining Data Filtering**
```bash
bash text_pipeline/run_pt_filter_new.sh
```
Pipeline 2: **Phi-4 Style Pretraining Data Synthesis**
```bash
bash text_pipeline/run_pt_synthetic_new.sh
```
Pipeline 3: **SFT Data Filtering**
```bash
bash text_pipeline/run_sft_filter_new.sh
```
Pipeline 4: **SFT Data Synthesis**
```bash
bash text_pipeline/run_sft_synthetic_new.sh
```

> These four scripts will call the corresponding YAML configurations, execute each operator in sequence, and generate intermediate files for each stage in the specified directories.

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
   - Function: Keep only English text (or specified language)  
   - Command:
      ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/LanguageFilter.yaml \
       --step_name LanguageFilter \
       --step_type process
     ```
2. **RemoveExtraSpacesRefiner**  
   - Function: Remove extra spaces  
   - Command:
      ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/RemoveExtraSpacesRefiner.yaml \
       --step_name RemoveExtraSpacesRefiner \
       --step_type process
     ```
3. **RemoveEmojiRefiner**  
   - Function: Remove emojis  
   - Command:
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/RemoveEmojiRefiner.yaml \
       --step_name RemoveEmojiRefiner \
       --step_type process
     ```
4. **HtmlUrlRemoverRefiner**  
   - Function: Remove HTML tags  
   - Command:
    ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/HtmlUrlRemoverRefiner.yaml \
       --step_name HtmlUrlRemoverRefiner \
       --step_type process
     ```
5. **MinHashDeduplicator**  
   - Function: Deduplicate data based on MinHash algorithm  
   - Command:
      ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/MinHashDeduplicator.yaml \
       --step_name MinHashDeduplicator \
       --step_type process
     ```
6. **BlocklistFilter**  
   - Function: Filter text containing too many blocked words  
   - Command:
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/BlocklistFilter.yaml \
       --step_name BlocklistFilter \
       --step_type process
     ```
7. **WordNumberFilter**  
   - Function: Filter by word count  
   - Command:
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/WordNumberFilter.yaml \
       --step_name WordNumberFilter \
       --step_type process
     ```
8. **ColonEndFilter**  
   - Function: Filter text ending with a colon  
   - Command:
      ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/ColonEndFilter.yaml \
       --step_name ColonEndFilter \
       --step_type process
     ```
9. **SentenceNumberFilter**  
   - Function: Filter by abnormal sentence count  
   - Command:
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/SentenceNumberFilter.yaml \
       --step_name SentenceNumberFilter \
       --step_type process
     ```
10. **LineEndWithEllipsisFilter**  
    - Function: Proportionally filter text ending with ellipsis  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/LineEndWithEllipsisFilter.yaml \
        --step_name LineEndWithEllipsisFilter \
        --step_type process
      ```
11. **ContentNullFilter**  
    - Function: Filter empty text  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/ContentNullFilter.yaml \
        --step_name ContentNullFilter \
        --step_type process
      ```
12. **MeanWordLengthFilter**  
    - Function: Filter by average word length  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/MeanWordLengthFilter.yaml \
        --step_name MeanWordLengthFilter \
        --step_type process
      ```
13. **SymbolWordRatioFilter**  
    - Function: Filter text with high symbol-to-word ratio  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/SymbolWordRatioFilter.yaml \
        --step_name SymbolWordRatioFilter \
        --step_type process
      ```
14. **HtmlEntityFilter**  
    - Function: Filter text with excessive HTML entities  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/HtmlEntityFilter.yaml \
        --step_name HtmlEntityFilter \
        --step_type process
      ```
15. **IDCardFilter**  
    - Function: Filter text containing ID card information  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/IDCardFilter.yaml \
        --step_name IDCardFilter \
        --step_type process
      ```
16. **NoPuncFilter**  
    - Function: Filter text without punctuation  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/NoPuncFilter.yaml \
        --step_name NoPuncFilter \
        --step_type process
      ```
17. **SpecialCharacterFilter**  
    - Function: Filter text with many special characters  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/SpecialCharacterFilter.yaml \
        --step_name SpecialCharacterFilter \
        --step_type process
      ```
18. **WatermarkFilter**  
    - Function: Filter text containing watermarks  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/WatermarkFilter.yaml \
        --step_name WatermarkFilter \
        --step_type process
      ```
19. **StopWordFilter**  
    - Function: Filter text with low stopword ratio  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/StopWordFilter.yaml \
        --step_name StopWordFilter \
        --step_type process
      ```
20. **CurlyBracketFilter**  
    - Function: Filter text with high curly bracket ratio  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/CurlyBracketFilter.yaml \
        --step_name CurlyBracketFilter \
        --step_type process
      ```
21. **CapitalWordsFilter**  
    - Function: Filter text with high uppercase letter ratio  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/CapitalWordsFilter.yaml \
        --step_name CapitalWordsFilter \
        --step_type process
      ```
22. **LoremIpsumFilter**  
    - Function: Filter text containing "lorem ipsum"  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/LoremIpsumFilter.yaml \
        --step_name LoremIpsumFilter \
        --step_type process
      ```
23. **UniqueWordsFilter**  
    - Function: Filter text with few unique words  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/UniqueWordsFilter.yaml \
        --step_name UniqueWordsFilter \
        --step_type process
      ```
24. **CharNumberFilter**  
    - Function: Filter text with few characters  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/CharNumberFilter.yaml \
        --step_name CharNumberFilter \
        --step_type process
      ```
25. **LineStartWithBulletpointFilter**  
    - Function: Filter text starting with bullet points  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/LineStartWithBulletpointFilter.yaml \
        --step_name LineStartWithBulletpointFilter \
        --step_type process
      ```
26. **LineWithJavascriptFilter**  
    - Function: Filter text containing JavaScript  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/LineWithJavascriptFilter.yaml \
        --step_name LineWithJavascriptFilter \
        --step_type process
      ```
27. **PairQualFilter**  
    - Function: Score text quality with a quality scorer  
    - Command:
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/PairQualFilter.yaml \
        --step_name PairQualFilter \
        --step_type process
      ```

### 4.2 Phi-4 Style Pretraining Data Synthesis Pipeline

Based on **Pipeline 1**, add the following operators:

1. **PretrainGenerator**  
   - Function: Use Qwen2.5-7b to synthesize phi-4-style QA pair data from seed documents  
   - Command:
    ```bash
    python pipeline_step.py \
      --yaml_path text_pipeline/yaml/PretrainGenerator.yaml \
      --step_name PretrainGenerator \
      --step_type generator
    ```
2. **QuratingFilter**  
   - Function: Score and filter synthesized text across writing_style, required_expertise, facts_and_trivia, educational_value dimensions  
   - Command:
    ```bash
    python pipeline_step.py \
      --yaml_path text_pipeline/yaml/QuratingFilter.yaml \
      --step_name QuratingFilter \
      --step_type process
    ```

### 4.3 SFT Data Filtering Pipeline

1. **WordNumberFilter**  
   - Function: Filter by output length, keep between 20–1000 words  
   - Command:
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/WordNumberFilter.yaml \
       --step_name WordNumberFilter \
       --step_type process
     ```
2. **SuperfilteringFilter**  
   - Function: Filter by instruction IFD score  
   - Command:
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/SuperfilteringFilter.yaml \
       --step_name SuperfilteringFilter \
       --step_type process
     ```
3. **DeitaQualityFilter**  
   - Function: Filter by instruction quality score  
   - Command:
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/DeitaQualityFilter.yaml \
       --step_name DeitaQualityFilter \
       --step_type process
     ```
4. **InstagFilter**  
   - Function: Filter by number of instruction tags  
   - Command:
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/InstagFilter.yaml \
       --step_name InstagFilter \
       --step_type process
     ```

### 4.4 SFT Data Synthesis Pipeline

Based on **Pipeline 1** and **Pipeline 3**, add the following operator:

1. **SupervisedFinetuneGenerator**  
   - Function: Use Qwen2.5-7b to synthesize SFT-format data from seed documents  
   - Command:
    ```bash
    python pipeline_step.py \
      --yaml_path text_pipeline/yaml/SupervisedFinetuneGenerator.yaml \
      --step_name SupervisedFinetuneGenerator \
      --step_type generator
    ```
