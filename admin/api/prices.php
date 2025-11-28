<?php
header('Content-Type: application/json');
session_start();

// Проверка авторизации
if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    die(json_encode(['error' => 'Unauthorized']));
}

require_once 'db_connect.php'; // Подключение к БД

// Получение цен
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT * FROM room_prices");
        $stmt->execute();
        $prices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($prices);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// Обновление цен
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data)) {
        http_response_code(400);
        die(json_encode(['error' => 'No data provided']));
    }
    
    try {
        $pdo->beginTransaction();
        
        // Очищаем старые цены
        $stmt = $pdo->prepare("DELETE FROM room_prices");
        $stmt->execute();
        
        // Вставляем новые цены
        $stmt = $pdo->prepare("INSERT INTO room_prices (hotel, room_type, price_hour, price_night, price_day) VALUES (?, ?, ?, ?, ?)");
        
        foreach ($data as $price) {
            $stmt->execute([
                $price['hotel'],
                $price['room_type'],
                $price['price_hour'],
                $price['price_night'],
                $price['price_day']
            ]);
        }
        
        $pdo->commit();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
die(json_encode(['error' => 'Method not allowed']));
?>