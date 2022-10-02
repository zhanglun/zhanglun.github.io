import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';
import { PageHero } from '../components/PageHero';

function About({ data, location }) {
  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';

  return (
    <Layout
      location={location}
      title={siteTitle}
      menu={siteMenu}
      description={description}
    >
      <Seo title="张伦 实验室" />
      <div>
        <PageHero title="实验室" subTitle="各种奇思妙想的实验" />
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
