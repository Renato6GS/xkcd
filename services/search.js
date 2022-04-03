import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('LKLRI4QTYT', '78e25dba645444b069b1e4fac10f0c30');
const index = client.initIndex('prod_comics');

export const search = async ({ query }) => {
  const { hits } = await index.search(query, {
    attributesToRetrieve: ['id', 'title', 'img', 'alt'],
    hitsPerPage: 10,
  });

  return { results: hits };
};
