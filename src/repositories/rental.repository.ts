import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import {RentalEntity} from "../entities/rental.entity";

//vytvorenie prenajmu
export const createRental = async (userId: number, bikeId: string, startStationId: number): Promise<RentalEntity> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO rentals (user_id, bike_id, start_station_id, start_time) VALUES (?, ?, ?, NOW())',
        [userId, bikeId, startStationId]
    );

    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM rentals WHERE id = ?',
        [result.insertId]
    );

    if (!rows[0]) {
        throw new Error('Failed to create rental');
    }

    return {
        id: rows[0].id,
        userId: rows[0].user_id,
        bikeId: rows[0].bike_id,
        startStationId: rows[0].start_station_id,
        endStationId: rows[0].end_station_id,
        startTime: rows[0].start_time,
        endTime: rows[0].end_time,
        duration: rows[0].duration,
        cost: rows[0].cost
    };
};

// podla id pouzivatela
export const findActiveRentalByUserId = async (userId: number): Promise<RentalEntity | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM rentals WHERE user_id = ? AND end_time IS NULL',
        [userId]
    );
    if (!rows[0]) return null;

    return {
        id: rows[0].id,
        userId: rows[0].user_id,
        bikeId: rows[0].bike_id,
        startStationId: rows[0].start_station_id,
        endStationId: rows[0].end_station_id,
        startTime: rows[0].start_time,
        endTime: rows[0].end_time,
        duration: rows[0].duration,
        cost: rows[0].cost
    };
};

// vsetky aktivne prenajmy
export const findAllActiveRentals = async (): Promise<any[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT 
            r.id as rentalId,
            r.bike_id as bikeId,
            r.start_time as startTime,
            u.member_id as memberId,
            u.name as userName
         FROM rentals r
         JOIN users u ON r.user_id = u.id
         WHERE r.end_time IS NULL`
    );

    return rows.map(row => ({
        rentalId: row.rentalId,
        bikeId: row.bikeId,
        startTime: row.startTime,
        memberId: row.memberId,
        userName: row.userName
    }));
};

// ukoncenie prenajmu
export const completeRental = async (
    rentalId: number,
    endStationId: number,
    durationMinutes: number,
    cost: number
): Promise<void> => {
    await pool.execute(
        `UPDATE rentals 
         SET end_station_id = ?, 
             end_time = NOW(), 
             duration = ?, 
             cost = ? 
         WHERE id = ?`,
        [endStationId, durationMinutes, cost, rentalId]
    );
};

// aktivny prenajom
export const userHasActiveRental = async (userId: number): Promise<boolean> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM rentals WHERE user_id = ? AND end_time IS NULL',
        [userId]
    );
    return (rows[0]?.count ?? 0) > 0;
};