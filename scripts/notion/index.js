const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');
const { getPages } = require('./src/notion-api/get-pages');
const { getNotionPageProperties } = require('./src/transformers/get-page-properties');
const { getNotionPageTitle } = require('./src/transformers/get-page-title');

const dist = path.resolve(process.cwd(), './content/notion');
const token = 'secret_6buUNCr4GKBMmLH6jhICx7tRJvb7iBWf6PtWgrnfmIy';
// const databaseId = 'c505f836d00a407fbd473a5acc7347ac'
const databaseId = '45ab44626c7b4b8d9ecd22c9b70980b5';

console.log('Loaded Source From Notion API');

fs.mkdirSync(dist);

// eslint-disable-next-line no-shadow
const download = async (token, databaseId) => {
  const notionClient = new Client({
    auth: token,
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

      return page;
    })());

    taskList.push(task);
  }

  for (let i = 0; i < taskList.length; i += 1) {
    const task = taskList[i];
    const results = await Promise.all(task);
    pageResults.push(...results);
    console.log(pageResults.length);
  }

  console.log('===> Pages ALL DONE!');

  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i];
    const title = getNotionPageTitle(page);
    const properties = getNotionPageProperties(page);

    let cover = '';

    if (page.cover) {
      cover = page.cover[page.cover?.type]?.url;
    }

    let { markdown } = page;

    const frontmatter = Object.keys(properties).reduce(
      (acc, key) => ({
        ...acc,
        [key]: properties[key]?.value?.remoteImage || properties[key].value,
      }),
      { title },
    );

    frontmatter.cover = cover || '';

    markdown = '---\n'.concat(YAML.stringify(frontmatter)).concat('\n---\n\n').concat(markdown);

    fs.writeFileSync(path.resolve(dist, `${title}.md`), markdown);
  }
};

download(token, databaseId).then(() => {
  console.log('Download Success!');
});
