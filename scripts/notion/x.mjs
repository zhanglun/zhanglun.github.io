import { NotionAPI } from "notion-client";

const token = 'secret_6buUNCr4GKBMmLH6jhICx7tRJvb7iBWf6PtWgrnfmIy';
const databaseId = '45ab44626c7b4b8d9ecd22c9b70980b5';
const token_v2 = '108552dce9ab3f90921510d7ec7547211b4b92df3570ac96e37b8901d44c051c5ec3e378e869fa5419075b88aa08bad8abb468463684f9883c947000ccd928a2924d405b7032cc231d18da13d397';

console.log('Loaded Source From Notion API');

// eslint-disable-next-line no-shadow
const scanDatabase = async (token, databaseId) => {
  const notionClient = new NotionAPI({
    authToken: token_v2,
    activeUser: "be00fb06-ddc2-46a2-93d7-baa66edf4880"
  });

  console.log(notionClient);
  // const pages = await getPages(notionClient, databaseId);
  //
  const database = await notionClient.getPage(databaseId);
  const pages = Object.keys(database.block).map((key) => {
    return { id: key }
  });

  console.log(pages);

  console.log('===> Page Total：%s', pages.length);

  const limit = 5;
  const taskList = [];
  const pageResults = [];

  for (let i = 0; i < pages.length; i += limit) {
    const task = pages.slice(i, i + limit).map((page) => (async () => {
      console.time(`Read page ${page.id}`);

      const recordMap = await notionClient.getPage(page.id);

      console.log('recordMap', recordMap);
      console.timeEnd(`Read page ${page.id}`);

      // page.markdown = n2m.toMarkdownString(content);
      //
      // formatContentAndCreate(page);

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

scanDatabase(token, databaseId).then(() => {
  console.log('Download Success!');
});
