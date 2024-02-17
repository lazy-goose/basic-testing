import { simpleCalculator as calc, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(calc({ a: 1, b: 2, action: Action.Add })).toBe(3);
  });

  test('should subtract two numbers', () => {
    expect(calc({ a: 1, b: 2, action: Action.Subtract })).toBe(-1);
  });

  test('should multiply two numbers', () => {
    expect(calc({ a: 1, b: 2, action: Action.Multiply })).toBe(2);
  });

  test('should divide two numbers', () => {
    expect(calc({ a: 10.1, b: 10, action: Action.Divide })).toBeCloseTo(1.01);
  });

  test('should exponentiate two numbers', () => {
    expect(calc({ a: 2, b: 8, action: Action.Exponentiate })).toBe(256);
  });

  test('should return null for invalid action', () => {
    const FakeAction = '**';
    expect(calc({ a: 1, b: 2, action: FakeAction })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const InvalidArguments = [
      ['10', 10],
      [10, '10'],
      [true, 10],
      [10, true],
      // ...
    ];
    for (const [a, b] of InvalidArguments) {
      for (const action of Object.values(Action)) {
        expect(calc({ a, b, action })).toBeNull();
      }
    }
  });

  test('> What about NaN <', () => {
    expect(calc({ a: NaN, b: 10, action: Action.Add })).toBeNaN();
    expect(calc({ a: 10, b: NaN, action: Action.Add })).toBeNaN();
  });
});
