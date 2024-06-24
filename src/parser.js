const parseRss = (data) => {
  const parser = new DOMParser();
  const rss = parser.parseFromString(data, 'application/xml');
  const parseErrorNode = rss.querySelector('parsererror');
  if (parseErrorNode) {
    const errorText = `Parse error: ${parseErrorNode.textContent}`;
    throw new Error(errorText);
  }

  const items = rss.querySelectorAll('item');
  const feedTitle = rss.querySelector('channel > title').textContent;
  const feedDescription = rss.querySelector('channel > description').textContent;

  const posts = [...items].reduce((acc, item) => {
    const postTitle = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;
    return [
      ...acc,
      {
        title: postTitle,
        description: postDescription,
        link,
      },
    ];
  }, []);

  return { title: feedTitle, description: feedDescription, posts };
};

export default parseRss;
