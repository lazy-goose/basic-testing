import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  getBankAccount,
} from './index';
import lodash from 'lodash';

describe('BankAccount', () => {
  let bankAccount: BankAccount;
  let initBalance: number;

  beforeEach(() => {
    initBalance = 10;
    bankAccount = getBankAccount(initBalance);
  });

  afterEach(() => {
    // No need to restore due to "restoreMocks: true" flag in jest.config.js
    jest.restoreAllMocks();
  });

  test('should create account with initial balance', () => {
    expect(bankAccount.getBalance()).toBe(initBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => bankAccount.withdraw(initBalance + 1)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const toBankAccount = getBankAccount(0);
    expect(() =>
      bankAccount.transfer(initBalance + 1, toBankAccount),
    ).toThrowError();
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => bankAccount.transfer(initBalance, bankAccount)).toThrowError();
  });

  test('should deposit money', () => {
    const deposit = 10;
    bankAccount.deposit(deposit);
    expect(bankAccount.getBalance()).toBe(initBalance + deposit);
  });

  test('should withdraw money', () => {
    const withdraw = 5;
    bankAccount.withdraw(withdraw);
    expect(bankAccount.getBalance()).toBe(initBalance - withdraw);
  });

  test('should transfer money', () => {
    const transfer = 5;
    const toBankAccount = getBankAccount(0);
    bankAccount.transfer(transfer, toBankAccount);
    expect(bankAccount.getBalance()).toBe(initBalance - transfer);
    expect(toBankAccount.getBalance()).toBe(transfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const fetchBalanceReturn = 15;
    const randomValueThatCausesSuccess = 1;
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(fetchBalanceReturn)
      .mockReturnValueOnce(randomValueThatCausesSuccess);
    const balance = await bankAccount.fetchBalance();
    // - Any number
    expect(balance).toEqual(expect.any(Number));
    // - or exactly 'fetchBalance' return value
    expect(balance).toBe(fetchBalanceReturn);
  });

  test('synchronizeBalance should set new balance if fetchBalance returned number', async () => {
    const fetchBalanceReturn = 15;
    jest
      .spyOn(bankAccount, 'fetchBalance')
      .mockResolvedValue(fetchBalanceReturn);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(fetchBalanceReturn);
  });

  test('synchronizeBalance should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const fetchBalanceReturn = null;
    jest
      .spyOn(bankAccount, 'fetchBalance')
      .mockResolvedValue(fetchBalanceReturn);
    //           -> or bankAccount.synchronizeBalance.bind(bankAccount)...
    await expect(() => bankAccount.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
