import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const generateFrom = ['item1', 'item2', 'item3'];
  const resultList = {
    value: 'item1',
    next: {
      value: 'item2',
      next: {
        value: 'item3',
        next: {
          value: null,
          next: null,
        },
      },
    },
  };

  test('should generate linked list from values 1', () => {
    expect(generateLinkedList(generateFrom)).toStrictEqual(resultList);
  });

  test('should generate linked list from values 2', () => {
    expect(generateLinkedList(generateFrom)).toMatchSnapshot();
  });
});
