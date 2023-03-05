import { blockToString } from '../block-to-string.mjs';

export const getNotionPageTitle = (page) => {
  const titleProperty = Object.keys(page.properties).find(
    (key) => page.properties[key].type === 'title',
  );

  return blockToString(page.properties[titleProperty].title);
};
