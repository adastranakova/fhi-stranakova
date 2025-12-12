import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {BikeEntity, BikeStatus} from "../entities/bike.entity";

// vyuzitie pool - vytvara pripojenia k databaze
// zdielane medzi dotazmi v aplikacii, znovu pouzivane
// automaticky uvolnene po vykonani dotazu
// aka - poskytne pripojenie - vykona sql dotaz - vrati ho spat do zasonika
// zjednodusene - zasobnik databazovych pripojeni

// vytvorenie bicykla
export const createBike = async (id: string): Promise<BikeEntity> => {
    await pool.execute(
        'INSERT INTO bikes (id, status) VALUES (?, ?)',
        [id, BikeStatus.Available]
    );
    return { id, status: BikeStatus.Available };
};

// najdenie bicykla
export const findBikeById = async (id: string): Promise<BikeEntity | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM bikes WHERE id = ?',
        [id]
    );
    const row = rows[0];
    if (!row) return null;
    return { id: row.id, status: row.status };
};

// najdenie vsetkych bicyklov
export const findAllBikes = async (): Promise<BikeEntity[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM bikes'
    );
    return rows.map(row => ({ id: row.id, status: row.status }));
};


// update bicykla
export const updateBikeStatus = async (id: string, status: BikeStatus): Promise<BikeEntity | null> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE bikes SET status = ? WHERE id = ?',
        [status, id]
    );
    if (result.affectedRows === 0) return null;
    return { id, status };
};

//vymazanie bicykla
export const deleteBike = async (id: string): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM bikes WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
};

// ci uz dany bicykel (s id) existuje
export const bikeExists = async (id: string): Promise<boolean> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM bikes WHERE id = ?',
        [id]
    );
    const row = rows[0];
    if (!row) return false;
    return row.count > 0;
};

// overenie, ci nahodou nie je bicykel pozicany (aby sme s nim mohli narabat)
export const bikeHasRentals = async (bikeId: string): Promise<boolean> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM rentals WHERE bike_id = ?',
        [bikeId]
    );

    return (rows[0]?.count ?? 0) > 0;
};