---
title: Case 3. Synthesizing Multi-turn Dialogue Data from Scratch
createTime: 2025/7/15 14:19:16
permalink: /en/guide/conversation_synthesis/
icon: basil:lightning-alt-outline
---

# Synthesizing Multi-turn Dialogue Data from Scratch

## Step 1: Install the dataflow environment
```shell
pip install open-dataflow
```
## Step 2: Create a new dataflow working directory
```shell
mkdir run_dataflow
cd run_dataflow
```
## Step 3: Initialize Dataflow
```shell
dataflow init
```
At this point, you will see
```shell
run_dataflow/playground/text_conversation_synthesis_pipeline.py  
```
## Step 4: Enter your API key and api_url
For Linux and Mac OS
```shell
export DF_API_KEY="sk-xxxxx"
```

For Windows
```powershell
$env:DF_API_KEY = "sk-xxxxx"
```
In `text_conversation_synthesis_pipeline.py`, fill in api_url as follows:
```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=100
)
```

## Step 5: One-click execution
```bash
python playground/text_conversation_synthesis_pipeline.py  
```

When running, the pipeline will call [`ConsistentChatGenerator`](/en/guide/text_generate_operators/) to generate interaction intents and specific scenarios based on the predefined `intent_categories` and `topic_dict` in `dataflow.prompts.general_text.ConsistentChatPrompt`. For example, an intent like `Problem Solving Interaction` in the scenario `Technical support for computer hardware issues`.

You can set the number of synthesized dialogues using `num_dialogs_per_intent`, and control the number of dialogue turns using `num_turns_per_dialog`. Since there are 9 preset intents, the actual number of dialogues generated will be 9 times `num_dialogs_per_intent`. (If the total exceeds 9000, consider adding more custom topics to avoid repetition.)

Then the API is called to generate questions based on interaction intent, and responses based on questions, finally producing synthesized data like the following.

## Example of Synthesized Data
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
