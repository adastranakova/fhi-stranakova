import { Request, Response } from 'express';
import * as userRepo from '../repositories/user.repository';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userRepo.findAllUsers();
        res.json(users.map(user => ({
            memberId: user.memberId,
            name: user.name,
            email: user.email,
            balance: user.balance
        })));
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getUserByMemberId = async (req: Request, res: Response): Promise<void> => {
    const { memberId } = req.params;

    if (!memberId) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    try {
        const user = await userRepo.findUserByMemberId(memberId);
        if (user) {
            res.json({
                memberId: user.memberId,
                name: user.name,
                email: user.email,
                balance: user.balance
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { memberId, name, email } = req.body;

    if (!memberId || !name || !email) {
        res.status(400).json({ error: 'MemberId, name, and email are required' });
        return;
    }

    try {
        if (await userRepo.userExistsByMemberId(memberId)) {
            res.status(400).json({ error: 'Member ID already exists' });
            return;
        }

        if (await userRepo.userExistsByEmail(email)) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }

        const user = await userRepo.createUser(memberId, name, email);
        res.status(201).json({
            memberId: user.memberId,
            name: user.name,
            email: user.email,
            balance: user.balance
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { memberId } = req.params;
    const { name, email } = req.body;

    if (!memberId) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    if (!name && !email) {
        res.status(400).json({ error: 'At least one field (name or email) is required' });
        return;
    }

    try {
        const user = await userRepo.findUserByMemberId(memberId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (email && email !== user.email && await userRepo.userExistsByEmail(email)) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }

        const updatedUser = await userRepo.updateUser(user.id, { name, email });
        if (!updatedUser) {
            res.status(500).json({ error: 'Failed to update user' });
            return;
        }

        res.json({
            memberId: updatedUser.memberId,
            name: updatedUser.name,
            email: updatedUser.email,
            balance: updatedUser.balance
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const addFundsToUser = async (req: Request, res: Response): Promise<void> => {
    const { memberId } = req.params;
    const { amount } = req.body;

    if (!memberId) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    if (amount === undefined || amount <= 0) {
        res.status(400).json({ error: 'Valid positive amount is required' });
        return;
    }

    try {
        const user = await userRepo.findUserByMemberId(memberId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const updatedUser = await userRepo.addFunds(user.id, amount);
        if (!updatedUser) {
            res.status(500).json({ error: 'Failed to add funds' });
            return;
        }

        res.json({
            memberId: updatedUser.memberId,
            balance: updatedUser.balance
        });
    } catch (error) {
        console.error('Error adding funds:', error);
        res.status(500).json({ error: 'Failed to add funds' });
    }
};

export const deductFundsFromUser = async (req: Request, res: Response): Promise<void> => {
    const { memberId } = req.params;
    const { amount } = req.body;

    if (!memberId) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
        res.status(400).json({ error: 'Valid positive amount is required' });
        return;
    }

    try {
        const user = await userRepo.findUserByMemberId(memberId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const currentBalance = Number(user.balance);
        if (currentBalance < numAmount) {
            res.status(400).json({
                error: 'Insufficient balance',
                balance: currentBalance,
                requested: numAmount
            });
            return;
        }

        const updatedUser = await userRepo.deductFunds(user.id, numAmount);
        if (!updatedUser) {
            res.status(500).json({ error: 'Failed to deduct funds' });
            return;
        }

        res.json({
            memberId: updatedUser.memberId,
            balance: Number(updatedUser.balance)
        });
    } catch (error) {
        console.error('Error deducting funds:', error);
        res.status(500).json({ error: 'Failed to deduct funds' });
    }
};

export const deleteUserByMemberId = async (req: Request, res: Response): Promise<void> => {
    const { memberId } = req.params;

    if (!memberId) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    try {
        const deleted = await userRepo.deleteUserByMemberId(memberId);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};