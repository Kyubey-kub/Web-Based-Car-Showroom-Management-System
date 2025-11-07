-- db/schema-neon.sql
-- PostgreSQL Schema for Neon.tech

-- ลบตารางเก่าถ้ามี
DROP TABLE IF EXISTS reviews, payments, bookings, contacts, cars, login_logs, users, models, brands CASCADE;

-- ตาราง brands
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง models
CREATE TABLE models (
    id SERIAL PRIMARY KEY,
    brand_id INT REFERENCES brands(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง users (เพิ่ม updated_at)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role TEXT CHECK (role IN ('admin', 'client')) DEFAULT 'client',
    status SMALLINT DEFAULT 1 CHECK (status IN (0, 1)),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()  -- เพิ่มคอลัมน์นี้
);

-- ตาราง login_logs
CREATE TABLE login_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'client')) NOT NULL,
    login_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง cars
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    model_id INT REFERENCES models(id) ON DELETE SET NULL,
    year INT,
    price DECIMAL(15,2),
    description TEXT,
    image_url VARCHAR(255),
    model_3d_url VARCHAR(255),
    color VARCHAR(50),
    mileage INT DEFAULT 0,
    fuel_type TEXT CHECK (fuel_type IN ('petrol','diesel','electric','hybrid')) DEFAULT 'petrol',
    status TEXT CHECK (status IN ('available','sold','reserved')) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง contacts (เพิ่ม file_name, file_path, reply)
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    status TEXT CHECK (status IN ('pending', 'replied', 'closed')) DEFAULT 'pending',
    reply TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง bookings
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    car_id INT REFERENCES cars(id) ON DELETE SET NULL,
    booking_date TIMESTAMP,
    status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
    type TEXT CHECK (type IN ('test_drive','inquiry')),
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id) ON DELETE SET NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    payment_status TEXT CHECK (payment_status IN ('pending','completed','failed')) DEFAULT 'pending',
    payment_method TEXT CHECK (payment_method IN ('credit_card','bank_transfer','cash')),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    car_id INT REFERENCES cars(id) ON DELETE SET NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ข้อมูลตัวอย่าง
INSERT INTO brands (name) VALUES 
('Mercedes'), ('Alfa Romeo'), ('Ford'), ('BMW');

INSERT INTO models (brand_id, name) VALUES 
(1, 'AMG C 63'), (2, 'Giulia'), (3, 'Ranger'), (4, '3 Series');

INSERT INTO users (name, email, password, role, status, created_at, updated_at) VALUES
('Admin User', 'admin@example.com', '$2a$10$z5g8Xz5z5g8Xz5z5g8Xz5u5z5g8Xz5z5g8Xz5z5g8Xz5z5g8Xz5z5', 'admin', 1, NOW(), NOW()),
('Client One', 'client1@example.com', '$2a$10$z5g8Xz5z5g8Xz5z5g8Xz5u5z5g8Xz5z5g8Xz5z5g8Xz5z5g8Xz5z5', 'client', 1, NOW(), NOW());

INSERT INTO cars (model_id, year, price, description, image_url, model_3d_url, color, mileage, fuel_type, status) VALUES
(1, 2023, 4500000.00, 'High-performance sedan', 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg', 'path/to/3dmodel1.glb', 'Black', 0, 'petrol', 'available'),
(2, 2022, 3200000.00, 'Stylish Italian sedan', 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg', 'path/to/3dmodel2.glb', 'Red', 5000, 'petrol', 'available');