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

在`DataFlow`项目路径之外新建工作文件夹，例如`workspace`，并在其中运行`dataflow init`。该操作会将流水线及示例数据复制到工作文件夹中。

```bash
cd workspace
dataflow init
```

完整gpu流水线运行方式如下

流水线1: **预训练数据过滤**
```bash
cd gpu_pipelines
python text_pt_filter.py
```
流水线2: **预训练类phi-4数据合成**
```bash
cd gpu_pipelines
python text_pt_synthetic.py
```

流水线3: **SFT数据过滤**
```bash
cd gpu_pipelines
python text_sft_filter.py
```
流水线4: **SFT数据合成**
```bash
cd gpu_pipelines
python text_sft_synthetic.py
```

此外，在同级路径下分别定义了简易版纯cpu流水线（不用显卡环境）和api流水线（需要用到api_key），运行方式如下：

```bash
cd cpu_pipelines
python text_pt_filter.py # 简易版预训练数据过滤流水线，启发式过滤
python text_sft_filter.py # 简易版sft数据过滤流水线，长度过滤
```

```bash
cd api_pipelines
python text_sft_synthesis_pipeline.py # 从0开始合成SFT数据
python text_conversation_synthesis_pipeline.py # 从0开始合成多轮对话数据
```

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

这些输入数据可以存储在指定的文件（如`json`、`jsonl`）中，并通过`FileStorage`对象进行管理和读取。示例中会载入默认的数据路径（`dataflow/example/GeneralTextPipeline`），实际使用场景下可以根据需求修改路径以载入自定义的数据和缓存路径：

```python
self.storage = FileStorage(
    first_entry_file_name="../example_data/GeneralTextPipeline/pt_input.jsonl",
    cache_path="./cache",
    file_name_prefix="dataflow_cache",
    cache_type="jsonl",
)
```

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
   - 仅保留英文文本（或指定特定语言）  
   ```python
   self.language_filter = LanguageFilter(allowed_languages = '__label__eng_Latn', model_cache_dir = self.model_cache_dir)
   ```

2. **删除多余空格 (RemoveExtraSpacesRefiner)**  
   - 删除多余空格
   ```python
   self.remove_extra_spaces_refiner = RemoveExtraSpacesRefiner()
   ```

3. **删除表情符号 (RemoveEmojiRefiner)**  
   - 删除表情符号，如
   ```python
   self.remove_emoji_refiner = RemoveEmojiRefiner()
   ```

4. **删除 HTML 标签 (HtmlUrlRemoverRefiner)**  
   - 删除 HTML 标签，如\<tag\>
   ```python
   self.html_remove_refiner = HtmlUrlRemoverRefiner()
   ```

5. **MinHash 数据去重 (MinHashDeduplicator)**  
   - 基于 MinHash 算法进行数据去重  
   ```python
   self.minhash_deduplicator = MinHashDeduplicator(num_perm=128, threshold=0.9, use_n_gram=True, ngram=5)
   ```

6. **敏感词过滤 (BlocklistFilter)**  
   - 过滤含屏蔽词较多的文本，屏蔽词列表见[List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words)  
   ```python
   self.blocklist_filter = BlocklistFilter()
   ```

7. **单词数量过滤 (WordNumberFilter)**  
   - 文本单词数量过滤，保留单词数据在[20, 100000]中的文本（可调）
   ```python
   self.word_number_filter = WordNumberFilter(min_words=20, max_words=100000)
   ```

8. **冒号结尾过滤 (ColonEndFilter)**  
   - 过滤以冒号结尾的文本
   ```python
   self.colon_end_filter = ColonEndFilter()
   ```

9. **语句数量过滤 (SentenceNumberFilter)**  
   - 过滤句子数量异常的文本，保留句子数量范围为[3, 7500]（可调）
   ```python
   self.sentence_number_filter = SentenceNumberFilter(min_sentences=3, max_sentences=7500)
   ```

10. **省略号结尾过滤 (LineEndWithEllipsisFilter)**  
    - 过滤省略号结尾句子比例大于0.3的文本（可调）
    ```python
    self.line_end_with_ellipsis_filter = LineEndWithEllipsisFilter(threshold=0.3)
    ```

11. **空文本过滤 (ContentNullFilter)**  
    - 过滤空文本  
    ```python
    self.content_null_filter = ContentNullFilter()
    ```

12. **平均单词长度过滤 (MeanWordLengthFilter)**  
    - 文本平均单词长度过滤, 保留平均单词长度在[3, 10]的文本（可调）
    ```python
    self.mean_word_length_filter = MeanWordLengthFilter(min_length=3, max_length=10)
    ```

13. **符号/单词比例过滤 (SymbolWordRatioFilter)**  
    - 过滤符号（如#）/单词比例大于0.4的文本（可调）
    ```python
    self.symbol_word_ratio_filter = SymbolWordRatioFilter(threshold=0.4)
    ```

14. **HTML 标签过滤 (HtmlEntityFilter)**  
    - 过滤含HTML标签的文本，如nbsp, lt, gt等
    ```python
    self.html_entity_filter = HtmlEntityFilter()
    ```

15. **ID Card 过滤 (IDCardFilter)**  
    - 隐私保护，过滤含 ID Card 相关信息多的文本，如：”身份证“，”ID NO.“等
    ```python
    self.id_card_filter = IDCardFilter(threshold=3)
    ```

16. **无标点符号过滤 (NoPuncFilter)**  
    - 过滤无标点符号的文本  
    ```python
    self.no_punc_filter = NoPuncFilter(threshold=112)
    ```

17. **特殊符号过滤 (SpecialCharacterFilter)**  
    - 过滤含有特殊符号（如r"u200e"）的文本
    ```python
    self.special_character_filter = SpecialCharacterFilter()
    ```

18. **水印过滤 (WatermarkFilter)**  
    - 过滤含水印的文本，如“Watermark”, "Copyright"等。
    ```python
    self.watermark_filter = WatermarkFilter(watermarks=['Copyright', 'Watermark', 'Confidential'])
    ```

19. **括号比例过滤 (CurlyBracketFilter)**  
    - 过滤括号比例高(大于0.025)的文本（可调）
    ```python
    self.curly_bracket_filter = CurlyBracketFilter(threshold=0.025)
    ```

20. **大写字母比例过滤 (CapitalWordsFilter)**  
    - 过滤大写字母比例高（大于0.2）的文本（可调）
    ```python
    self.capital_words_filter = CapitalWordsFilter(threshold=0.2, use_tokenizer=False)
    ```

21. **Lorem Ipsum 过滤 (LoremIpsumFilter)**  
    - 过滤含 lorem ipsum 的文本。lorem ipsum为常用于排版设计的随机假文。
    ```python
    self.lorem_ipsum_filter = LoremIpsumFilter(threshold=3e-8)
    ```

22. **Unique 单词过滤 (UniqueWordsFilter)**  
    - 过滤独立单词比例小于0.1的文本（可调）
    ```python
    self.unique_words_filter = UniqueWordsFilter(threshold=0.1)
    ```

23. **字符数量过滤 (CharNumberFilter)**  
    - 过滤字符数少于100的文本（可调）
    ```python
    self.char_number_filter = CharNumberFilter(threshold=100)
    ```

24. **项目符号开头过滤 (LineStartWithBulletpointFilter)**  
    - 过滤以项目符号开头比例大于0.9的文本（可调）  
    ```python
    self.line_start_with_bulletpoint_filter = LineStartWithBulletpointFilter(threshold=0.9)
    ```

25. **含 Javascript 过滤 (LineWithJavascriptFilter)**  
    - 过滤含 Javascript 数量大于3的文本（可调）
    ```python
    self.line_with_javascript_filter = LineWithJavascriptFilter(threshold=3)
    ```

26. **文本质量打分器 (PairQualFilter)**  
    - 使用质量打分器进行文本质量打分。该质量打分器基于bge模型，支持中英双语，使用gpt对文本成对比较打分后训练而成。[模型地址](https://huggingface.co/zks2856/PairQual-Scorer-zh)
    ```python
    self.quality_filter = PairQualFilter(min_score=0, max_score=10000, lang='en')
    ```
---


### 4.2 预训练类phi-4数据合成流水线

在**流水线1**的基础上，添加如下算子：

1. **预训练数据合成 (PretrainGenerator)**  
- 使用llm根据种子文档合成类 Phi-4 风格QA问答对数据
- prompt见`dataflow/prompts/general_text.py`，可更改
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

2. **Qurating质量打分过滤 (QuratingFilter)**
- 从 writing_style、required_expertise、facts_and_trivia、educational_value 四个维度打分并过滤合成后的文本。[模型地址](https://github.com/princeton-nlp/QuRating)
```python
self.qurating_filter = QuratingFilter(min_scores = {'writing_style': 0,'required_expertise': 0,'facts_and_trivia': 0,'educational_value': 0}, max_scores = {'writing_style': 9,'required_expertise': 9,'facts_and_trivia': 9,'educational_value': 9})
```

### 4.3 SFT数据过滤流水线

1. **输出长度过滤 (WordNumberFilter)**  
   - 按照 output 长度过滤数据，保留长度为20-1000之间（可调）
```python
self.word_number_filter_step1 = WordNumberFilter(
            min_words=20,
            max_words=1000
        )
```

2. **指令 IFD 分数过滤 (SuperfilteringFilter)**  
   - 按照指令 IFD 分数过滤数据。[模型地址](https://github.com/tianyi-lab/Superfiltering)
```python
self.super_filtering_filter_step2 = SuperfilteringFilter(
            min_score=0.5,
            max_score=1.0,
            model_cache_dir=self.model_cache_dir
        )
```

3. **指令质量得分过滤 (DeitaQualityFilter)**  
   - 按照指令质量得分过滤数据。[模型地址](https://huggingface.co/hkust-nlp/deita-quality-scorer)
```python
self.deita_quality_filter_step3 = DeitaQualityFilter(
            min_score=2.5,
            max_score=10000,
            max_length=512,
            model_cache_dir=self.model_cache_dir
        )
```

### 4.4 SFT数据合成流水线

在**流水线1**和**流水线3**的基础上添加如下算子：

1. **SFT数据合成 (SFTGeneratorSeed)**  
- 使用llm根据种子文档合成SFT格式数据
- prompt见`dataflow/prompts/general_text.py`，可更改
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

## 5. 流水线示例

以下给出示例流水线，演示如何使用多个算子进行文本处理。该示例展示了如何初始化一个文本处理流水线，并且顺序执行各个过滤和清理步骤。

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
