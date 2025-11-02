<!DOCTYPE html>
<html>
<head>
    <title>Notifikasi Reset Password Admin</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { width: 90%; margin: auto; padding: 20px; }
        .button {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            border: none;
            cursor: pointer;
        }
        p { margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <p>Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.</p>
        
        <p>Silakan klik tombol di bawah untuk me-reset password Anda:</p>
        
        <a href="{{ $resetUrl }}" class="button">
            Reset Password
        </a>
        
        <p style="margin-top: 20px;">Link ini akan kedaluwarsa dalam 60 menit.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
    </div>
</body>
</html>