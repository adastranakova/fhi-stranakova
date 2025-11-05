import { Request, Response } from 'express';
import { User } from '../Classes/User';
import { Account } from '../Classes/Account';
import { saveAccount, findAccountByMemberId, findAllAccounts, removeAccount } from '../Storage/user.storage';

export const getAllUsers = (req: Request, res: Response): void => {
    const accounts = findAllAccounts();
    const users = accounts.map(acc => ({
        ...acc.getUser(),
        balance: acc.getBalance(),
        hasActiveRental: acc.hasActiveRental()
    }));
    res.json(users);
};

export const getUserById = (req: Request, res: Response): void => {
    // @ts-ignore
    const account = findAccountByMemberId(req.params.id);
    if (account) {
        res.json({
            ...account.getUser(),
            balance: account.getBalance(),
            hasActiveRental: account.hasActiveRental()
        });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

export const createUser = (req: Request, res: Response): void => {
    const { name, email, memberId } = req.body;

    if (!name || !email || !memberId) {
        res.status(400).json({ error: 'Name, email, and memberId are required' });
        return;
    }

    if (findAccountByMemberId(memberId)) {
        res.status(400).json({ error: 'User already exists' });
        return;
    }

    const user = new User(name, email, memberId);
    const account = new Account(user);
    saveAccount(account);
    res.status(201).json({ ...user, balance: 0 });
};

export const addFundsToUser = (req: Request, res: Response): void => {
    // @ts-ignore
    const account = findAccountByMemberId(req.params.id);
    const { amount } = req.body;

    if (!account) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Valid amount is required' });
        return;
    }

    account.addFunds(amount);
    res.json({ balance: account.getBalance() });
};

export const deleteUserById = (req: Request, res: Response): void => {
    // @ts-ignore
    const deleted = removeAccount(req.params.id);
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};