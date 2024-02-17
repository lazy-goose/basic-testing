import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const objectRef = { uniqueObject: true };
    await expect(resolveValue(objectRef)).resolves.toBe(objectRef);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const message = '@CustomErrorMessage';
    // Test exact error message
    expect(() => throwError(message)).toThrowError(new Error(message));
  });

  test('should throw error with default message if message is not provided', () => {
    // - Default Error message matches last automatically saved one
    expect(throwError).toThrowErrorMatchingSnapshot();
    // - or Default Error message contains following string
    expect(throwError).toThrowError('Oops!');
    // - or Default Error message has minLength of 5
    expect(throwError).toThrowError(/^.{5,}$/);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(throwCustomError).toThrowError(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    // - Capture CustomError using reject
    await expect(rejectCustomError).rejects.toThrow(MyAwesomeError);
    // - or using `try/catch`; expect.assertions(1)
    expect.assertions(1 + 1);
    try {
      await rejectCustomError();
    } catch (e) {
      expect(e).toBeInstanceOf(MyAwesomeError);
    }
  });
});
