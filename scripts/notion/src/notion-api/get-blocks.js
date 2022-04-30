const { errorMessage } = require('../error-message');

exports.getBlocks = async (notionClient, blockId, reporter) => {
  let hasMore = true;
  let blockContent = [];

  while (hasMore) {
    try {
      const result = await notionClient.blocks.children.list({
        block_id: blockId,
        page_size: 100,
      });

      for (const childBlock of result.results) {
        if (childBlock.has_children) {
          childBlock.children = await this.getBlocks(notionClient, childBlock.id, reporter);
        }
      }

      blockContent = blockContent.concat(result.results);

      hasMore = result.has_more;
    } catch (e) {
      reporter.panic(errorMessage);
    }
  }

  return blockContent;
};
