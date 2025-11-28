<?php
header('Content-Type: application/json');

// Проверка авторизации
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    die(json_encode(['error' => 'Unauthorized']));
}

// Обработка загрузки фото
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $hotel = $_POST['hotel'] ?? '';
    $files = $_FILES['images'] ?? [];
    
    if (empty($hotel) || empty($files)) {
        http_response_code(400);
        die(json_encode(['error' => 'Invalid data']));
    }
    
    $uploaded = [];
    $uploadDir = '../admin/uploads/';
    
    foreach ($files['tmp_name'] as $key => $tmpName) {
        $fileName = uniqid() . '_' . basename($files['name'][$key]);
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($tmpName, $targetPath)) {
            $uploaded[] = $fileName;
            
            // Здесь можно сохранить информацию о фото в базу данных
            // savePhotoToDatabase($hotel, $fileName);
        }
    }
    
    echo json_encode(['success' => true, 'files' => $uploaded]);
    exit;
}

// Обработка удаления фото
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents('php://input'), $data);
    $photoId = $data['id'] ?? 0;
    
    if (empty($photoId)) {
        http_response_code(400);
        die(json_encode(['error' => 'Invalid ID']));
    }
    
    // Здесь должен быть код для удаления фото из базы и файловой системы
    // deletePhotoFromDatabase($photoId);
    
    echo json_encode(['success' => true]);
    exit;
}

// Получение списка фото
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $hotel = $_GET['hotel'] ?? '';
    
    // Здесь должен быть запрос к базе данных для получения фото по отелю
    // $photos = getPhotosByHotel($hotel);
    
    // Заглушка
    $photos = [
        ['id' => 1, 'url' => 'images/hero-bg1.JPG'],
        ['id' => 2, 'url' => 'images/hero-bg2.JPG']
    ];
    
    echo json_encode($photos);
    exit;
}

http_response_code(405);
die(json_encode(['error' => 'Method not allowed']));
?>