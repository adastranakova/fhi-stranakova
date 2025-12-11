import {UserEntity} from "../entities/user.entity";

const users: Map<number, UserEntity> = new Map();
let nextUserId = 1;

export const createUser = (memberId: string, name: string, email: string): UserEntity => {
    const user: UserEntity = {
        id: nextUserId++,
        memberId,
        name,
        email,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    users.set(user.id, user);
    return user;
};

export const findUserById = (id: number): UserEntity | null => {
    return users.get(id) || null;
};

export const findUserByMemberId = (memberId: string): UserEntity | null => {
    return Array.from(users.values()).find(u => u.memberId === memberId) || null;
};

export const findUserByEmail = (email: string): UserEntity | null => {
    return Array.from(users.values()).find(u => u.email === email) || null;
};

export const findAllUsers = (): UserEntity[] => {
    return Array.from(users.values());
};

export const updateUser = (id: number, updates: { name?: string; email?: string }): UserEntity | null => {
    const user = users.get(id);
    if (!user) return null;

    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    user.updatedAt = new Date();

    users.set(id, user);
    return user;
};

export const updateUserBalance = (id: number, newBalance: number): UserEntity | null => {
    const user = users.get(id);
    if (!user) return null;

    user.balance = newBalance;
    user.updatedAt = new Date();
    users.set(id, user);
    return user;
};

export const addFunds = (id: number, amount: number): UserEntity | null => {
    const user = users.get(id);
    if (!user) return null;

    user.balance += amount;
    user.updatedAt = new Date();
    users.set(id, user);
    return user;
};

export const deductFunds = (id: number, amount: number): UserEntity | null => {
    const user = users.get(id);
    if (!user || user.balance < amount) return null;

    user.balance -= amount;
    user.updatedAt = new Date();
    users.set(id, user);
    return user;
};

export const deleteUser = (id: number): boolean => {
    return users.delete(id);
};

export const deleteUserByMemberId = (memberId: string): boolean => {
    const user = findUserByMemberId(memberId);
    if (!user) return false;
    return users.delete(user.id);
};

export const userExistsByMemberId = (memberId: string): boolean => {
    return Array.from(users.values()).some(u => u.memberId === memberId);
};

export const userExistsByEmail = (email: string): boolean => {
    return Array.from(users.values()).some(u => u.email === email);
};

export const clearAllUsers = (): void => {
    users.clear();
    nextUserId = 1;
};
