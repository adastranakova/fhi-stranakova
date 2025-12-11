import { Request, Response } from 'express';
import * as userRepo from '../repositories/user.repository';
import * as rentalRepo from '../repositories/rental.repository';

export const getAllUsers = (req: Request, res: Response): void => {
    const users = userRepo.findAllUsers();

    const usersData = users.map(user => ({
        memberId: user.memberId,
        name: user.name,
        email: user.email,
        balance: user.balance,
        hasActiveRental: rentalRepo.userHasActiveRental(user.id)
    }));

    res.json(usersData);
};

export const getUserById = (req: Request, res: Response): void => {
    const { id } = req.params; // This is memberId

    if (!id) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    const user = userRepo.findUserByMemberId(id);

    if (user) {
        res.json({
            memberId: user.memberId,
            name: user.name,
            email: user.email,
            balance: user.balance,
            hasActiveRental: rentalRepo.userHasActiveRental(user.id)
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

    if (userRepo.userExistsByMemberId(memberId)) {
        res.status(400).json({ error: 'User with this member ID already exists' });
        return;
    }

    if (userRepo.userExistsByEmail(email)) {
        res.status(400).json({ error: 'User with this email already exists' });
        return;
    }

    const user = userRepo.createUser(memberId, name, email);

    res.status(201).json({
        memberId: user.memberId,
        name: user.name,
        email: user.email,
        balance: user.balance
    });
};

export const updateUser = (req: Request, res: Response): void => {
    const { id } = req.params; // This is memberId
    const { name, email } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    const user = userRepo.findUserByMemberId(id);

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // kontrola, ci nemenime mail na ten isty
    if (email && email !== user.email && userRepo.userExistsByEmail(email)) {
        res.status(400).json({ error: 'Email already in use' });
        return;
    }

    const updates: { name?: string; email?: string } = {};
    if (name && name !== user.name) updates.name = name;
    if (email && email !== user.email) updates.email = email;

    if (Object.keys(updates).length === 0) {
        res.json({
            memberId: user.memberId,
            name: user.name,
            email: user.email,
            balance: user.balance
        });
        return;
    }

    const updatedUser = userRepo.updateUser(user.id, updates);

    if (updatedUser) {
        res.json({
            memberId: updatedUser.memberId,
            name: updatedUser.name,
            email: updatedUser.email,
            balance: updatedUser.balance
        });
    } else {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// ===================================
// ADD FUNDS
// ===================================
export const addFundsToUser = (req: Request, res: Response): void => {
    const { id } = req.params; //memberId
    const { amount } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Valid amount is required' });
        return;
    }

    const user = userRepo.findUserByMemberId(id);

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    const updatedUser = userRepo.addFunds(user.id, amount);

    if (updatedUser) {
        res.json({ balance: updatedUser.balance });
    } else {
        res.status(500).json({ error: 'Failed to add funds' });
    }
};


export const deductFundsFromUser = (req: Request, res: Response): void => {
    const { id } = req.params; //memberId
    const { amount } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Valid amount is required' });
        return;
    }

    const user = userRepo.findUserByMemberId(id);

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    const updatedUser = userRepo.deductFunds(user.id, amount);

    if (updatedUser) {
        res.json({ balance: updatedUser.balance });
    } else {
        res.status(400).json({ error: 'Insufficient funds' });
    }
};

export const deleteUserById = (req: Request, res: Response): void => {
    const { id } = req.params; // memberId

    if (!id) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    const deleted = userRepo.deleteUserByMemberId(id);

    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};