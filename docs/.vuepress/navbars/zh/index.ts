/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
    // { text: '首页', link: '/zh/' },
    // { text: '博客', link: '/zh/blog/' },
    // { text: '标签', link: '/zh/blog/tags/' },
    // { text: '归档', link: '/zh/blog/archives/' },
    {
        text: '指南',
        // link: '/zh/guide/',
        icon: 'icon-park-outline:guide-board',
        items: [
            
            {
                text: '基本信息',
                items: [
                            {
                                text: '简介',
                                link: '/zh/notes/guide/basicinfo/intro.md',
                                icon: 'mdi:tooltip-text-outline',
                                activeMatch: '^/guide/'
                            },
                            {
                                text: '框架设计',
                                link: '/zh/notes/guide/basicinfo/framework.md',
                                icon: 'material-symbols:auto-transmission-sharp',
                                activeMatch: '^/guide/'
                            },
                ]
            },
            {
                text: '快速开始',
                items: [
                    {
                        text: '安装',
                        link: '/zh/notes/guide/quickstart/install.md',
                        icon: 'material-symbols-light:download-rounded',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: '快速开始',
                        link: '/zh/notes/guide/quickstart/quickstart.md',
                        icon: 'solar:flag-2-broken',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: '案例：万用算子',
                        link: '/zh/notes/guide/quickstart/translation.md',
                        icon: 'basil:lightning-alt-outline',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: '案例：批量PDF提取',
                        link: '/zh/notes/guide/quickstart/knowledge_cleaning.md',
                        icon: 'basil:lightning-alt-outline',
                        activeMatch: '^/guide/'
                    }
                ]
            },

            {
                text: "流水线",
                items: [
                    {
                        text: "纯文本流水线",
                        link: '/zh/notes/guide/pipelines/TextPipeline.md',
                        icon: 'mdi:file-text',
                        activeMatch: '^/guide/'
                    },
                    {
                        text:"强推理数据合成流水线",
                        link:"/zh/notes/guide/pipelines/ReasoningPipeline.md",
                        icon: "mdi:brain",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Text-to-SQL数据合成流水线",
                        link: "/zh/notes/guide/pipelines/Text2SqlPipeline.md",
                        icon: "material-symbols-light:checkbook-outline-rounded",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Doc-to-QA数据合成流水线",
                        link: "/zh/notes/guide/pipelines/Doc2QAPipeline.md",
                        icon: "solar:palette-round-linear",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Agentic RAG数据合成流水线",
                        link: "/zh/notes/guide/pipelines/AgenticRAGPipeline.md",
                        icon: "solar:palette-round-linear",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "RARE数据合成流水线",
                        link: "/zh/notes/guide/pipelines/RAREPipeline.md",
                        icon: "game-icons:great-pyramid",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "知识库清洗流水线",
                        link: "/zh/notes/guide/pipelines/KnowledgeBaseCleaningPipeline.md",
                        icon: "solar:palette-round-linear",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "函数调用数据合成流水线",
                        link: "/zh/notes/guide/pipelines/FuncCallPipeline.md",
                        icon: "solar:flash-drive-outline",
                        activeMatch: '^/guide/'
                    }
                ]
            }

        ]
    },
    // {
    //     text: 'API 文档',
    //     link: '/zh/notes/api/1.home.md',
    //     icon: 'material-symbols:article-outline'
    // },
    {
        text: '多模态指南（飞速施工中）',
        // link: '/zh/notes/mm_guide/basicinfo/intro.md',
        icon: 'material-symbols:article-outline',
        items: [
            {
                text: '基本信息',
                items: [
                            {
                                text: '简介',
                                link: '/zh/notes/mm_guide/basicinfo/intro.md',
                                icon: 'mdi:tooltip-text-outline',
                                activeMatch: '^/guide/'
                            },
                            {
                                text: '框架设计',
                                link: '/zh/notes/mm_guide/basicinfo/framework.md',
                                icon: 'material-symbols:auto-transmission-sharp',
                                activeMatch: '^/guide/'
                            },
                ]
            },
            {
                text: '快速开始',
                items: [
                    {
                        text: '安装',
                        link: '/zh/notes/mm_guide/quickstart/install.md',
                        icon: 'material-symbols-light:download-rounded',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: '快速开始',
                        link: '/zh/notes/mm_guide/quickstart/quickstart.md',
                        icon: 'solar:flag-2-broken',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: '图片生成示例',
                        link: '/zh/notes/mm_guide/quickstart/image_generation.md',
                        icon: 'solar:flag-2-broken',
                        activeMatch: '^/guide/'
                    },
                ]
            }
        ]
    },
    {
        text: '开发者指南',
        icon: "material-symbols:build-outline-sharp",
        // items: [
        //     { text: "PR规范", link: '/zh/notes/dev_guide/pull_request.md' },
        //     { text: "日志", link: '/zh/notes/dev_guide/logging.md' },
        //     { text: "测试用例", link: '/zh/notes/dev_guide/testcase.md' },
        // ]
        link: '/zh/notes/dev_guide/1.index_guide.md',
    },
    // {
    //     text: '笔记',
    //     items: [{ text: '示例', link: '/zh/notes/demo/README.md' }]
    // },
])

