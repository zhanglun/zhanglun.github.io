
import { Client } from '@notionhq/client';
import { getPages as gp } from './src/notion-api/get-pages.mjs';
import { getNotionPageProperties } from './src/transformers/get-page-properties.mjs';
import { getNotionPageTitle } from './src/transformers/get-page-title.mjs';
import { createPost } from './download.mjs';

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
    page.title = getNotionPageTitle(page);

    return page
  })
});