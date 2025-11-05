import { Account } from '../Classes/Account';

const accounts: Map<string, Account> = new Map();

export const saveAccount = (account: Account): void => {
    accounts.set(account.getUser().getMemberId(), account);
};

export const findAccountByMemberId = (memberId: string): Account | undefined => {
    return accounts.get(memberId);
};

export const findAllAccounts = (): Account[] => {
    return Array.from(accounts.values());
};

export const removeAccount = (memberId: string): boolean => {
    return accounts.delete(memberId);
};