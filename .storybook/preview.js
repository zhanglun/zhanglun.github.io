import '../src/style.css';
import { themes } from '@storybook/theming';
import {CodeBlock} from './CodeBlock';

global.__BASE_PATH__ = "/"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    components: {
      code: CodeBlock,
    },
  },
}