---
title: 案例3. 从0开始合成多轮对话数据
createTime: 2025/7/15 14:19:16
permalink: /zh/guide/conversation_synthesis/
icon: basil:lightning-alt-outline
---

# 从0开始合成多轮对话数据

## 第一步:安装dataflow环境
```shell
pip install open-dataflow
```
## 第二步:创建新的dataflow工作文件夹
```shell
mkdir run_dataflow
cd run_dataflow
```
## 第三步:初始化Dataflow
```shell
dataflow init
```
这时你会看见
```shell
run_dataflow/playground/text_conversation_synthesis_pipeline.py  
```
## 第四步:填入你的api key以及api_url
对于Linux和Mac OS
```shell
export DF_API_KEY="sk-xxxxx"
```

对于Windows
```powershell
$env:DF_API_KEY = "sk-xxxxx"
```
`text_conversation_synthesis_pipeline.py`中的api_url填写方式如下：
```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=100
)
```

## 第五步:一键运行
```bash
python playground/text_conversation_synthesis_pipeline.py  
```

运行时，该流水线会调用[`ConsistentChatGenerator`](/zh/guide/lo3cyadt/),根据`dataflow.prompts.general_text`中的`ConsistentChatPrompt`类中预置的`intent_categories`和`topic_dict`分别获取交互意图和具体的场景，例如意图`Problem Solving Interaction`，在场景`Technical support for computer hardware issues`中。

可以通过`num_dialogs_per_intent`设置合成对话数量, `num_turns_per_dialog`参数控制对话轮数。由于预置9种意图，实际合成对话数量为`num_dialogs_per_intent`的9倍。（预置主题数量有限，合成数量大于9000时建议手动增加主题）。

此后，分别调用API，根据交互意图合成问题，根据问题合成答案，最终生成如下的合成数据。

## 合成数据示例
```json
{
  "category": "Headphone Jack Issue Resolution",
  "conversation": [
    {
      "role": "user",
      "value": "Why isn't my headphone jack working anymore?"
    },
    {
      "role": "assistant",
      "value": "If your headphone jack isn't working, first check if there's any debris or dirt inside it by gently cleaning it with a toothpick or a small brush. Also, test your headphones on another device to ensure they aren't the problem."
    },
    {
      "role": "user",
      "value": "You think it got damaged when I dropped my phone?"
    },
    {
      "role": "assistant",
      "value": "Physically dropping your phone could potentially damage the headphone jack if it was a hard fall. Look for signs of physical damage around the jack first."
    },
    {
      "role": "user",
      "value": "Is it something I can fix by myself or do I need professional help?"
    },
    {
      "role": "assistant",
      "value": "You may be able to fix minor issues like cleaning out the jack yourself. However, if there's physical damage from the drop, you might need professional help for repairs."
    },
    {
      "role": "user",
      "value": "What kind of tools would I need to check it out?"
    },
    {
      "role": "assistant",
      "value": "To inspect the headphone jack, you'll need a flashlight to look for debris or damage and possibly a small brush or compressed air to clean it. Consult a repair guide if you're uncomfortable with this step."
    },
    {
      "role": "user",
      "value": "Would resetting my phone help with this issue or is it purely hardware?"
    },
    {
      "role": "assistant",
      "value": "Resetting your phone is unlikely to fix hardware issues with the headphone jack, but it can help rule out software-related audio problems."
    },
    {
      "role": "user",
      "value": "Are there ways to test if the problem is in the jack or headphones?"
    },
    {
      "role": "assistant",
      "value": "To determine whether the issue is with the jack or headphones, test your headphones on another device and try different headphones with your phone. This comparison helps isolate the problem."
    },
    {
      "role": "user",
      "value": "What if I accidentally make it worse while trying to repair it myself?"
    },
    {
      "role": "assistant",
      "value": "If you're uncertain about repairing your headphone jack, it might be safer to consult a professional. If you choose to proceed, follow a guide closely and take care to avoid slipping and using force inappropriately."
    }
  ]
}
```