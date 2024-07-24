/**
 *
 * @type {import('@storybook/react-vite').StorybookConfig}
 */
module.exports = {
  framework: {
    name: "@storybook/react-vite",
  },
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],

  docs: {
    autodocs: true
  },

  addons: ['storybook-addon-remix-react-router', '@storybook/addon-actions', "@storybook/addon-links"]
}