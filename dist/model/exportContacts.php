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
    if (isset($_GET['action']) && $_GET['action'] === 'export') {
        exportContacts();
    } else {
        countContacts();
    }
} else {
    sendResponse(405, 'Método no permitido');
}

// Función para exportar contactos
function exportContacts()
{
    global $pdo;

    try {
        // Consulta para obtener contactos
        $stmt = $pdo->prepare("SELECT nombre, correo, telefono FROM Cliente");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            // Generar CSV
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="contactos.csv"');
            header('Pragma: no-cache');
            header('Expires: 0');

            $output = fopen('php://output', 'w');
            fputcsv($output, ['Nombre', 'Correo', 'Telefono']); // Encabezados

            foreach ($result as $row) {
                fputcsv($output, $row);
            }
            fclose($output);
            exit;
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'Error', 'message' => 'No se encontraron contactos']);
            exit;
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'Error', 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
        exit;
    }
}

// Función para contar contactos
function countContacts()
{
    global $pdo;

    try {
        // Consulta para contar contactos
        $stmt = $pdo->prepare("SELECT COUNT(*) AS total FROM Cliente");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Devolver el resultado en JSON
        http_response_code(200);
        echo json_encode($row);
        exit;
    } catch (PDOException $e) {
        sendResponse(500, 'Error en la base de datos: ' . $e->getMessage());
    }
}
