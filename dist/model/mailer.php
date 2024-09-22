<?php
include 'secrets.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './lib/PHPMailer-master/src/Exception.php';
require './lib/PHPMailer-master/src/PHPMailer.php';
require './lib/PHPMailer-master/src/SMTP.php';

function sendConfirmMail($recipient) {
    global $email, $email_pass; // Asegura que estas variables se puedan usar dentro de la función.

    // Crea la instancia de PHPMailer dentro de la función
    $mail = new PHPMailer(true);

    try {
        // Configuracion del servidor SMTP
        $mail->isSMTP();                                     
        $mail->Host = 'smtp.gmail.com';  // Servidor SMTP de Gmail
        $mail->SMTPAuth = true;                              
        $mail->Username = $email;                
        $mail->Password = $email_pass;                    
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;  
        $mail->Port = 587;                                   

        // Remitente y destinatario
        $mail->setFrom($email, 'Fut7Montessori');
        $mail->addAddress($recipient); 

        // Contenido del correo
        $mail->isHTML(true);                                 
        $mail->Subject = 'Confirmacion de Reservacion';
        $mail->Body = 'Hemos recibido tu pago. <b>¡Tu reservacion ha sido confirmada!</b>';
        $mail->AltBody = 'Hemos recibido tu pago. ¡Tu reservacion ha sido confirmada!';

        $mail->send();
        echo 'Correo enviado exitosamente';
    } catch (Exception $e) {
        echo "El envío del correo ha fallado. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>