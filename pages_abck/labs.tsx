import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';
import { PageHero } from '../components/PageHero';
import { ProjectCards } from '../components/ProjectCards';

function About({ data, location }: any) {
  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';

  const projects = [
    {
      name: 'Lettura',
      description: '基于 Tauri 的跨平台 RSS 桌面阅读器',
      url: 'https://github.com/zhanglun/lettura',
      thumbnail: '',
    },
    {
      name: 'Gatsby blog theme',
      description: '为Gatsby.js创建的个人博客主题',
      url: 'https://github.com/zhanglun/gatsby-theme-facile',
    },
    {
      name: 'Pavo',
      description: '跨平台的桌面壁纸程序',
      url: 'https://github.com/zhanglun/pavo',
    },
    // {
    //   name: 'notify',
    //   description: 'Notify Component',
    //   url: 'https://github.com/zhanglun/notify',
    // },
    // {
    //   name: 'hexo-theme-Tinny',
    //   description: 'A theme for Hexo',
    //   url: 'https://github.com/zhanglun/hexo-theme-Tinny',
    // },
    // {
    //   name: 'bluerobin',
    //   description: 'online todo list based on Vue ecosystem',
    //   url: 'https://github.com/zhanglun/bluerobin',
    // },
  ];

  return (
    <Layout
      location={location}
      title={siteTitle}
      menu={siteMenu}
      description={description}
    >
      <Seo title="张伦 实验室" />
      <div className="lab-page">
        <PageHero title="实验室" subTitle="各种奇思妙想的实验" />
        <ProjectCards
          list={projects}
        />
      </div>
    </Layout>
  );
}

export default About;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        menu {
          id
          name
          url
        }
      }
    }
  }
`;
