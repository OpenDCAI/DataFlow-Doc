---
title: Case 8. Quick General Text Evaluation
createTime: 2025/07/20 20:55:02
permalink: /en/guide/c9gv10k1/
icon: basil:lightning-alt-outline
---

# Quick Start: Simple Data Quality Evaluation

This case demonstrates how to perform quick quality evaluation using operators from the GeneralText module in DataFlow.

## 1. Install DataFlow Environment

Install the necessary environment dependencies for DataFlow using the following command:

```bash
pip install open-dataflow
```

## 2. Create a DataFlow Workspace

You can create a local folder to serve as a workspace for quickly running DataFlow. The following instructions provide an example:

```bash
mkdir run_dataflow
cd run_dataflow
```

### 3. Initialize DataFlow

Once you’ve created and switched to the workspace folder, you can initialize DataFlow’s quick start example code with a single command:

```bash
dataflow init
```

At this point, you’ll see a series of test files and scripts appear in the folder:

```bash
run_dataflow/playground/quick_evaluate.py
```

## 4. Configure LLM Serving

The operators in this case require API-based LLM Serving, so before running the script, you’ll need to set your API key in the environment variable.

For Linux and macOS:

```bash
export DF_API_KEY="sk-xxxxx"
```

For Windows:

```bash
$env:DF_API_KEY = "sk-xxxxxx"
```

The code will later read this API key from the environment variable, so you don’t need to include it in the script explicitly.

Additionally, the `api_url` needs to be set in `run_dataflow/playground/quick_evaluate.py` as follows:

```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=100
)
```

## 5. One-Click Run

```bash
python quick_evaluate.py
```

After running, the pipeline will invoke `MetaScorer`, which multi-dimensional data evaluation based on predefined dimensions.

### Key Parameter Descriptions

* `MetaScorer.dimensions`: List of dimensions to be evaluated. Each dimension is a dictionary with the following keys:

  * `dimension_name`: Name of the dimension
  * `description`: Detailed description of the dimension
  * `example_list`: List of examples, where each follows a format like `{"text": "some text", "score": 1}`

The dimensions used in the sample pipeline are listed in [dataflow/operators/text_pt/eval/meta_sample_evaluator.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_pt/eval/meta_sample_evaluator.py):

```python
example_dimensions = [
    {
        "dimension_name": "Text Structure",
        "description": "Evaluate the surface-level quality of the text, including spelling accuracy, grammar, vocabulary richness, and sentence structure.",
        "example_list": [
            {
                "text": "The experimental procedure was meticulously documented, with each variable clearly defined.",
                "score": "5"
            },
            {
                "text": "teh data was wrong and we dont no why it happen like that",
                "score": "2"
            }
        ]
    },
    {
        "dimension_name": "Diversity and Complexity",
        "description": "Assess how rich and conceptually varied the content is, and whether it requires expert or deep reasoning to understand.",
        "example_list": [
            {
                "text": "This article compares Bayesian inference and frequentist approaches in statistical modeling, highlighting theoretical and practical trade-offs.",
                "score": "5"
            },
            {
                "text": "Dogs are pets. They bark. They are friendly.",
                "score": "2"
            }
        ]
    },
    {
        "dimension_name": "Fluency and Understandability",
        "description": "Evaluate whether the text flows naturally, is easy to follow, and avoids awkward or disjointed phrasing.",
        "example_list": [
            {
                "text": "Despite initial challenges, the team successfully completed the deployment by adhering to a revised strategy.",
                "score": "5"
            },
            {
                "text": "The problem was and then fixed by something happens deployment successful maybe.",
                "score": "2"
            }
        ]
    },
    {
        "dimension_name": "Safety",
        "description": "Identify whether the text contains profanities, hate speech, or excessive personally identifiable information (PII).",
        "example_list": [
            {
                "text": "The software collects anonymous usage data to improve performance.",
                "score": "5"
            },
            {
                "text": "You idiot, your address 123 Main St will be posted online.",
                "score": "1"
            }
        ]
    },
    {
        "dimension_name": "Educational Value",
        "description": "Determine whether the text provides insight, stimulates thinking, or offers meaningful learning potential.",
        "example_list": [
            {
                "text": "Understanding the principles of thermodynamics allows engineers to design more efficient engines.",
                "score": "5"
            },
            {
                "text": "The sky is blue. Water is wet. This is how it is.",
                "score": "2"
            }
        ]
    },
    {
        "dimension_name": "Content Accuracy and Effectiveness",
        "description": "Assess the truthfulness, relevance, and practical usefulness of the content.",
        "example_list": [
            {
                "text": "Newton's second law states that F = ma, which explains the relationship between force, mass, and acceleration.",
                "score": "5"
            },
            {
                "text": "The Earth is flat and doesn't rotate around the Sun.",
                "score": "1"
            }
        ]
    }
]
```

### Operator Logic

The full implementation of the operator is located in the following files:

* [dataflow/operators/text_pt/eval/meta_sample_evaluator.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/text_pt/eval/meta_sample_evaluator.py)


### Output

After the script finishes executing, you can find the final results in the `playground/cache/` folder within your workspace. Below is an example from the sample data.

```json
{
    "url": "http://bastum.us/2022/11/05/",
    "date_download": "2023-01-26T22:47:32Z",
    "digest": "sha1:WUTRNJACWOBNKOUJJOAQEUPC5UP4H75E",
    "length": 5221,
    "nlines": 13,
    "source_domain": "bastum.us",
    "title": "November 5, 2022 \u2013 bastum",
    "raw_content": "Home - 2022 - November -\n5Nov, 2022\nBernina District 2022 Top Things To Do Bernina District Travel Guides Top Recommended Bernina District Tickets For Attractions, Hotels, Places To Visit, Restaurants And Restaurants\nThe Bernina line runs from Italy to Switzerland, starting/ending in the Italian city of Tirano and starting/ending in the Swiss city of Chur. It passes through some of Switzerland\u2019s most picturesque landscapes and is available for travel in both winter and summer. A train ride through the Swiss Alps is beautiful at any time of the year.\nItalian high-speed trains are booked and have dynamic prices, cheaper in advance than on the day. The reservation opens up to 4 months in advance, depending on the train. Normally, you will need to change trains at least once if you want to travel from Chur to Tirano on these regular local trains.\nAt its highest point, the train is 7392 feet above sea level. You can also book your one-way trip with the Bernina Express and then use the regional trains to reach your next destinations, which would be included in your Swiss Travel Pass. I would also suggest doing this if you plan to get on and off the train. You will have to pay for seats again to return to one of the normal trains, as your tickets will only apply to the panoramic train. It seems that the windows of the normal wagons of the regional train open, but from what I could see, I could not reach those cars from where I was sitting. You can also stop at one of the small towns along the way to get a closer look.\nIn less than four hours, you\u2019ll experience the historic mountain passes of Albula and Bernina, the famous Landwasser Viaduct, with endless views on either side of the train as you twist and turn through the landscape. The 6 limestone arches with the red train, which travel through them, are iconic and became a symbol of scenic train rides in Switzerland and Europe. Shortly after leaving Tirano, the Bernina Express begins to drive through the streets while cars stay at traffic lights, allowing it to pass. The train then climbs up the valley just outside Tirano and continues all the way to the mountainside thousands of meters above sea level. Ospizio Bernina is the summit and highest point of the route at 2,253 meters above sea level.\nTravel with the Bernina Express can also be booked to/from Chur. This sensational scenic drive takes you along some of Switzerland\u2019s most beautiful routes, such as the Golden Pass, Glacier Express, and Bernina Express. In Interlaken you travel to the top of Europe: the Jungfraujoch. Day 2, travel from Zurich to Chur by Swiss InterCity train, then from Chur to Tirano on the fantastic Bernina Express, then Tirano to Milan by regional train trenord, as seen in the previous schedule. You can use the morning train all year round or the evening train in summer. This is the 3-car Allegra unit, coupled with the panoramic cars of the Bernina Express.\nThis is a regional ticket with a fixed price, tickets cannot be sold out, the reservation is not necessary or possible, so you can safely buy close to the departure date, without having to commit your money in advance. In fact, tickets can be purchased at the station on the day itself at this price if you wish. You can avoid paying a reservation fee if you travel in the non-reserved seats on the Allegra unit with the Bernina Express. Since the whole trip only takes 4 hours, you can easily do it in one day.\nThe Express is an hour and a half by train from Zurich and runs all year round. After a break of a few hours, the train departs from Tirano station, making its way through the Treno rosso del Bernina town of Tirano and back along the same route before arriving back in Chur in the late afternoon. The whole trip takes a whole day to complete and can start at both ends.\n2nd Class1st classSingle travel63101Tour116222Sterreservering+10 CHF+ 10 CHFImportantly, as shown in the table, an additional CHF 10 will be charged for seat reservation. These seat reservations can be booked in advance, we recommend this. Booking fees vary depending on the season you are travelling. If you want to travel on the Bernina Express during the cheapest time of the year, we recommend that you travel from November to January/February. It is recommended to reserve a seat if you are travelling during peak hours or want to guarantee a seat on board the daily express trains. You can reserve your seat at a Swiss train station or online.\nTaxis are also not a viable option, as the journey takes several hours. The best way to get from Milan to St. Moritz is via a combination train and bus, which takes about 4.5 hours when all is said and done. You can take a train from Milano Centrale station to Chiavenna, and then change to bus line 4 to St. Moritz Bahnhof. The bus we were travelling in was bad with a clear mechanical problem from the moment we boarded in Milan.\nThey pride themselves on the Bernina Express going from glacial landscapes to palm-friendly climates within hours. They speak enthusiastically about the 7,638 meter high Bernina Pass. And they can\u2019t help mentioning the line\u2019s impressive tunnels and viaducts. It looks like a beautiful train ride and the photos are spectacular.",
    "cc_segment": "crawl-data/CC-MAIN-2023-06/segments/1674764494826.88/wet/CC-MAIN-20230126210844-20230127000844-00000.warc.wet.gz",
    "original_nlines": 44,
    "original_length": 5801,
    "language": "en",
    "language_score": 0.95,
    "perplexity": 277.6,
    "bucket": "head",
    "Text Structure": 4.0,
    "Diversity and Complexity": 3.0,
    "Fluency and Understandability": 4.0,
    "Safety": 5.0,
    "Educational Value": 4.0,
    "Content Accuracy and Effectiveness": 5.0
}
```

![](/dim_eval.png)