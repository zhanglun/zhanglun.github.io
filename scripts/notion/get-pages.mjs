
import { Client } from '@notionhq/client';
import { getPages as gp } from './src/notion-api/get-pages.mjs';
import { getNotionPageProperties } from './src/transformers/get-page-properties.mjs';
import { getNotionPageTitle } from './src/transformers/get-page-title.mjs';

const token = 'secret_6buUNCr4GKBMmLH6jhICx7tRJvb7iBWf6PtWgrnfmIy';
const databaseId = '45ab44626c7b4b8d9ecd22c9b70980b5';

console.log('Loaded Source From Notion API');
// eslint-disable-next-line no-shadow
const download = async (token, databaseId) => {
  const notionClient = new Client({
    auth: token,
  });

  const pages = await gp(notionClient, databaseId);

  console.log('===> Page Total：%s', pages.length);

  return pages;
};

export const getPages = () => download(token, databaseId).then((pages) => {
  console.log('Download Success!');

  return pages.map(page => {
    const title = getNotionPageTitle(page);
    const properties = getNotionPageProperties(page);

    let cover = '';

    if (page.cover) {
      cover = page.cover[page.cover?.type]?.url;
    }

    let frontmatter = Object.keys(properties).reduce(
      (acc, key) => ({
        ...acc,
        [key]: properties[key]?.value?.remoteImage || properties[key].value,
      }),
      { title },
    );

    frontmatter = {
      ...frontmatter,
      categories: frontmatter.categories.name,
      tags: frontmatter.tags.reduce((acu, cur) => {
        acu.push(cur.name);
        return acu;
      }, []),
      date: frontmatter?.date?.start,
      cover: cover || '',
      status: frontmatter?.status?.name,
    };

    page.frontmatter = frontmatter;

    return page
  })
});