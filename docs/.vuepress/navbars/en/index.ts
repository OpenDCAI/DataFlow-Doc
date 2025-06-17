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
                text: 'Quick Start',
                items: [
                    {
                        text: 'Installation',
                        link: '/en/notes/guide/quickstart/install.md',
                        icon: 'material-symbols-light:download-rounded',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Text Pipeline",
                        link: '/en/notes/guide/quickstart/TextPipeline.md',
                        icon: 'mdi:file-text',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Reasoning Pipeline",
                        link: "/en/notes/guide/quickstart/ReasoningPipeline.md",
                        icon: "mdi:brain",
                        activeMatch: '^/guide/'
                    },
                    {
                        text: "Text-to-SQL Pipeline",
                        link: "/en/notes/guide/quickstart/Text2SqlPipeline.md",
                        icon: "material-symbols-light:checkbook-outline-rounded",
                        activeMatch: '^/guide/'
                    },
                ]
            },
        ]
    },
    {
        text: 'API Reference',
        link: '/en/notes/api/1.home.md',
        icon: 'material-symbols:article-outline'
    },
    {
        text: 'Developer Guide',
        icon: "material-symbols:build-outline-sharp",
        link: '/en/notes/dev_guide/1.index_guide.md',
    },
])
