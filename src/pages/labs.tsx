import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';
import { PageHero } from '../components/PageHero';

function About({ data, location }) {
  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';

  const projects = [
    {
      name: 'Lettura',
      description: 'RSS 桌面阅读器',
      url: 'https://github.com/zhanglun/lettura',
      thumbnail: '',
    },
    {
      name: 'Gatsby blog theme',
      description: 'Person blog theme for Gatsby.js',
      url: 'https://github.com/zhanglun/gatsby-starter-blog',
    },
    {
      name: 'notify',
      description: 'Notify Component',
      url: 'https://github.com/zhanglun/notify',
    },
    {
      name: 'hexo-theme-Tinny',
      description: 'A theme for Hexo',
      url: 'https://github.com/zhanglun/hexo-theme-Tinny',
    },
    {
      name: 'bluerobin',
      description: 'online todo list based on Vue ecosystem',
      url: 'https://github.com/zhanglun/bluerobin',
    },
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
        <div>
          {
          projects.map((project) => (
            <div>
              <p>{project.name}</p>
              <p>{project.description}</p>
            </div>
          ))
        }
        </div>
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
