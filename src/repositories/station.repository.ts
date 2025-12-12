import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import {SlotEntity, SlotStatus} from "../entities/slot.entity";
import {StationEntity} from "../entities/station.entity";

// vytvorit stanicu
export const createStation = async (name: string, address: string, numberOfSlots: number): Promise<StationEntity> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO stations (name, address, number_of_slots) VALUES (?, ?, ?)',
        [name, address, numberOfSlots]
    );

    // vytvorenie prazdnych slotov pre stanicu
    for (let i = 1; i <= numberOfSlots; i++) {
        await pool.execute(
            'INSERT INTO slots (slot_number, station_id, status) VALUES (?, ?, ?)',
            [i, result.insertId, SlotStatus.Empty]
        );
    }

    return {
        id: result.insertId,
        name,
        address,
        numberOfSlots
    };
};

//najdenie stanice podla mena
export const findStationByName = async (name: string): Promise<StationEntity | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM stations WHERE name = ?',
        [name]
    );
    if (!rows[0]) return null;

    return {
        id: rows[0].id,
        name: rows[0].name,
        address: rows[0].address,
        numberOfSlots: rows[0].number_of_slots
    };
};

// hladanie stanice podla id
export const findStationById = async (id: number): Promise<StationEntity | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM stations WHERE id = ?',
        [id]
    );
    if (!rows[0]) return null;

    return {
        id: rows[0].id,
        name: rows[0].name,
        address: rows[0].address,
        numberOfSlots: rows[0].number_of_slots
    };
};

// vsetky stanice
export const findAllStations = async (): Promise<StationEntity[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM stations');
    return rows.map(row => ({
        id: row.id,
        name: row.name,
        address: row.address,
        numberOfSlots: row.number_of_slots
    }));
};

// update stanice
export const updateStation = async (id: number, name?: string, address?: string): Promise<StationEntity | null> => {
    const updates: string[] = [];
    const values: any[] = [];

    if (name) {
        updates.push('name = ?');
        values.push(name);
    }
    if (address) {
        updates.push('address = ?');
        values.push(address);
    }

    if (updates.length === 0) return null;

    values.push(id);
    await pool.execute(
        `UPDATE stations SET ${updates.join(', ')} WHERE id = ?`,
        values
    );

    return findStationById(id);
};

// vymazanie stanice
export const deleteStation = async (id: number): Promise<void> => {
    await pool.execute('DELETE FROM stations WHERE id = ?', [id]);
};

// ci uz neexistuje stanice s takym menom
export const stationExistsByName = async (name: string): Promise<boolean> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM stations WHERE name = ?',
        [name]
    );
    return (rows[0]?.count ?? 0) > 0;
};

// funkcie pre sloty
export const findSlotsByStationId = async (stationId: number): Promise<SlotEntity[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM slots WHERE station_id = ? ORDER BY slot_number',
        [stationId]
    );
    return rows.map(row => ({
        id: row.id,
        slotNumber: row.slot_number,
        stationId: row.station_id,
        bikeId: row.bike_id,
        password: row.password,
        status: row.status
    }));
};

export const findEmptySlotByStationId = async (stationId: number): Promise<SlotEntity | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM slots WHERE station_id = ? AND status = ? LIMIT 1',
        [stationId, SlotStatus.Empty]
    );
    if (!rows[0]) return null;

    return {
        id: rows[0].id,
        slotNumber: rows[0].slot_number,
        stationId: rows[0].station_id,
        bikeId: rows[0].bike_id,
        password: rows[0].password,
        status: rows[0].status
    };
};

export const findSlotByBikeId = async (bikeId: string): Promise<SlotEntity | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM slots WHERE bike_id = ?',
        [bikeId]
    );
    if (!rows[0]) return null;

    return {
        id: rows[0].id,
        slotNumber: rows[0].slot_number,
        stationId: rows[0].station_id,
        bikeId: rows[0].bike_id,
        password: rows[0].password,
        status: rows[0].status
    };
};

export const clearSlot = async (slotId: number): Promise<void> => {
    await pool.execute(
        'UPDATE slots SET bike_id = NULL, password = NULL, status = ? WHERE id = ?',
        [SlotStatus.Empty, slotId]
    );
};

export const putBikeInSlot = async (slotId: number, bikeId: string): Promise<SlotEntity | null> => {
    await pool.execute(
        'UPDATE slots SET bike_id = ?, status = ? WHERE id = ?',
        [bikeId, SlotStatus.Occupied, slotId]
    );

    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM slots WHERE id = ?',
        [slotId]
    );
    if (!rows[0]) return null;

    return {
        id: rows[0].id,
        slotNumber: rows[0].slot_number,
        stationId: rows[0].station_id,
        bikeId: rows[0].bike_id,
        password: rows[0].password,
        status: rows[0].status
    };
};

export const getAvailableBikesCount = async (stationId: number): Promise<number> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM slots WHERE station_id = ? AND bike_id IS NOT NULL',
        [stationId]
    );
    return rows[0]?.count ?? 0;
};