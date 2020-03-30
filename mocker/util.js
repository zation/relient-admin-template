import { random } from 'faker';

export const pagination = (query) => (content) => {
  const size = Number(query.size);
  const page = Number(query.page);
  return {
    size,
    content: content.slice(page * size, (page + 1) * size),
    number: page,
    totalPages: random.number(),
    totalElements: content.length,
    sort: {
      sorted: false,
      unsorted: true,
    },
  };
};
export default () => {};
