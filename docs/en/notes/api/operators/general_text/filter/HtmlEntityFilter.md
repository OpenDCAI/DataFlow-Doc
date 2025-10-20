---
title: HtmlEntityFilter
createTime: 2025/10/09 17:09:04
permalink: /en/api/operators/general_text/filter/htmlentityfilter/
---

## 📘 Overview

The `HtmlEntityFilter` operator detects and filters text containing HTML entities (such as `&amp;`, `&lt;`, `&gt;`, etc.) to ensure content does not contain markup language elements.

## `__init__` Function

```python
def __init__(self):
```

This function has no parameters.

## `run` Function

```python
def run(self, storage, input_key, output_key='html_entity_filter_label'):
```

#### Parameters

| Name          | Type              | Default                       | Description                                                         |
| :------------ | :---------------- | :--------------------------- | :----------------------------------------------------------- |
| **storage**   | DataFlowStorage   | Required                         | DataFlow storage instance responsible for reading and writing data. |
| **input_key** | str               | Required                         | Input column name corresponding to the text field to be checked. |
| **output_key**| str               | "html_entity_filter_label" | Output column name for storing the filter result label (1 means passed, 0 means failed). |

## 🧠 Example Usage

```python
from dataflow.operators.general_text import HtmlEntityFilter
from dataflow.utils.storage import FileStorage

class HtmlEntityFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/html_entity_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = HtmlEntityFilter()
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='html_entity_filter_label'
        )

if __name__ == "__main__":
    test = HtmlEntityFilterTest()
    test.forward()
```

#### 🧾 Default Output Format

The operator adds a boolean label column (`output_key`) to the DataFrame, then filters out rows containing HTML entities. The filtered DataFrame is saved to storage.

| Field                      | Type | Description                                                         |
| :------------------------ | :--- | :----------------------------------------------------------- |
| text                      | str  | Original input text                                                 |
| html_entity_filter_label  | int  | Filter label, value of 1 means the text row does not contain HTML entities and passed the filter    |

### 📋 Sample Input

```json
{"text": "This is normal text without HTML entities."}
{"text": "This text contains &amp; HTML &lt;entities&gt; like &quot;quotes&quot;."}
```

### 📤 Sample Output

```json
{"text": "This is normal text without HTML entities.", "html_entity_filter_label": 1}
```

### 📊 Result Analysis

**Sample 1 (Plain Text)**:
- Text: "This is normal text without HTML entities."
- Does not contain HTML entities
- **Retained** (html_entity_filter_label=1)

**Sample 2 (Contains HTML Entities)**:
- Text: "This text contains &amp; HTML &lt;entities&gt; like &quot;quotes&quot;."
- Contains multiple HTML entities: `&amp;` (&), `&lt;` (<), `&gt;` (>), `&quot;` (")
- **Filtered** (not in output)

**Common HTML Entities**:
- `&amp;` → &
- `&lt;` → <
- `&gt;` → >
- `&quot;` → "
- `&apos;` → '
- `&nbsp;` → space
- `&#39;` → '
- `&#34;` → "

**Use Cases**:
- Clean HTML markup remnants from web-scraped data
- Filter text containing escape characters
- Ensure text data purity
- Remove formatting marks during preprocessing phase

**Notes**:
- The operator uses regular expressions to detect HTML entity patterns (`&[a-zA-Z]+;` and `&#[0-9]+;`)
- Identifies both named entities (like `&amp;`) and numeric entities (like `&#39;`)
- If you only need to clean rather than filter, consider using HTML decoding tools
