import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CircleArrow, CircleArrowThemeEnum } from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/CircleArrow',
  component: CircleArrow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof CircleArrow>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// eslint-disable-next-line react/jsx-props-no-spreading
const Template: ComponentStory<typeof CircleArrow> = (args) => <CircleArrow {...args} />;

export const Default = Template.bind({});

Default.args = {
  size: 24,
  rotate: 0,
  theme: CircleArrowThemeEnum.dark,
};

export const Theme = Template.bind({
});

Theme.args = {
  theme: CircleArrowThemeEnum.dark,
};

export const Rotate = Template.bind({
});

Rotate.args = {
  rotate: 0,
  size: 24,
};
