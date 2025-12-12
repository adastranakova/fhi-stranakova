// konfiguracia databazy, pouzivala som mysql (bol pokus predtym o sqlite
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'MySecurePass123!',
    database: 'bike_share_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// otestovanie pripojenia
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};