---
title: PromptedVQAGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_vision/generate/promptedvqagenerator/
---

## 📘 概述

`PromptedVQAGenerator` 是一个视觉问答（VQA）生成算子，用于根据输入的图像和问题，调用大语言模型（LLM）生成相应的回答。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "You are a helpful assistant."):
```

### init参数说明

| 参数名          | 类型            | 默认值                             | 说明                                   |
| :-------------- | :-------------- | :--------------------------------- | :------------------------------------- |
| **llm_serving** | LLMServingABC   | 必需                               | 大语言模型服务实例，用于执行推理与生成。 |
| **system_prompt** | str             | "You are a helpful assistant."     | 系统提示词，用于指导和定义模型的行为。   |

### Prompt模板说明
该算子不使用固定的`Prompt`模板，而是通过`system_prompt`参数和`run`函数中`input_key`对应的内容直接组合成最终的提示词。

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "generated_content")
```

#### 参数

| 名称         | 类型            | 默认值                | 说明                               |
| :----------- | :-------------- | :-------------------- | :--------------------------------- |
| **storage**  | DataFlowStorage | 必需                  | 数据流存储实例，负责读取与写入数据。 |
| **input_key**  | str             | "raw_content"         | 输入列名，对应输入的图片的路径，仅允许输入一张图片 |
| **output_key** | str             | "generated_content"   | 输出列名，对应生成答案的字段。       |

## 🧠 示例用法
```python
from dataflow.operators.core_vision import PromptedVQAGenerator
from dataflow.serving.APIVLMServing_openai import APIVLMServing_openai
from dataflow.utils.storage import FileStorage

class VQA_generator():
    def __init__(self):
        self.prompt = "Describe the image in detail."
        self.storage = FileStorage(
            first_entry_file_name="../example_data/VQA/pic_path.json",
            cache_path="./cache",
            file_name_prefix="vqa",
            cache_type="json",
        )
        self.llm_serving = APIVLMServing_openai(
            model_name="o4-mini",
            api_url="https://api.openai.com/v1", # openai api url
            key_name_of_api_key="DF_API_KEY",
        )
        self.vqa_generate = PromptedVQAGenerator(
            self.llm_serving,
            self.prompt
            )

    def forward(self):
        self.vqa_generate.run(
            storage = self.storage.step(),
            input_key = "raw_content",
        )

if __name__ == "__main__":
    VQA_generator = VQA_generator()
    VQA_generator.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段                | 类型 | 说明                                             |
| :------------------ | :--- | :----------------------------------------------- |
| `raw_content`       | str  | 输入的原始内容，即图片的路径。         |
| `generated_content` | str  | 模型生成的回答文本。                             |

示例输入：

```json
[
    {"raw_content": "../example_data/VQA/pdfimages/page_0.jpg"},
    {"raw_content": "../example_data/VQA/pdfimages/page_1.jpg"},
    {"raw_content": "../example_data/VQA/pdfimages/page_2.jpg"}
]
```

示例输出：

```json
[
  {
    "raw_content":"../example_data/VQA/pdfimages/page_0.jpg",
    "generated_content":"The image is a photograph of a single page (numbered “86”) from a Chinese‐language geometry text.  Across the top is a small stylized “数奥” logo (an infinity‐shaped figure with Chinese characters above it).  The page contains two worked examples, labeled “例 4” and “例 5,” each stating a geometry problem in prose, followed by a step‐by‐step proof, and each accompanied by its own diagram (figures 3.13 and 3.14).  \n\n1.  Example 4 (例 4)  \n   – Text (in Chinese): In ΔABC, AB + BC = 3·AC, the incenter is I, and the incircle touches AB at D and BC at E.  The reflections of DE across I meet the circumcircle of ABC again at K and L.  Prove that A, C, K, L are concyclic.  \n   – To the right is Figure 3.13:  \n     • ΔABC is drawn with B at the top, A lower left and C lower right.  \n     • The incircle of ΔABC (center I) is inscribed, touching AB at D and BC at E.  \n     • Points B₁ on AB and C₁ on AC are marked so that segments BI = IB₁, BE = EC₁, etc., with small tick marks indicating equal lengths.  \n     • The line DE is extended beyond E; it re‐enters the circumcircle of ABC at two points labelled K (on the arc BC) and L (on the lower side near AC).  \n     • Right‐angle symbols appear at B₁ and C₁, and small arcs mark several angle‐equalities used in the proof.  \n\n2.  Example 5 (例 5)  \n   – Text (in Chinese): Let ΔABC’s incircle touch AB at P and AC at Q.  Rays BI and CI meet the line PQ again at K and L.  Prove that the circumcircle of triangle ILK is tangent to the circumcircle of ABC if and only if AB + AC = 3·BC.  \n   – To the right is Figure 3.14:  \n     • ΔABC is again drawn (without a base horizontal but slanted), with its circumcircle drawn through A, B, C.  \n     • The incircle (center I) touches AB at P and AC at Q.  \n     • Ray BI meets PQ at K, and ray CI meets PQ at L.  \n     • The extension of line CK meets the circumcircle of ABC again at D.  D is joined back to I, forming ID (a diameter of the small circle through I, L, K).  \n     • Arcs on the big circumcircle (between A–B, B–C, etc.) are hatched or marked to indicate equal arcs, and several angle‐marks appear in the interior.  \n\nBoth proofs run in column format down the left half of the page, with the corresponding figure on the right.  The text uses standard Chinese proof language (“证明,” “∵…∴…,” references to “图 3.13,” “图 3.14,” etc.).  At the very bottom right of the scan is the page number “86.”"
  },
  {
    "raw_content":"../example_data/VQA/pdfimages/page_1.jpg",
    "generated_content":"The illustration is a hand-drawn figure of “Example 7” from a Chinese geometry text (labelled 图 3.16).  In words what you see is:\n\n1.  A “large” triangle A B C with A at the top, B on the left, C on the right, and the base BC roughly horizontal.\n\n2.  Its inscribed circle (the incircle) sitting in the lower half of ΔABC.  The circle touches\n    – BC at D,\n    – CA at Q,\n    – AB at P.\n\n3.  A point E is chosen on the line AD (between A and D) so that E lies on the circle in the interior of the arc BC.\n\n4.  From E two chords are drawn:\n    – the line E B meets the incircle a second time at F (so B–E–F are collinear),\n    – the line E C meets the incircle again at G (so C–E–G are collinear).\n\n5.  Inside the circle the three chords D–G, D–Q, Q–G are also drawn to set up various length ratios.  On the left, the chord E–P is likewise shown.\n\n6.  The overall goal (stated in the text beside the figure) is to prove that the three lines A D, B G and C F are concurrent.\n\nAll of the contact points (P on AB, Q on AC, D on BC), the auxiliary points E, F, G on the circle, and the chords DQ, DG, QG, EP are clearly marked.  Around the figure the authors carry out “power of a point” and Ceva‐type ratio computations to establish the concurrency."
  },
  {
    "raw_content":"../example_data/VQA/pdfimages/page_2.jpg",
    "generated_content":"The page you see is a scan from a Chinese high-school or undergraduate geometry text (page number 87), headed\n\n 第三讲 圆与切线  \n(“Lecture 3: Circles and Tangents”)\n\nImmediately beneath that heading there is a short derivation relating the distance from a vertex to the touch-point of the incircle (labelled I to D) to the sides of ΔABC.  It begins:\n\n  • “易知 ∠BDC = 90° – ½ ∠BAC, 故 ID = a⋅cot ∠BDC = a⋅tan ∠BAC.”  \n  • “另一方面，设 AQ ⟂ BC 于点 Q，则 AQ = ½ (b + c – a), 其中 r 为 ΔABC 的内切圆半径。”  \n  • “于是 ΔILK 的外接圆与 ΔABC 的内切圆相切，当且仅当 ΔILK 外接圆的直径等于 ΔABC 内切圆的直径， ⇒ ID = ½(c + b – a) = a ⇒ 2(c + b – a) = a.”\n\nIn other words, by equating the two expressions for ID one obtains the condition 2 (c + b – a) = a under which the circumcircle of ΔILK is tangent to the incircle of ΔABC.\n\nBelow this derivation comes “例 6” (Example 6), stated in Chinese:\n\n  “已知 ΔABC, ∠B = 90°, 内切圆分别切 BC, CA, AB 于 D, E, F，又 AD 交内切圆于异一点 P, PF ⟂ PC，求 ΔABC 三边长之比。”\n\n(Text: In right triangle ABC with right angle at B, the incircle touches BC, CA, AB at D, E, F respectively.  The ray AD meets the incircle again at P, and PF is drawn perpendicular to PC.  Find the ratio of the three sides AB : BC : AC.)\n\nTo the right of this statement is figure 3.15, a hand-drawn sketch showing:\n\n  – A right triangle ABC with A at the top, B at the lower left (right angle), C at the lower right.  \n  – Its incircle, touching BC at D, CA at E, AB at F.  \n  – The cevian AD cutting the incircle again at P.  \n  – The chord PF dropped perpendicular to PC, with a little right-angle mark at F on PF ⟂ PC.  \n  – The chords FD, DE, PE, as well as the segment FB, are all drawn and a couple of 45° angle arcs are marked (indicating ∠FBD and ∠FPD both equal 45°).\n\nThe text of the solution then proceeds in a series of angle-chasing and triangle‐similarity steps:\n\n  • By the equal arcs, ΔFBD is an isosceles right triangle, so ∠FDB = 45° and hence ∠FPD = 45°, which in turn gives ∠DPC = 45°.  \n  • From that one shows ΔPFD ∼ ΔPDC, so PF\/FD = PD\/CD.  \n  • Also ΔAPF ∼ ΔAFD and ΔAPE ∼ ΔAED give AP\/AE = AF\/AD = PF\/FD and PE\/DE = PD\/ED.  \n  • Noting ∠EPD = ∠EDC = ½ ∠C (they show arc-angle arguments), one concludes ΔEPD is isosceles, hence PE = PD = ED, and then uses the Law of Sines in ΔBPC to relate PC, PB to angles at C.  \n  • After a little algebra they find  \n     2(1 – cos C) = (AC – BC)\/AC  \n    and also  \n     AE\/AC = ½ (AB + AC – BC)\/AC.  \n  • Equating the two conditions forced by the isosceles and perpendicular constraints yields  \n     AB + AC – BC = 4(AC – BC)  \n    ⇒ AB = 3(AC – BC)  \n    ⇒ AB² = 9(AC – BC)².\n\nAll of this is laid out in a single column of Chinese text on the left, with the small figure 3.15 keyed into the right margin, and the page footer giving the page number 87."
  }
]
```
