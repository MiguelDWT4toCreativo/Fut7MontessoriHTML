<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

function sendResponse($status, $message) {
    http_response_code($status);
    echo json_encode(['status' => $message]);
    exit;
}

// function authenticate() {
//     $headers = getallheaders();
//     if (!isset($headers['Authorization'])) {
//         sendResponse(401, 'No se proporcionó el token de autorización');
//     }

//     $authHeader = $headers['Authorization'];
//     list($tokenType, $token) = explode(' ', $authHeader);

//     if (strcasecmp($tokenType, 'Bearer') != 0) {
//         sendResponse(401, 'Tipo de token no válido');
//     }

//     $validToken = 'mi_token_secreto'; // Reemplaza esto con tu token real

//     if ($token !== $validToken) {
//         sendResponse(401, 'Token no válido');
//     }
// }

// authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['nombre']) || !isset($_POST['telefono']) || !isset($_POST['correo']) || !isset($_POST['password'])) {
        sendResponse(400, 'Datos incompletos');
    }

    include 'db.php';

    $nombre = $_POST['nombre'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("INSERT INTO Cliente (status, nombre, telefono, correo, password) VALUES ('pendiente', ?, ?, ?, ?)");
        $stmt->execute([$nombre, $telefono, $correo, $password]);
        sendResponse(200, 'Éxito');
    } catch (PDOException $e) {
        sendResponse(500, 'Error en la base de datos: ' . $e->getMessage());
    }
} else {
    sendResponse(405, 'Método no permitido');
}
?>
