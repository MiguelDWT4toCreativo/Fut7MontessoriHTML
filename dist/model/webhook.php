<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'db.php';
include 'mailer.php';

require_once './lib/stripe-php-15.7.0/init.php';
require_once './secrets.php';

\Stripe\Stripe::setApiKey($stripeSecretKey);
// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
$endpoint_secret = $webhookSecret;

$payload = @file_get_contents('php://input');
$event = null;

try {
  $event = \Stripe\Event::constructFrom(
    json_decode($payload, true)
  );
} catch(\UnexpectedValueException $e) {
  // Invalid payload
  echo '⚠️  Webhook error while parsing basic request.';
  http_response_code(400);
  exit();
}
if ($endpoint_secret) {
  // Only verify the event if there is an endpoint secret defined
  // Otherwise use the basic decoded event
  $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
  try {
    $event = \Stripe\Webhook::constructEvent(
      $payload, $sig_header, $endpoint_secret
    );
  } catch(\Stripe\Exception\SignatureVerificationException $e) {
    // Invalid signature
    echo '⚠️  Webhook error while validating signature.';
    http_response_code(400);
    exit();
  }
}

// Handle the event
switch ($event->type) {
  case 'payment_intent.succeeded':
    $paymentIntent = $event->data->object->client_secret; // contains a \Stripe\PaymentIntent
    $stmt = $pdo->prepare("UPDATE Reserva SET status = 'confirmada' WHERE paymentIntent = ?;");
    $stmt->execute([$paymentIntent]);

    // Preparamos la consulta para obtener el campo customerData
    $stmt = $pdo->prepare("SELECT customerData FROM Reserva WHERE paymentIntent = ?;");
    $stmt->execute([$paymentIntent]);

    // Fetch para obtener el resultado
    $customer_data = $stmt->fetch(PDO::FETCH_ASSOC);

    // Decodificamos el JSON almacenado en el campo customerData
    $customer_data_json = json_decode($customer_data['customerData'], true);

    // Verificamos si el JSON contiene el atributo 'name' y lo mostramos
    if (isset($customer_data_json['email'])) {
      // sendConfirmMail($customer_data_json['email']);
    } 
    // else {
    //     // echo "El atributo 'name' no está presente en el JSON.";
    // }
    break;
  case 'payment_method.attached':
    $paymentMethod = $event->data->object; // contains a \Stripe\PaymentMethod
    // Then define and call a method to handle the successful attachment of a PaymentMethod.
    // handlePaymentMethodAttached($paymentMethod);
    break;
  default:
    // Unexpected event type
    error_log('Received unknown event type');
}

http_response_code(200);