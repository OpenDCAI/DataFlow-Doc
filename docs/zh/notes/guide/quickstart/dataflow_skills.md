---
title: DataFlow Skills
icon: material-symbols:auto-awesome
createTime: 2026/05/22 12:45:39
permalink: /zh/guide/quickstart/dataflow_skills/
---

# DataFlow Skills

为 [DataFlow](https://github.com/OpenDCAI/DataFlow) 数据处理框架准备的可复用 [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code/skills)。共三个 skill：

| Skill | 功能 | 调用方式 |
|---|---|---|
| **`generating-dataflow-pipeline`** | 给一个任务目标 + 一个 JSONL 样本文件，规划算子链并生成可运行的 DataFlow pipeline 代码。 | `/generating-dataflow-pipeline` |
| **`dataflow-dev`** | DataFlow 开发助手。按意图路由（新建算子 / 新建 pipeline / 新建 prompt / 诊断报错 / 规范审查 / 知识库同步）。在 DataFlow 仓库里使用。 | `/dataflow-dev` |
| **`core_text`** | 算子级 API 参考（8 个 generator、3 个 filter、2 个 refiner、5 个 evaluator）。当 pipeline skill 需要超出 6 个核心算子之外的扩展算子时会查阅它。 | _（不直接调用）_ |


## 安装

**前置条件：** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI 已安装并在 `PATH` 中。

```bash
git clone https://github.com/haolpku/DataFlow-Skills.git
cd DataFlow-Skills
./install.sh
```

脚本会把三个 skill 都拷到 `~/.claude/skills/`（用户级——所有项目都能用）。然后在任意 Claude Code 会话里：

```
/generating-dataflow-pipeline
```

补全里能看到这个斜杠命令就装好了。

### 安装选项

```bash
./install.sh --project                       # 装到当前项目的 ./.claude/skills/
./install.sh dataflow-dev                    # 只装指定的 skill
./install.sh --force                         # 覆盖已存在的 skill（默认是跳过）
```

### 更新

```bash
cd DataFlow-Skills
git pull
./install.sh --force
```


## Generating DataFlow Pipeline

> [视频教程：生成 DataFlow Pipeline](https://github.com/user-attachments/assets/ca1fefbf-9bf7-469f-b856-b201952fb99b)

推理引导的 Pipeline 规划器。给它一个**目标**（pipeline 要达成什么）和一个**样本 JSONL 文件**（1–5 行代表性数据），它会分析数据、选择算子、校验字段依赖，最终生成完整可运行的 Python pipeline 代码。

### 快速开始

#### 1. 准备数据

创建一个 JSONL 文件（每行一个 JSON 对象），包含 1–5 行代表性样本：

```jsonl
{"product_name": "笔记本电脑", "category": "电子产品"}
{"product_name": "咖啡机", "category": "家电"}
```

#### 2. 运行 Skill

在 Claude Code 中调用 `/generating-dataflow-pipeline` 并描述目标：

```
/generating-dataflow-pipeline
目标：生成商品描述并筛选优质内容
样本文件：./data/products.jsonl
预期输出字段：generated_description, quality_score
```

#### 3. 查看输出

Skill 返回两阶段结果：

1. **中间算子决策** — JSON，包含算子链、字段流、推理过程
2. **完整 5 段式响应**：
   - 字段映射 — 哪些字段已存在 vs. 需要生成
   - 有序算子列表 — 按执行顺序排列，附理由
   - 推理摘要 — 为什么这个设计能满足目标
   - 完整 Pipeline 代码 — 可直接执行的 Python 代码
   - 可调参数 / 注意事项 — 可调节的旋钮和调试建议

### 六个核心算子

| 算子 | 用途 | 需要 LLM？ |
|------|------|-----------|
| `PromptedGenerator` | 单字段 LLM 生成 | 是 |
| `FormatStrPromptedGenerator` | 多字段模板生成 | 是 |
| `Text2MultiHopQAGenerator` | 从文本构建多跳 QA 对 | 是 |
| `PromptedFilter` | 基于 LLM 的质量打分与过滤 | 是 |
| `GeneralFilter` | 基于规则的确定性过滤 | 否 |
| **KBC 三件套**（3 个算子，始终按序一起使用） | 文件/URL → Markdown → 分块 → 清洗文本 | 部分 |

### 生成的 Pipeline 结构

所有生成的 pipeline 遵循相同的标准结构：

```python
from dataflow.operators.core_text import PromptedGenerator, PromptedFilter
from dataflow.serving import APILLMServing_request
from dataflow.utils.storage import FileStorage

class MyPipeline:
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./data/input.jsonl",
            cache_path="./cache",
            file_name_prefix="step",
            cache_type="jsonl"
        )
        self.llm_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/chat/completions",
            model_name="gpt-4o",
            max_workers=10
        )
        # 算子实例 ...

    def forward(self):
        # 按序调用 operator.run()，每次传 storage.step()
        ...

if __name__ == "__main__":
    pipeline = MyPipeline()
    pipeline.forward()
```

关键规则：
- `first_entry_file_name` 设为用户提供的 JSONL 路径
- 每个 `operator.run()` 使用 `storage=self.storage.step()` 做断点续传
- 字段向前传播：字段必须在样本中存在或由前序步骤输出，后续步骤才能消费



## DataFlow Dev

DataFlow 仓库内的开发助手 skill。它加载架构知识库，探测 git 状态，然后按你的意图路由：

| 你说类似这样的话…… | 执行流程 |
|---|---|
| "新建一个 filter 算子……" | 算子创建（重复检查 → 规格确认 → 生成代码 + 注册提醒） |
| "新建一个 pipeline……" | Pipeline 创建（标准 `storage.step()` 模式） |
| "给 X 写个 prompt" | Prompt 创建（`PromptABC` / `DIYPromptABC`，`@prompt_restrict` 位置） |
| "我遇到 `KeyError: …`" | 诊断：匹配已知 Issue #001–#008 |
| "审查这个算子" | 14 项检查清单（注册、`run()` 签名、`get_desc` 等） |
| "上游仓库有新算子了" | 对照知识库找差异，输出更新步骤 |

### 算子创建

Skill 会先执行防重复检查，然后向你确认规格：
- 算子类型（filter / generate / refine / eval）
- 所属模块（general_text / text_sft / reasoning / code / 其他）
- 是否依赖 LLM
- 输入/输出列名

生成的代码必须满足：
- 继承 `OperatorABC`，调用 `super().__init__()`
- 类上方有 `@OPERATOR_REGISTRY.register()` 装饰器
- `run()` 参数：`input_*` 前缀、`output_*` 前缀、第一个参数为 `storage: DataFlowStorage`
- `run()` 返回输出 key 列表
- LLM 驱动算子使用 `self.llm_serving`
- 包含 `get_desc(lang)` 支持 zh/en

### Pipeline 创建

生成的 pipeline 遵循以下规则：
- `storage` 在 `__init__` 中声明，不在 `forward()` 里临时创建
- 每个算子调用传 `storage=self.storage.step()`
- `max_workers` 根据 API 能力设置
- API key 通过环境变量注入，不硬编码
- 包含 `if __name__ == "__main__":` 入口

### 报错诊断

常见错误快速匹配表：

| 报错关键词 | 根因 |
|---|---|
| `Unexpected key 'xxx' in operator` | 配置参数命名（仅警告非错误） |
| `No object named 'Xxx' found in 'operators' registry` | `__init__.py` 未注册 |
| `Key Matching Error` | Pipeline key 不一致 |
| `You must call storage.step() before` | 缺少 `storage.step()` |
| `DummyStorage` + `AttributeError` | DummyStorage 不支持 `get_keys_from_dataframe` |
| `ModuleNotFoundError` + `dataflow.operators.reasoning.refine` | LazyLoader 路径，应从父模块 import |


## Core Text 扩展算子参考

供 pipeline skill 查阅的扩展算子参考。当 6 个核心算子不够用时，可以使用以下算子：

### Generate

| 算子 | 描述 |
|------|------|
| `prompted-generator` | 基础单字段 LLM 生成 |
| `format-str-prompted-generator` | 多字段模板生成 |
| `chunked-prompted-generator` | 长文档逐块处理 |
| `embedding-generator` | 使用 Embedding API 向量化文本 |
| `retrieval-generator` | 使用 LightRAG 的异步 RAG 生成 |
| `bench-answer-generator` | 基准测试答案生成 |
| `text2multihopqa-generator` | 从文本构建多跳 QA 对 |
| `random-domain-knowledge-row-generator` | 从种子数据生成领域知识行 |

### Filter

| 算子 | 描述 |
|------|------|
| `prompted-filter` | 基于 LLM 的质量打分与过滤 |
| `general-filter` | 基于规则的确定性过滤 |
| `kcentergreedy-filter` | 基于 k-Center Greedy 的多样性过滤 |

### Refine

| 算子 | 描述 |
|------|------|
| `prompted-refiner` | 基于 LLM 的文本改写和精炼 |
| `pandas-operator` | 自定义 pandas DataFrame 操作 |

### Eval

| 算子 | 描述 |
|------|------|
| `prompted-evaluator` | 基于 LLM 的打分和评估 |
| `bench-dataset-evaluator` | 基准数据集评估 |
| `bench-dataset-evaluator-question` | 基准题目级评估 |
| `text2qa-sample-evaluator` | QA 样本质量评估 |
| `unified-bench-dataset-evaluator` | 跨格式统一基准评估 |

每个算子目录结构如下：

```
<算子名>/
├── SKILL.md          # 英文文档
├── SKILL_zh.md       # 中文文档
└── examples/
    ├── good.md       # 正确用法示例
    └── bad.md        # 常见错误
```


## 添加新算子

### 作为扩展算子

1. 在 `core_text/<分类>/<你的算子>/` 下创建 skill 定义：

```
core_text/<category>/<your-operator>/
├── SKILL.md
├── SKILL_zh.md
└── examples/
    ├── good.md
    └── bad.md
```

2. 在 `generating-dataflow-pipeline/SKILL.md` 的 **Extended Operator Reference** 对应分类表格里加一行。**不加这行 pipeline 规划器就发现不了你的算子**。

### 升级为核心算子

如果算子高频到需要优先选择：

1. 加入 Preferred Operator Strategy 核心算子列表
2. 在 Operator Selection Priority Rule 加决策表行
3. 在 Operator Parameter Signature Rule 加完整构造函数和 `run()` 签名
4. 在 Correct Import Paths 加导入路径
5. 在 Input File Content Analysis Rule 加输入模式匹配（如涉及新数据类型）


## 仓库地址

GitHub: [https://github.com/OpenDCAI/DataFlow-Skills](https://github.com/OpenDCAI/DataFlow-Skills)
