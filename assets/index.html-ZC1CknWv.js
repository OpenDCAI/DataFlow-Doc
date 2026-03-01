import{_ as a,c as n,a as i,o as e}from"./app-RmE5kr10.js";const l={};function p(d,s){return e(),n("div",null,s[0]||(s[0]=[i(`<h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始"><span>快速开始</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>#环境配置</span></span>
<span class="line"><span>conda create -n dataflow python=3.10</span></span>
<span class="line"><span>conda activate dataflow</span></span>
<span class="line"><span>git clone https://github.com/OpenDCAI/DataFlow.git</span></span>
<span class="line"><span>cd DataFlow</span></span>
<span class="line"><span>pip install -e .</span></span>
<span class="line"><span>pip install llamafactory[torch,metrics]</span></span>
<span class="line"><span>pip install open-dataflow[vllm]</span></span>
<span class="line"><span>#模型下载</span></span>
<span class="line"><span>#第一个两者都可以选</span></span>
<span class="line"><span>#第二个选all</span></span>
<span class="line"><span>mineru-models-download</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#运行程序</span></span>
<span class="line"><span>cd ..</span></span>
<span class="line"><span>mkdir test</span></span>
<span class="line"><span>cd test</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#初始化 </span></span>
<span class="line"><span>dataflow text2model init</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#训练</span></span>
<span class="line"><span>dataflow text2model train</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#与训练好的模型进行对话,也可以与本地训练好的模型对话</span></span>
<span class="line"><span>dataflow chat</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第一步-安装dataflow环境" tabindex="-1"><a class="header-anchor" href="#第一步-安装dataflow环境"><span>第一步: 安装dataflow环境</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>#创建环境</span></span>
<span class="line"><span>conda create -n dataflow python=3.10</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#激活环境</span></span>
<span class="line"><span>conda activate dataflow</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#进入根目录</span></span>
<span class="line"><span>cd DataFlow</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#下载mineru基础环境</span></span>
<span class="line"><span>pip install -e .</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#下载llamafactory环境</span></span>
<span class="line"><span>pip install llamafactory[torch,metrics]</span></span>
<span class="line"><span>pip install open-dataflow[vllm]</span></span>
<span class="line"><span>mineru-models-download</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第二步-创建新的dataflow工作文件夹" tabindex="-1"><a class="header-anchor" href="#第二步-创建新的dataflow工作文件夹"><span>第二步: 创建新的dataflow工作文件夹</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>mkdir run_dataflow</span></span>
<span class="line"><span>cd run_dataflow</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第三步-设置数据集" tabindex="-1"><a class="header-anchor" href="#第三步-设置数据集"><span>第三步: 设置数据集</span></a></h2><p>将合适大小的数据集(数据文件为json或jsonl格式)放到工作文件夹中</p><h2 id="第四步-初始化dataflow-text2model" tabindex="-1"><a class="header-anchor" href="#第四步-初始化dataflow-text2model"><span>第四步: 初始化dataflow-text2model</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>#初始化 </span></span>
<span class="line"><span>#--cache 可以指定.cache目录的位置（可选）</span></span>
<span class="line"><span>#默认值为当前文件夹目录</span></span>
<span class="line"><span>dataflow text2model init</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>初始化完成后，项目目录变成：</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-shell"><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">项目根目录/</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">├──</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> text_to_qa_pipeline.py</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # pipeline执行文件</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">└──</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> .cache/</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">            # 缓存目录</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">    └──</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> train_config.yaml</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  # llamafactory训练的默认配置文件</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第五步-一键微调" tabindex="-1"><a class="header-anchor" href="#第五步-一键微调"><span>第五步: 一键微调</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>#--lf_yaml 可以指定训练所用llamafactory的yaml参数文件所在的路径(可选)</span></span>
<span class="line"><span>#默认值为.cache/train_config.yaml</span></span>
<span class="line"><span>#--input-keys 可以指定检测json文件中的字段</span></span>
<span class="line"><span>#默认值为text</span></span>
<span class="line"><span>dataflow text2model train</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>微调完成完成后，项目目录变成：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>项目根目录/</span></span>
<span class="line"><span>├── text_to_qa_pipeline.py  # pipeline执行文件</span></span>
<span class="line"><span>└── .cache/            # 缓存目录</span></span>
<span class="line"><span>    ├── train_config.yaml  # llamafactory训练的默认配置文件</span></span>
<span class="line"><span>    ├── data/</span></span>
<span class="line"><span>    │   ├── dataset_info.json</span></span>
<span class="line"><span>    │   └── qa.json</span></span>
<span class="line"><span>    ├── gpu/</span></span>
<span class="line"><span>    │   ├── batch_cleaning_step_step1.json</span></span>
<span class="line"><span>    │   ├── batch_cleaning_step_step2.json</span></span>
<span class="line"><span>    │   ├── batch_cleaning_step_step3.json</span></span>
<span class="line"><span>    │   ├── batch_cleaning_step_step4.json</span></span>
<span class="line"><span>    │   └── text_list.jsonl</span></span>
<span class="line"><span>    ├── mineru/</span></span>
<span class="line"><span>    │   └── text_name/auto/</span></span>
<span class="line"><span>    └── saves/</span></span>
<span class="line"><span>        └── text2model_cache_{timestamp}/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第六步-与微调好的模型对话" tabindex="-1"><a class="header-anchor" href="#第六步-与微调好的模型对话"><span>第六步: 与微调好的模型对话</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>#用法一:--model 可以指定 对话模型的路径位置（可选）</span></span>
<span class="line"><span>#默认值为.cache/saves/text2model_cache_{timestamp}</span></span>
<span class="line"><span>#用法二:到模型文件夹下 运行dataflow chat</span></span>
<span class="line"><span>dataflow chat --model ./custom_model_path</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,18)]))}const t=a(l,[["render",p]]),r=JSON.parse('{"path":"/zh/guide/ndyvouo2/","title":"Text2ModelPipeline","lang":"zh-CN","frontmatter":{"title":"Text2ModelPipeline","createTime":"2025/08/31 03:42:26","permalink":"/zh/guide/ndyvouo2/"},"readingTime":{"minutes":1.6,"words":480},"git":{"createdTime":1756536834000,"updatedTime":1757049331000,"contributors":[{"name":"Yalin-Feng","username":"Yalin-Feng","email":"Feng_Yalin@163.com","commits":3,"avatar":"https://avatars.githubusercontent.com/Yalin-Feng?v=4","url":"https://github.com/Yalin-Feng"},{"name":"Ma, Xiaochen","username":"","email":"mxch1122@126.com","commits":1,"avatar":"https://gravatar.com/avatar/c86bc98abf428aa442dfc12c76e70e324a551ebc637e5ed6634d60fbd3811221?d=retro"}]},"filePathRelative":"zh/notes/guide/pipelines/Text2ModelPipeline.md","headers":[]}');export{t as comp,r as data};
