import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import fsSync from 'fs';
import fs from 'fs/promises';
import path from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // Will reset after each test case due to "restoreAll: true" in jest.config.js
    jest.spyOn(global, 'setTimeout');
  });

  const timeout = 1000;

  test('should set timeout with provided callback and timeout', () => {
    const timeoutCallbackSpy = jest.fn();
    doStuffByTimeout(timeoutCallbackSpy, timeout);
    expect(setTimeout).toBeCalledWith(timeoutCallbackSpy, timeout);
  });

  test('should call callback only after timeout', () => {
    const timeoutCallbackSpy = jest.fn();
    doStuffByTimeout(timeoutCallbackSpy, timeout);
    expect(timeoutCallbackSpy).not.toBeCalled();
    jest.runAllTimers();
    expect(timeoutCallbackSpy).toBeCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // Will reset afterEach due to "restoreAll: true" in jest.config.js
    jest.spyOn(global, 'setInterval');
  });

  const interval = 1000;

  test('should set interval with provided callback and timeout', () => {
    const intervalCallbackSpy = jest.fn();
    doStuffByInterval(intervalCallbackSpy, interval);
    expect(setInterval).toBeCalledWith(intervalCallbackSpy, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const intervalCallbackSpy = jest.fn();
    doStuffByInterval(intervalCallbackSpy, interval);
    for (let i = 1; i <= 100; i++) {
      jest.runOnlyPendingTimers();
      expect(intervalCallbackSpy).toBeCalledTimes(i);
    }
  });
});

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

const mockedFsSync = jest.mocked(fsSync);
const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);

describe('readFileAsynchronously', () => {
  // Mocked modules are scoped within the file that calls jest.mock
  // No need for jest.unmock()
  afterAll(() => {
    jest.unmock('fs');
    jest.unmock('fs/promises');
    jest.unmock('path');
  });

  const filePath = '/there/is/no/such/path';
  const fileContent = 'content';

  beforeEach(() => {
    // Will reset afterEach due to "restoreAll: true" in jest.config.js
    mockedFs.readFile.mockResolvedValue(fileContent);
  });

  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(filePath);
    const args = mockedPath.join.mock.lastCall;
    expect(args).toContain(filePath);
  });

  test('should return null if file does not exist', async () => {
    mockedFsSync.existsSync.mockReturnValueOnce(false);
    await expect(readFileAsynchronously(filePath)).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    mockedFsSync.existsSync.mockReturnValueOnce(true);
    await expect(readFileAsynchronously(filePath)).resolves.toBe(fileContent);
  });
});
