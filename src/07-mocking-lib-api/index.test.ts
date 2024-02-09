import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

// I guess it should be exported from './index'
const BASE_URL = 'https://jsonplaceholder.typicode.com';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    // Mocked modules are scoped within the file that calls jest.mock
    // No need for jest.unmock()
    jest.unmock('axios');
    jest.useRealTimers();
  });

  beforeEach(() => {
    // AxiosInstance extends interface Axios but is not an actual instance
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValue(successResponseData);
  });

  afterEach(() => {
    jest.runAllTimers();
    // No need to restore due to "restoreMocks: true" flag in jest.config.js
    jest.restoreAllMocks();
  });

  const successResponseData = {
    data: 'Fake Data',
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
    request: {},
  };
  const urlPath = 'nonExistingPath';

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(urlPath);
    expect(axios.create).toBeCalledWith({ baseURL: BASE_URL });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(urlPath);
    expect(axios.get).toBeCalledWith(urlPath);
  });

  test('should return response data', async () => {
    await expect(throttledGetDataFromApi(urlPath)).resolves.toBe(
      successResponseData.data,
    );
  });
});
