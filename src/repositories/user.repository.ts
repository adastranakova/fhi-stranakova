import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {UserEntity} from "../entities/user.entity";

export const createUser = async (memberId: string, name: string, email: string): Promise<UserEntity> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO users (member_id, name, email, balance) VALUES (?, ?, ?, 0)',
        [memberId, name, email]
    );
    return {
        id: result.insertId,
        memberId,
        name,
        email,
        balance: 0
    };
};

export const findUserById = async (id: number): Promise<UserEntity | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    if (!rows[0]) return null;
    return {
        id: rows[0].id,
        memberId: rows[0].member_id,
        name: rows[0].name,
        email: rows[0].email,
        balance: rows[0].balance
    };
};

export const findUserByMemberId = async (memberId: string): Promise<UserEntity | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE member_id = ?',
        [memberId]
    );
    if (!rows[0]) return null;
    return {
        id: rows[0].id,
        memberId: rows[0].member_id,
        name: rows[0].name,
        email: rows[0].email,
        balance: rows[0].balance
    };
};

export const findAllUsers = async (): Promise<UserEntity[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users'
    );
    return rows.map(row => ({
        id: row.id,
        memberId: row.member_id,
        name: row.name,
        email: row.email,
        balance: row.balance
    }));
};

export const updateUser = async (id: number, updates: { name?: string; email?: string }): Promise<UserEntity | null> => {
    const setClauses: string[] = [];
    const values: any[] = [];

    if (updates.name) {
        setClauses.push('name = ?');
        values.push(updates.name);
    }
    if (updates.email) {
        setClauses.push('email = ?');
        values.push(updates.email);
    }

    if (setClauses.length === 0) {
        return findUserById(id);
    }

    values.push(id);
    await pool.execute(
        `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`,
        values
    );

    return findUserById(id);
};

export const addFunds = async (id: number, amount: number): Promise<UserEntity | null> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [amount, id]
    );
    if (result.affectedRows === 0) return null;
    return findUserById(id);
};

export const deductFunds = async (id: number, amount: number): Promise<UserEntity | null> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE users SET balance = balance - ? WHERE id = ? AND balance >= ?',
        [amount, id, amount]
    );
    if (result.affectedRows === 0) return null;
    return findUserById(id);
};


export const deleteUserByMemberId = async (memberId: string): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM users WHERE member_id = ?',
        [memberId]
    );
    return result.affectedRows > 0;
};

export const userExistsByMemberId = async (memberId: string): Promise<boolean> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users WHERE member_id = ?',
        [memberId]
    );
    return (rows[0]?.count ?? 0) > 0;
};

export const userExistsByEmail = async (email: string): Promise<boolean> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users WHERE email = ?',
        [email]
    );
    return (rows[0]?.count ?? 0) > 0;
};
