import { Client } from '@notionhq/client';

const token = 'secret_6buUNCr4GKBMmLH6jhICx7tRJvb7iBWf6PtWgrnfmIy';
const databaseId = '45ab44626c7b4b8d9ecd22c9b70980b5';
const token_v2 = '108552dce9ab3f90921510d7ec7547211b4b92df3570ac96e37b8901d44c051c5ec3e378e869fa5419075b88aa08bad8abb468463684f9883c947000ccd928a2924d405b7032cc231d18da13d397';

export const createDatabaseClient = () => {
  const notionClient = new Client({
    auth: token,
  });

  return notionClient;
}

export const getPages = async (notionClient, databaseId: string) => {
  let hasMore = true;
  let startCursor = '';
  const pages = [];

  while (hasMore) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await notionClient.databases.query({
        database_id: databaseId,
        start_cursor: startCursor || undefined,
        filter: {
          property: 'status',
          select: {
            equals: 'publish',
          },
        },
      });

      startCursor = result.next_cursor;
      hasMore = result.has_more;

      for (let i = 0; i < result.results.length; i += 1) {
        const page = result.results[i];
        page.markdown = '';
        pages.push(page);
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  return pages;
};
