<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Datos de conexión a MySQL (Verifica que coincidan con tu servidor)
$host = "sqlXXX.infinityfree.com"; // Reemplaza por tu Host Name de MySQL
$user = "if0_XXXXXXXX";             // Reemplaza por tu MySQL Username
$password = "TU_CONTRASEÑA_AQUI";        // Reemplaza por tu contraseña de vPanel
$database = "if0_XXXXXXXX_burgermaster"; // Reemplaza por tu nombre de BD

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

$metodo = $_SERVER['REQUEST_METHOD'];

// REGISTRAR UN NUEVO PEDIDO (POST)
if ($metodo === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['cliente']) || !isset($data['total'])) {
        echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
        exit();
    }

    $cliente = $conn->real_escape_string($data['cliente']);
    $total = floatval($data['total']);

    $sql = "INSERT INTO pedidos (cliente, total) VALUES ('$cliente', $total)";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "ok", "id" => $conn->insert_id]);
    } else {
        echo json_encode(["status" => "error", "error" => $conn->error]);
    }
} 
// CONSULTAR EL HISTORIAL DE VENTAS (GET)
else if ($metodo === 'GET') {
    $sql = "SELECT id, cliente, total, fecha FROM pedidos ORDER BY fecha DESC";
    $result = $conn->query($sql);

    $pedidos = array();
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $pedidos[] = $row;
        }
    }
    echo json_encode($pedidos);
}

$conn->close();
?>