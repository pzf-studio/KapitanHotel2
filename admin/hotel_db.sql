CREATE TABLE IF NOT EXISTS promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel VARCHAR(50) NOT NULL COMMENT 'bulvar or sevastopol',
    room_type VARCHAR(50) NOT NULL,
    price_hour DECIMAL(10,2) NOT NULL,
    price_night DECIMAL(10,2) NOT NULL,
    price_day DECIMAL(10,2) NOT NULL
);

-- Начальные данные для цен
INSERT INTO room_prices (hotel, room_type, price_hour, price_night, price_day) VALUES
('bulvar', 'standard', 1500, 2200, 3500),
('bulvar', 'comfort', 1800, 3500, 4500),
('bulvar', 'junior-suite', 2000, 4500, 6000),
('sevastopol', 'standard', 1500, 2200, 3500),
('sevastopol', 'junior-suite', 1800, 4000, 5000),
('sevastopol', 'suite', 2000, 4500, 6500);