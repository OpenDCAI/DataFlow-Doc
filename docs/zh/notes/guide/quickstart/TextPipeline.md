---
title: 纯文本流水线
icon: mdi:file-text
createTime: 2025/06/16 13:08:42  
permalink: /zh/guide/textpipeline/  
---

# 纯文本流水线

## 1. 概述

纯文本流水线旨在处理不同格式的文本信息，包括预训练文本和指令微调格式文本。根据功能，可以划分为四个类型：

1. 预训练数据过滤流水线：对原始预训练文本进行去重、改写和过滤操作，得到高质量预训练文本数据。

2. 预训练类phi-4数据合成流水线：在**流水线1**基础上，使用QA对话形式复述预训练文档，合成对话形式预训练数据，并对合成后的数据进行质量过滤，得到高质量的类phi-4格式预训练数据。

3. SFT数据过滤流水线：对原始SFT格式数据进行质量过滤，得到高质量SFT数据。

4. SFT数据合成流水线：根据原始预训练文本输入，在**流水线1**基础上，使用高质量预训练文本合成SFT格式数据，并对合成后的数据进行**流水线3**质量过滤，得到合成后的高质量SFT数据。

---

## 2. 一键运行

流水线1: **预训练数据过滤**
```bash
bash text_pipeline/run_pt_filter_new.sh
```
流水线2: **预训练类phi-4数据合成**
```bash
bash text_pipeline/run_pt_synthetic_new.sh
```

流水线3: **SFT数据过滤**
```bash
bash text_pipeline/run_sft_filter_new.sh
```
流水线4: **SFT数据合成**
```bash
bash text_pipeline/run_sft_synthetic_new.sh
```

> 这四个脚本会调用对应的 YAML 配置，依次执行各算子，并在指定的目录下生成各阶段中间文件。

---

## 3. 数据格式

### 3.1 输入数据

- **支持格式**：`json`、`jsonl`、`parquet`
- **字段检测设置**：  
  在`keys`参数中设置字段，预训练数据设置为待处理的字段，如`'raw_content'`，SFT数据建议设置为`'[instruction, input, output]'`
- **可选字段**：其它字段会被忽略，但建议只保留必要字段，避免与后续处理冲突。  
- **演示数据集**：  
  - 预训练数据`text_pipeline/data/pt_input.jsonl`  
  - SFT数据`text_pipeline/data/sft_input.jsonl`

### 3.2 输出数据

- **格式**：`jsonl`（每个步骤都会生成一个文件）  
- **字段说明**：
  - 去重、过滤算子不改变字段格式，仅删除数据
  - 改写算子不改变字段格式，仅改写数据
  - 类phi-4预训练数据合成算子结果添加在`generated_content`字段中
  - SFT数据合成算子结果保存为`instruction, output, raw_content`字段，分别表示指令、输出和原文档内容。
---

## 4. 流程与算子

### 4.1 预训练数据过滤流水线

1. **语言过滤 (LanguageFilter)**  
   - 功能：仅保留英文文本（或指定特定语言）  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/LanguageFilter.yaml \
       --step_name LanguageFilter \
       --step_type process
     ```

2. **删除多余空格 (RemoveExtraSpacesRefiner)**  
   - 功能：删除多余空格  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/RemoveExtraSpacesRefiner.yaml \
       --step_name RemoveExtraSpacesRefiner \
       --step_type process
     ```

3. **删除表情符号 (RemoveEmojiRefiner)**  
   - 功能：删除表情符号  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/RemoveEmojiRefiner.yaml \
       --step_name RemoveEmojiRefiner \
       --step_type process
     ```

4. **删除 HTML 标签 (HtmlUrlRemoverRefiner)**  
   - 功能：删除 HTML 标签  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/HtmlUrlRemoverRefiner.yaml \
       --step_name HtmlUrlRemoverRefiner \
       --step_type process
     ```

5. **MinHash 数据去重 (MinHashDeduplicator)**  
   - 功能：基于 MinHash 算法进行数据去重  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/MinHashDeduplicator.yaml \
       --step_name MinHashDeduplicator \
       --step_type process
     ```

6. **敏感词过滤 (BlocklistFilter)**  
   - 功能：过滤含屏蔽词较多的文本  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/BlocklistFilter.yaml \
       --step_name BlocklistFilter \
       --step_type process
     ```

7. **单词数量过滤 (WordNumberFilter)**  
   - 功能：文本单词数量过滤  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/WordNumberFilter.yaml \
       --step_name WordNumberFilter \
       --step_type process
     ```

8. **冒号结尾过滤 (ColonEndFilter)**  
   - 功能：过滤冒号结尾文本  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/ColonEndFilter.yaml \
       --step_name ColonEndFilter \
       --step_type process
     ```

9. **语句数量过滤 (SentenceNumberFilter)**  
   - 功能：过滤语句数量异常的文本  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/SentenceNumberFilter.yaml \
       --step_name SentenceNumberFilter \
       --step_type process
     ```

10. **省略号结尾过滤 (LineEndWithEllipsisFilter)**  
    - 功能：按比例过滤以省略号结尾的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/LineEndWithEllipsisFilter.yaml \
        --step_name LineEndWithEllipsisFilter \
        --step_type process
      ```

11. **空文本过滤 (ContentNullFilter)**  
    - 功能：过滤空文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/ContentNullFilter.yaml \
        --step_name ContentNullFilter \
        --step_type process
      ```

12. **平均单词长度过滤 (MeanWordLengthFilter)**  
    - 功能：文本平均单词长度过滤  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/MeanWordLengthFilter.yaml \
        --step_name MeanWordLengthFilter \
        --step_type process
      ```

13. **符号/单词比例过滤 (SymbolWordRatioFilter)**  
    - 功能：过滤符号/单词比例过大的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/SymbolWordRatioFilter.yaml \
        --step_name SymbolWordRatioFilter \
        --step_type process
      ```

14. **HTML 标签过滤 (HtmlEntityFilter)**  
    - 功能：过滤 HTML 标签多的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/HtmlEntityFilter.yaml \
        --step_name HtmlEntityFilter \
        --step_type process
      ```

15. **ID Card 过滤 (IDCardFilter)**  
    - 功能：过滤含 ID Card 的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/IDCardFilter.yaml \
        --step_name IDCardFilter \
        --step_type process
      ```

16. **无标点符号过滤 (NoPuncFilter)**  
    - 功能：过滤无标点符号的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/NoPuncFilter.yaml \
        --step_name NoPuncFilter \
        --step_type process
      ```

17. **特殊符号过滤 (SpecialCharacterFilter)**  
    - 功能：过滤特殊符号多的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/SpecialCharacterFilter.yaml \
        --step_name SpecialCharacterFilter \
        --step_type process
      ```

18. **水印过滤 (WatermarkFilter)**  
    - 功能：过滤含水印的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/WatermarkFilter.yaml \
        --step_name WatermarkFilter \
        --step_type process
      ```

19. **停用词过滤 (StopWordFilter)**  
    - 功能：过滤停用词比例少的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/StopWordFilter.yaml \
        --step_name StopWordFilter \
        --step_type process
      ```

20. **括号比例过滤 (CurlyBracketFilter)**  
    - 功能：过滤括号比例高的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/CurlyBracketFilter.yaml \
        --step_name CurlyBracketFilter \
        --step_type process
      ```

21. **大写字母比例过滤 (CapitalWordsFilter)**  
    - 功能：过滤大写字母比例高的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/CapitalWordsFilter.yaml \
        --step_name CapitalWordsFilter \
        --step_type process
      ```

22. **Lorem Ipsum 过滤 (LoremIpsumFilter)**  
    - 功能：过滤含 lorem ipsum 的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/LoremIpsumFilter.yaml \
        --step_name LoremIpsumFilter \
        --step_type process
      ```

23. **Unique 单词过滤 (UniqueWordsFilter)**  
    - 功能：过滤 unique 单词少的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/UniqueWordsFilter.yaml \
        --step_name UniqueWordsFilter \
        --step_type process
      ```

24. **字符数量过滤 (CharNumberFilter)**  
    - 功能：过滤字符数少的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/CharNumberFilter.yaml \
        --step_name CharNumberFilter \
        --step_type process
      ```

25. **项目符号开头过滤 (LineStartWithBulletpointFilter)**  
    - 功能：过滤以项目符号开头多的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/LineStartWithBulletpointFilter.yaml \
        --step_name LineStartWithBulletpointFilter \
        --step_type process
      ```

26. **含 Javascript 过滤 (LineWithJavascriptFilter)**  
    - 功能：过滤含 Javascript 多的文本  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/LineWithJavascriptFilter.yaml \
        --step_name LineWithJavascriptFilter \
        --step_type process
      ```

27. **文本质量打分器 (PairQualFilter)**  
    - 功能：使用质量打分器进行文本质量打分  
    - 命令：
      ```bash
      python pipeline_step.py \
        --yaml_path text_pipeline/yaml/PairQualFilter.yaml \
        --step_name PairQualFilter \
        --step_type process
      ```

---

### 4.2 预训练类phi-4数据合成流水线

在**流水线1**的基础上，添加如下算子：

1. **预训练数据合成 (PretrainGenerator)**  
- 功能：使用Qwen2.5-7b根据种子文档合成类 Phi-4 风格QA问答对数据
- 命令：
  ```bash
  python pipeline_step.py \
    --yaml_path text_pipeline/yaml/PretrainGenerator.yaml \
    --step_name PretrainGenerator \
    --step_type generator
  ```

2. **Qurating质量打分过滤 (QuratingFilter)**
- 功能：从 writing_style、required_expertise、facts_and_trivia、educational_value 四个维度打分并过滤合成后的文本
- 命令：
  ```bash
  python pipeline_step.py \
    --yaml_path text_pipeline/yaml/QuratingFilter.yaml \
    --step_name QuratingFilter \
    --step_type process
  ```

### 4.3 SFT数据过滤流水线

1. **输出长度过滤 (WordNumberFilter)**  
   - 功能：按照 output 长度过滤数据，保留长度为20-1000之间
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/WordNumberFilter.yaml \
       --step_name WordNumberFilter \
       --step_type process
     ```

2. **指令 IFD 分数过滤 (SuperfilteringFilter)**  
   - 功能：按照指令 IFD 分数过滤数据  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/SuperfilteringFilter.yaml \
       --step_name SuperfilteringFilter \
       --step_type process
     ```

3. **指令质量得分过滤 (DeitaQualityFilter)**  
   - 功能：按照指令质量得分过滤数据  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/DeitaQualityFilter.yaml \
       --step_name DeitaQualityFilter \
       --step_type process
     ```

4. **Instruction 标签数过滤 (InstagFilter)**  
   - 功能：按照 instruction 标签数过滤数据  
   - 命令：
     ```bash
     python pipeline_step.py \
       --yaml_path text_pipeline/yaml/InstagFilter.yaml \
       --step_name InstagFilter \
       --step_type process
     ```

### 4.4 SFT数据合成流水线

在**流水线1**和**流水线3**的基础上添加如下算子：

1. **SFT数据合成 (SupervisedFinetuneGenerator)**  
- 功能：使用Qwen2.5-7b根据种子文档合成SFT格式数据
- 命令：
  ```bash
  python pipeline_step.py \
    --yaml_path text_pipeline/yaml/SupervisedFinetuneGenerator.yaml \
    --step_name SupervisedFinetuneGenerator \
    --step_type generator
  ```
