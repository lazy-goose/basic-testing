import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');
  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    // Mocked modules are scoped within the file that calls jest.mock
    // No need for jest.unmock()
    jest.unmock('./index');
  });

  beforeEach(() => {
    // Will be reset after each test case due to "restoreAll: true" in jest.config.js
    jest.spyOn(console, 'log').getMockImplementation();
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    mockOne();
    mockTwo();
    mockThree();
    expect(console.log).not.toBeCalled();
  });

  test('unmockedFunction should log into console', () => {
    unmockedFunction();
    expect(console.log).toBeCalled();
  });
});
