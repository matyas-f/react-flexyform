import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/*.stories.@(js|jsx|mjs|ts|tsx)', '../stories/**/*.mdx'],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-docs',
      options: {
        jsxOptions: {},
        csfPluginOptions: null,
        mdxPluginOptions: {},
        transcludeMarkdown: true,
      },
    },
    {
      name: '@storybook/addon-essentials',
      options: {
        measure: false,
        outline: false,
        controls: false,
        actions: false,
        backgrounds: false,
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: false,
  },
  core: {
    disableTelemetry: true,
  },
}
export default config
