/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export const enNavbar = defineNavbarConfig([
    // { text: 'Home', link: '/' },
    // { text: 'Blog', link: '/blog/' },
    // { text: 'Tags', link: '/blog/tags/' },
    // { text: 'Archives', link: '/blog/archives/' },
    {
        text: 'Guide',
        // link: '/en/guide/',
        icon: 'icon-park-outline:guide-board',
        items: [

            {
                text: 'Basic Info',
                items: [
                    {
                        text: 'Introduction',
                        link: '/en/notes/guide/basicinfo/intro.md',
                        icon: 'mdi:tooltip-text-outline',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: 'Framework Design',
                        link: '/en/notes/guide/basicinfo/framework.md',
                        icon: 'material-symbols:auto-transmission-sharp',
                        activeMatch: '^/guide/'
                    },
                ]
            },
            {
                text: 'Start with Dataflow',
                items: [
                    {
                        text: 'Installation',
                        link: '/en/notes/guide/quickstart/install.md',
                        icon: 'material-symbols-light:download-rounded',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: 'Quick Start',
                        link: '/en/notes/guide/quickstart/quickstart.md',
                        icon: 'solar:flag-2-broken',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: 'Case: PromptedGenerator',
                        link: '/en/notes/guide/quickstart/translation.md',
                        icon: 'basil:lightning-alt-outline',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: 'Case: Batch PDF Extracting',
                        link: '/en/notes/guide/quickstart/knowledge_cleaning.md',
                        icon: 'basil:lightning-alt-outline',
                        activeMatch: '^/guide/'
                    }
                ]
            },
            {
                text: "Pipelines",
                items: [{
                        text: "Text Pipeline",
                        link: '/en/notes/guide/pipelines/TextPipeline.md',
                        icon: 'mdi:file-text',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Reasoning Pipeline",
                        link: "/en/notes/guide/pipelines/ReasoningPipeline.md",
                        icon: "mdi:brain",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Text-to-SQL Pipeline",
                        link: "/en/notes/guide/pipelines/Text2SqlPipeline.md",
                        icon: "material-symbols-light:checkbook-outline-rounded",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Doc-to-QA Pipeline",
                        link: "/en/notes/guide/pipelines/Doc2QAPipeline.md",
                        icon: "solar:palette-round-linear",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Agentic RAG Pipeline",
                        link: "/en/notes/guide/pipelines/AgenticRAGPipeline.md",
                        icon: "solar:palette-round-linear",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "RARE Pipeline",
                        link: "/en/notes/guide/pipelines/RAREPipeline.md",
                        icon: "game-icons:great-pyramid",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Knowledge Base Cleaning Pipeline",
                        link: "/en/notes/guide/pipelines/KnowledgeBaseCleaningPipeline.md",
                        icon: "solar:palette-round-linear",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Function Calling Data Synthesis Pipeline",
                        link: "/en/notes/guide/pipelines/FuncCallPipeline.md",
                        icon: "solar:flash-drive-outline",
                        activeMatch: '^/guide/'
                    }
                ]
            }
        ]
    },
    // {
    //     text: 'API Reference',
    //     link: '/en/notes/api/1.home.md',
    //     icon: 'material-symbols:article-outline'
    // },
    {
        text: 'Multi-Modal Guide (Under Construction)',
        // link: '/en/notes/mm_guide/basicinfo/intro.md',
        icon: 'material-symbols:article-outline',
        items: [

            {
                text: 'Basic Info',
                items: [
                    {
                        text: 'Introduction',
                        link: '/en/notes/mm_guide/basicinfo/intro.md',
                        icon: 'mdi:tooltip-text-outline',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: 'Framework Design',
                        link: '/en/notes/mm_guide/basicinfo/framework.md',
                        icon: 'material-symbols:auto-transmission-sharp',
                        activeMatch: '^/guide/'
                    },
                ]
            },
            {
                text: 'Start with Dataflow',
                items: [
                    {
                        text: 'Installation',
                        link: '/en/notes/mm_guide/quickstart/install.md',
                        icon: 'material-symbols-light:download-rounded',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: 'Quick Start',
                        link: '/en/notes/mm_guide/quickstart/quickstart.md',
                        icon: 'solar:flag-2-broken',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: 'Image Generation',
                        link: '/en/notes/mm_guide/quickstart/image_generation.md',
                        icon: 'solar:flag-2-broken',
                        activeMatch: '^/guide/'
                    },
                ]
            }
        ]
    },
    {
        text: 'Developer Guide',
        icon: "material-symbols:build-outline-sharp",
        link: '/en/notes/dev_guide/1.index_guide.md',
    },
])
