const axios = require('axios');
import parseRss from './parser';

const addPostsId = (content) => {
  const { posts, ...rest } = content;
  const postsWithId = posts.map((post) => {
    post.id = Math.random();
    return post;
  });

  return { posts: postsWithId, ...rest };
};

const proxyRequest = (url) => {
  const allOriginsUrl = new URL('get', 'https://allorigins.hexlet.app');
  allOriginsUrl.searchParams.set('disableCache', true);
  allOriginsUrl.searchParams.set('url', url);
  return axios.get(allOriginsUrl);
};

const getContent = (url) => {
  return proxyRequest(url)
    .then((response) => response.data)
    .then((data) => ({ url, ...addPostsId(parseRss(data.contents)) }))
    .catch((error) => {
      console.error(error);
      if (error.message.startsWith('Parse error')) {
        throw new Error('parseError');
      }
      if (error.message.startsWith('Network Error')) {
        throw new Error('networkError');
      }
      throw error;
    });
};

export default getContent;
