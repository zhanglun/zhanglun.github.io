import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import YAML from 'yaml'
import { getPages } from './src/notion-api/get-pages.mjs'
import { getNotionPageProperties } from './src/transformers/get-page-properties.mjs'
import { getNotionPageTitle } from './src/transformers/get-page-title.mjs'
import { createPost } from './download.mjs'

const token = 'secret_6buUNCr4GKBMmLH6jhICx7tRJvb7iBWf6PtWgrnfmIy';
const databaseId = '45ab44626c7b4b8d9ecd22c9b70980b5';

console.log('Loaded Source From Notion API');

const formatContentAndCreate = (page) => {
  const title = getNotionPageTitle(page);
  const properties = getNotionPageProperties(page);

  let { markdown } = page;
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

  markdown = '---\n'.concat(YAML.stringify(frontmatter)).concat('\n---\n\n').concat(markdown);

  createPost(title, markdown);
};

// eslint-disable-next-line no-shadow
const download = async (token, databaseId) => {
  const notionClient = new Client({
    auth: token,
    // notionVersion: '2021-05-13',
  });
  const n2m = new NotionToMarkdown({ notionClient });
  const pages = await getPages(notionClient, databaseId);

  console.log('===> Page Total：%s', pages.length);

  const limit = 5;
  const taskList = [];
  const pageResults = [];

  for (let i = 0; i < pages.length; i += limit) {
    const task = pages.slice(i, i + limit).map((page) => (async () => {
      console.time(`Read page ${page.id}`);

      const content = await n2m.pageToMarkdown(page.id);

      console.timeEnd(`Read page ${page.id}`);

      page.markdown = n2m.toMarkdownString(content);

      formatContentAndCreate(page);

      return page;
    })());

    taskList.push(task);
  }

  for (let i = 0; i < taskList.length; i += 1) {
    const task = taskList[i];
    // eslint-disable-next-line no-await-in-loop
    const results = await Promise.all(task);
    pageResults.push(...results);
  }

  console.log('===> Pages ALL DONE! taskList length is ', taskList.length);
};

download(token, databaseId).then(() => {
  console.log('Download Success!');
});
