import { NotionAPI } from 'notion-client'

export const rootNotionPageId = '067dd719a912471ea9a3ac10710e7fdf'

const notion = new NotionAPI();

export const getNotionInTime = async () => {
  const res = await notion.getPage(rootNotionPageId);
  return Object.values(res);
}