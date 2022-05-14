exports.getPages = async (notionClient, databaseId) => {
  let hasMore = true;
  let startCursor = '';
  const pages = [];

  while (hasMore) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await notionClient.databases.query({
        database_id: databaseId,
        start_cursor: startCursor || undefined,
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
