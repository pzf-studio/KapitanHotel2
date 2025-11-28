<?php
header('Content-Type: application/json');
session_start();

// Проверка авторизации
if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    die(json_encode(['error' => 'Unauthorized']));
}

require_once 'db_connect.php';

// Обработка GET-запроса (получение списка акций)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM promotions ORDER BY start_date DESC");
        $promotions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($promotions);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// Обработка POST-запроса (создание/обновление акции)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Валидация данных
    if (empty($data['title']) || empty($data['description'])) {
        http_response_code(400);
        die(json_encode(['error' => 'Title and description are required']));
    }

    try {
        if (isset($data['id'])) {
            // Обновление существующей акции
            $stmt = $pdo->prepare("UPDATE promotions SET title=?, description=?, start_date=?, end_date=? WHERE id=?");
            $stmt->execute([
                $data['title'],
                $data['description'],
                $data['start_date'],
                $data['end_date'],
                $data['id']
            ]);
        } else {
            // Создание новой акции
            $stmt = $pdo->prepare("INSERT INTO promotions (title, description, start_date, end_date) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['title'],
                $data['description'],
                $data['start_date'],
                $data['end_date']
            ]);
            $data['id'] = $pdo->lastInsertId();
        }
        echo json_encode(['success' => true, 'promotion' => $data]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// Обработка DELETE-запроса (удаление акции)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents('php://input'), $data);
    $id = $data['id'] ?? 0;

    if (empty($id)) {
        http_response_code(400);
        die(json_encode(['error' => 'Invalid ID']));
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM promotions WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
die(json_encode(['error' => 'Method not allowed']));
?>