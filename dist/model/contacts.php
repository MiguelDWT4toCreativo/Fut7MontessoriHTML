<?php
header("Access-Control-Allow-Origin: *"); // Permitir todas las solicitudes (para desarrollo, ajustar en producción)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Asegúrate de incluir todos los encabezados necesarios

// Manejo de preflight request para OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Devuelve OK para las solicitudes OPTIONS
    exit;
}

// Resto de tu código para manejar GET...
include 'db.php';

function sendResponse($status, $message) {
    http_response_code($status);
    echo json_encode(['status' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Consulta para obtener clientes
        $stmt = $pdo->prepare("SELECT nombre, telefono, correo FROM Cliente ORDER BY nombre ASC");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Devolver los resultados en JSON
        http_response_code(200);
        echo json_encode($result);
        exit;
    } catch (PDOException $e) {
        sendResponse(500, 'Error en la base de datos: ' . $e->getMessage());
    }
} else {
    sendResponse(405, 'Método no permitido');
}

