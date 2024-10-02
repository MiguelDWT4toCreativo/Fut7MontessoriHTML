<?php
header("Access-Control-Allow-Origin: *"); // Permitir todas las solicitudes (ajusta en producción)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejo de preflight request para OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Devuelve OK para las solicitudes OPTIONS
    exit;
}

include 'db.php'; // Asegúrate de incluir tu archivo de conexión

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'getUserData') {
        getUserData();
    } else {
        sendResponse(400, 'Acción inválida');
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'updateUserData') {
        updateUserData();
    } else {
        sendResponse(400, 'Acción inválida');
    }
} else {
    sendResponse(405, 'Método no permitido');
}

// Función para obtener los datos del usuario
function getUserData()
{
    global $pdo;

    if (isset($_COOKIE['user'])) { // Verifica si la cookie 'user' está establecida
        $userData = json_decode($_COOKIE['user'], true); // Decodifica el JSON a un array asociativo

        if (isset($userData['id'])) { // Verifica si el ID está presente
            $user_id = $userData['id']; // Obtiene el ID del usuario
            error_log("User ID from cookie: " . $user_id); // Log del ID para depuración

            try {
                $stmt = $pdo->prepare("SELECT nombre, telefono, correo FROM Cliente WHERE id = ?");
                $stmt->bindParam(1, $user_id, PDO::PARAM_INT);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($result) {
                    http_response_code(200);
                    echo json_encode($result); // Retorna la información del usuario
                } else {
                    sendResponse(404, 'Usuario no encontrado');
                }
            } catch (PDOException $e) {
                sendResponse(500, 'Error en la base de datos: ' . $e->getMessage());
            }
        } else {
            sendResponse(400, 'ID de usuario no encontrado en la cookie');
        }
    } else {
        sendResponse(400, 'Usuario no autenticado'); // Respuesta si la cookie no está presente
    }
}

// Función para actualizar los datos del usuario
function updateUserData()
{
    global $pdo;

    if (isset($_COOKIE['user']) && isset($_POST['name']) && isset($_POST['phone'])) {
        $userData = json_decode($_COOKIE['user'], true); // Decodifica el JSON
        $user_id = $userData['id']; // Obtiene el ID del usuario
        $name = $_POST['name'];
        $phone = $_POST['phone'];

        try {
            $stmt = $pdo->prepare("UPDATE Cliente SET nombre = ?, telefono = ? WHERE id = ?");
            $stmt->bindParam(1, $name, PDO::PARAM_STR);
            $stmt->bindParam(2, $phone, PDO::PARAM_STR);
            $stmt->bindParam(3, $user_id, PDO::PARAM_INT);
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(['success' => true]);
            } else {
                sendResponse(500, 'Error al actualizar los datos');
            }
        } catch (PDOException $e) {
            sendResponse(500, 'Error en la base de datos: ' . $e->getMessage());
        }
    } else {
        sendResponse(400, 'Datos incompletos');
    }
}

// Función para enviar respuestas con código de estado
function sendResponse($status_code, $message)
{
    http_response_code($status_code);
    echo json_encode(['status' => 'Error', 'message' => $message]);
    exit;
}
