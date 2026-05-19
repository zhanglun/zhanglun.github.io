const createQuery = async (notionClient, databaseOrDataSourceId) => {
  if (notionClient.dataSources?.query) {
    try {
      const database = await notionClient.databases.retrieve({
        database_id: databaseOrDataSourceId,
      });
      const [dataSource] = database.data_sources || [];

      if (!dataSource?.id) {
        throw new Error(
          `No data source found for database ${databaseOrDataSourceId}`
        );
      }

      return params =>
        notionClient.dataSources.query({
          data_source_id: dataSource.id,
          ...params,
        });
    } catch (databaseError) {
      try {
        await notionClient.dataSources.retrieve({
          data_source_id: databaseOrDataSourceId,
        });

        return params =>
          notionClient.dataSources.query({
            data_source_id: databaseOrDataSourceId,
            ...params,
          });
      } catch {
        throw databaseError;
      }
    }
  }

  if (notionClient.databases?.query) {
    return params =>
      notionClient.databases.query({
        database_id: databaseOrDataSourceId,
        ...params,
      });
  }

  throw new Error(
    'Notion client does not support databases.query or dataSources.query'
  );
};

export const getPages = async (notionClient, databaseId) => {
  let hasMore = true;
  let startCursor = '';
  const pages = [];
  const query = await createQuery(notionClient, databaseId);

  while (hasMore) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await query({
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
      console.error(e instanceof Error ? e.message : String(e));
      throw e;
    }
  }

  return pages;
};
