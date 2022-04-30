exports.getNotionPageCover = (page) => {
  if (page.cover) {
    return page.cover[page.cover?.type].url;
  }

  return '';
};
