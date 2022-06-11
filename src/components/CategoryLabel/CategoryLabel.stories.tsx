import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CategoryLabel } from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/CategoryLabel',
  component: CategoryLabel,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof CategoryLabel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// eslint-disable-next-line react/jsx-props-no-spreading
const Template: ComponentStory<typeof CategoryLabel> = (args) => <CategoryLabel {...args} />;

export const Default = Template.bind({});

Default.args = {
  size: 24,
  rotate: 0,
  theme: 'dark',
};

export const Theme = Template.bind({
});

Theme.args = {
  theme: 'dark',
};

export const Rotate = Template.bind({
});

Rotate.args = {
  rotate: 0,
  size: 24,
};
