-- ===================================
-- BIKE SHARE SYSTEM - SIMPLIFIED SCHEMA
-- ===================================

CREATE DATABASE IF NOT EXISTS bike_share_system;
USE bike_share_system;

-- Drop tables in reverse order (respecting foreign keys)
DROP TABLE IF EXISTS rentals;
DROP TABLE IF EXISTS slots;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS bikes;

-- ===================================
-- BIKES
-- ===================================
CREATE TABLE bikes (
    id VARCHAR(50) PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    
    CHECK (status IN ('AVAILABLE', 'RENTED', 'MAINTENANCE'))
);

-- ===================================
-- STATIONS
-- ===================================
CREATE TABLE stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    number_of_slots INT NOT NULL,
    
    CHECK (number_of_slots > 0)
);

-- ===================================
-- SLOTS
-- ===================================
CREATE TABLE slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_number INT NOT NULL,
    station_id INT NOT NULL,
    bike_id VARCHAR(50) NULL,
    password VARCHAR(10) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'EMPTY',
    
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_slot_per_station (station_id, slot_number),
    CHECK (status IN ('EMPTY', 'OCCUPIED', 'FAULTY')),
    CHECK (slot_number > 0)
);

-- ===================================
-- USERS
-- ===================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    
    CHECK (balance >= 0)
);

-- ===================================
-- RENTALS
-- ===================================
CREATE TABLE rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bike_id VARCHAR(50) NOT NULL,
    start_station_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    end_station_id INT NULL,
    duration INT NULL COMMENT 'Duration in milliseconds',
    cost DECIMAL(10, 2) NULL COMMENT 'Cost in dollars',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE RESTRICT,
    FOREIGN KEY (start_station_id) REFERENCES stations(id) ON DELETE RESTRICT,
    FOREIGN KEY (end_station_id) REFERENCES stations(id) ON DELETE RESTRICT,
    
    CHECK (cost >= 0)
);

-- ===================================
-- INDEXES
-- ===================================
CREATE INDEX idx_bikes_status ON bikes(status);
CREATE INDEX idx_slots_station_id ON slots(station_id);
CREATE INDEX idx_rentals_user_id ON rentals(user_id);
CREATE INDEX idx_rentals_active ON rentals(user_id, end_time);

-- ===================================
-- SAMPLE DATA
-- ===================================

INSERT INTO bikes (id, status) VALUES
('BIKE001', 'AVAILABLE'),
('BIKE002', 'AVAILABLE'),
('BIKE003', 'AVAILABLE');

INSERT INTO stations (name, address, number_of_slots) VALUES
('Central Station', '123 Main St', 5),
('Park Station', '456 Park Ave', 3);

INSERT INTO slots (slot_number, station_id, status) VALUES
(1, 1, 'EMPTY'), (2, 1, 'EMPTY'), (3, 1, 'EMPTY'), (4, 1, 'EMPTY'), (5, 1, 'EMPTY'),
(1, 2, 'EMPTY'), (2, 2, 'EMPTY'), (3, 2, 'EMPTY');

INSERT INTO users (member_id, name, email, balance) VALUES
('MEM001', 'Alice Smith', 'alice@email.com', 50.00),
('MEM002', 'Bob Jones', 'bob@email.com', 30.00);

-- Lock some bikes
UPDATE slots SET bike_id = 'BIKE001', password = '1234', status = 'OCCUPIED' 
WHERE station_id = 1 AND slot_number = 1;

UPDATE slots SET bike_id = 'BIKE002', password = '5678', status = 'OCCUPIED' 
WHERE station_id = 1 AND slot_number = 2;
