<?php
$errors = [];

if (!empty($_POST)) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    
    if (empty($name)) {
        $errors[] = 'Name is empty';
    }

    if (empty($email)) {
        $errors[] = 'Email is empty';
    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email is invalid';
    }

    if (empty($message)) {
        $errors[] = 'Message is empty';
    }
}





// Ponizszy kod jest bezuzyteczny bez instalacji PHPMailera i Composera TO DO
$mail->Host = "smtp.sendgrid.net";
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;

$mail->Username = "apikey";
$mail->Password = "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";

$mail->serFrom($email, $name);
$mail->addAddress("thatfluffydood@gmail.com", "TestMailing");

$mail->Subject = $name;
$mail->Body = $message;

$mail->sen();