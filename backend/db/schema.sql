-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 29, 2025 at 06:30 AM (Updated)
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- สร้าง database
CREATE DATABASE IF NOT EXISTS car_showroom;
USE car_showroom;

-- ลบตารางเก่าถ้ามีอยู่
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS login_logs;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS models;
DROP TABLE IF EXISTS brands;

-- ตาราง brands
CREATE TABLE brands (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- เพิ่มข้อมูลในตาราง brands
INSERT INTO brands (id, name, created_at) VALUES
(1, 'Mercedes', '2025-03-31 05:29:17'),
(2, 'Alfa Romeo', '2025-03-31 05:29:17'),
(3, 'Ford', '2025-03-31 05:29:17'),
(4, 'BMW', '2025-03-31 05:29:17');

-- ตาราง models
CREATE TABLE models (
    id INT NOT NULL AUTO_INCREMENT,
    brand_id INT DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY brand_id (brand_id),
    CONSTRAINT models_ibfk_1 FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- เพิ่มข้อมูลในตาราง models
INSERT INTO models (id, brand_id, name, created_at) VALUES
(1, 1, 'AMG C 63', '2025-03-31 05:29:17'),
(2, 2, 'Giulia', '2025-03-31 05:29:17'),
(3, 3, 'Ranger', '2025-03-31 05:29:17'),
(4, 4, '3 Series', '2025-03-31 05:29:17');

-- ตาราง users (เพิ่มคอลัมน์ status)
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','client') DEFAULT 'client',
    status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Active, 0=Inactive',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY email (email),
    KEY idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- เพิ่มข้อมูลในตาราง users (เพิ่มค่า status)
INSERT INTO users (id, name, email, password, role, status, created_at) VALUES
(1, 'Admin User', 'admin@example.com', '$2a$10$z5g8Xz5z5g8Xz5z5g8Xz5u5z5g8Xz5z5g8Xz5z5g8Xz5z5g8Xz5z5', 'admin', 1, '2025-03-31 05:29:17'),
(2, 'Client One', 'client1@example.com', '$2a$10$z5g8Xz5z5g8Xz5z5g8Xz5u5z5g8Xz5z5g8Xz5z5g8Xz5z5g8Xz5z5', 'client', 1, '2025-03-31 05:29:17'),
(3, 'Kyubey', 'Kyubey@gmail.com', '$2b$10$4sWkT401mV3YELs3rqXLTOhW5fJeYG1AyBy7lzeKlgRWnhNK3dKXW', 'client', 1, '2025-03-31 05:33:20'),
(6, 'AdminMeow', 'AdminMeow@gmail.com', '$2b$10$xl1sUSZ3MjvpmnN.yAT9ZeB/CChmLHSXyM4A4mbtHgAAly1OtU3ny', 'admin', 1, '2025-04-06 07:30:37'),
(7, 'AdminMeow2', 'AdminMeow2@gmail.com', '$2b$10$oekE9yBtKgyESLPEceUnLuRcxHS568W/1sA4cRf0fth0cXPUAeLPK', 'admin', 1, '2025-04-07 07:12:50'),
(8, 'AdminMeow3', 'AdminMeow3@gmail.com', '$2b$10$OprAkEb6/mYy9R6nYuYR4u8WjmTGiaHMSR0yNJUSJb7lZ0Uie4MDy', 'admin', 1, '2025-04-07 07:19:29'),
(14, 'AdminMeow4', 'AdminMeow4@gmail.com', '$2b$10$9p3T/47nm7lJYF1Ml61iXOJqNl4.jUtUDZA2Erp73QweI/zCFpWje', 'admin', 1, '2025-04-11 07:27:14'),
(15, 'AdminMeow5', 'AdminMeow5@gmail.com', '$2b$10$0aBTLYg.Kfi1RGQlExRFJuMAcWd7RNnDW5Z3mR/3jEKFoD.KDD6Fq', 'admin', 1, '2025-04-11 07:30:20'),
(16, 'Meow6', 'Meow6@gmail.com', '$2b$10$qlxmBhGMElLEv0MVrC9Z7e/FT3ytlNZ8keGh/.x8y7vADHww2e75a', 'admin', 1, '2025-04-14 07:50:41');

-- ตาราง login_logs
CREATE TABLE login_logs (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    role ENUM('admin','client') NOT NULL,
    login_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    CONSTRAINT login_logs_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- เพิ่มข้อมูลในตาราง login_logs
INSERT INTO login_logs (id, user_id, role, login_at) VALUES
(1, 2, 'client', '2025-04-10 03:00:00'),
(2, 2, 'client', '2025-04-09 05:00:00'),
(3, 2, 'client', '2025-04-08 07:00:00');

-- ตาราง cars
CREATE TABLE cars (
    id INT NOT NULL AUTO_INCREMENT,
    model_id INT DEFAULT NULL,
    year INT DEFAULT NULL,
    price DECIMAL(15,2) DEFAULT NULL,
    description TEXT,
    image_url VARCHAR(255) DEFAULT NULL,
    model_3d_url VARCHAR(255) DEFAULT NULL,
    color VARCHAR(50) DEFAULT NULL,
    mileage INT DEFAULT 0,
    fuel_type ENUM('petrol','diesel','electric','hybrid') DEFAULT 'petrol',
    status ENUM('available','sold','reserved') DEFAULT 'available',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY model_id (model_id),
    CONSTRAINT cars_ibfk_1 FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- เพิ่มข้อมูลในตาราง cars
INSERT INTO cars (id, model_id, year, price, description, image_url, model_3d_url, color, mileage, fuel_type, status, created_at) VALUES
(1, 1, 2023, 4500000.00, 'High-performance sedan with advanced features', 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=500', 'path/to/3dmodel1.glb', 'Black', 0, 'petrol', 'available', '2025-03-31 05:29:17'),
(2, 2, 2022, 3200000.00, 'Stylish Italian sedan', 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=500', 'path/to/3dmodel2.glb', 'Red', 5000, 'petrol', 'available', '2025-03-31 05:29:17'),
(3, 3, 2021, 1500000.00, 'Rugged pickup truck for all terrains', 'https://cdn.motor1.com/images/mgl/GPYrG/s1/2019-ford-ranger-raptor-im-test.jpg', 'path/to/3dmodel3.glb', 'Blue', 10000, 'diesel', 'available', '2025-03-31 05:29:17'),
(4, 4, 2023, 2800000.00, 'Luxury sedan with cutting-edge technology', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=500', 'path/to/3dmodel4.glb', 'White', 0, 'hybrid', 'available', '2025-03-31 05:29:17');

-- ✅ ตาราง contacts (แก้ไขแล้ว - เพิ่ม user_id, subject, reply)
CREATE TABLE contacts (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    file_name VARCHAR(255) DEFAULT NULL,
    status ENUM('pending', 'replied', 'closed') DEFAULT 'pending',
    reply TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_user_id (user_id),
    KEY idx_status (status),
    KEY idx_created_at (created_at),
    CONSTRAINT fk_contacts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- เพิ่มข้อมูลตัวอย่างในตาราง contacts
INSERT INTO contacts (id, user_id, name, email, subject, message, file_name, status, reply, created_at) VALUES
(1, 2, 'John Doe', 'john.doe@example.com', 'Question about AMG C 63', 'I have a question about the AMG C 63.', NULL, 'pending', NULL, '2025-04-25 06:00:00'),
(2, 2, 'Jane Smith', 'jane.smith@example.com', 'Inquiry about Giulia', 'Please contact me regarding the Giulia.', 'attachment.pdf', 'replied', 'Thank you for your inquiry. We will contact you soon.', '2025-04-25 06:10:00');

-- ตาราง bookings
CREATE TABLE bookings (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    car_id INT DEFAULT NULL,
    booking_date DATETIME DEFAULT NULL,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    type ENUM('test_drive','inquiry') DEFAULT NULL,
    message TEXT,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_user_id (user_id),
    KEY idx_car_id (car_id),
    KEY idx_booking_date (booking_date),
    CONSTRAINT bookings_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT bookings_ibfk_2 FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- เพิ่มข้อมูลในตาราง bookings
INSERT INTO bookings (id, user_id, car_id, booking_date, status, type, message, created_at) VALUES
(212, 3, 2, '2025-04-21 13:00:03', 'pending', 'test_drive', 'I would like to test drive this car.', '2025-04-21 06:00:03'),
(214, 3, 2, '2025-04-21 13:00:04', 'pending', 'test_drive', 'I would like to test drive this car.', '2025-04-21 06:00:04'),
(215, 3, 2, '2025-04-21 13:00:04', 'pending', 'test_drive', 'I would like to test drive this car.', '2025-04-21 06:00:04'),
(216, 3, 2, '2025-04-21 13:18:30', 'pending', 'inquiry', 'I have some questions about this car.', '2025-04-21 06:18:30'),
(217, 3, 2, '2025-04-21 13:18:32', 'pending', 'test_drive', 'I would like to test drive this car.', '2025-04-21 06:18:32');

-- ตาราง payments
CREATE TABLE payments (
    id INT NOT NULL AUTO_INCREMENT,
    booking_id INT DEFAULT NULL,
    user_id INT DEFAULT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_status ENUM('pending','completed','failed') DEFAULT 'pending',
    payment_method ENUM('credit_card','bank_transfer','cash') DEFAULT NULL,
    transaction_id VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY booking_id (booking_id),
    KEY user_id (user_id),
    CONSTRAINT payments_ibfk_1 FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    CONSTRAINT payments_ibfk_2 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ตาราง reviews
CREATE TABLE reviews (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    car_id INT DEFAULT NULL,
    rating INT DEFAULT NULL,
    comment TEXT,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY car_id (car_id),
    CONSTRAINT reviews_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT reviews_ibfk_2 FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL,
    CONSTRAINT check_rating CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- เพิ่มข้อมูลในตาราง reviews
INSERT INTO reviews (id, user_id, car_id, rating, comment, created_at) VALUES
(1, 1, 1, 5, 'Great car! Very fast and smooth.', '2025-04-01 03:00:00'),
(2, 2, 2, 4, 'Nice design, but a bit pricey.', '2025-04-02 05:30:00'),
(3, 1, 3, 3, 'Good for off-road, but noisy.', '2025-04-03 08:45:00'),
(4, 3, 1, 5, 'สุดยอดดดดดด', '2025-04-20 09:00:58'),
(5, 3, 2, 3, 'ถ้ามีสีให้เลือกกว่านี้จะดีมากกก', '2025-04-20 09:05:15');

-- ตั้งค่า AUTO_INCREMENT
ALTER TABLE bookings MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=218;
ALTER TABLE brands MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE cars MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE contacts MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE login_logs MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;
ALTER TABLE models MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE payments MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE reviews MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
ALTER TABLE users MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;