import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory, ComponentMeta } from '@storybook/react';

// @ts-ignores
import { siteMetadata } from '../../../gatsby-config.js';
import { SideMenu } from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/SideMenu',
  component: SideMenu,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SideMenu>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// eslint-disable-next-line react/jsx-props-no-spreading
const Template: ComponentStory<typeof SideMenu> = (args) => <SideMenu {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: siteMetadata.title,
  menu: siteMetadata.menu,
};
