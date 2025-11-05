<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AdminResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;
    public $email;

    /**
     * Create a new notification instance.
     */
    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // 1. Ambil URL Frontend dari .env atau gunakan default
        // $frontendUrl = env('FRONTEND_URL', 'https://magang.pekanbaru.go.id/');
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:8000/');

        // 2. Buat URL dasar untuk panel admin
        $adminBaseUrl = rtrim($frontendUrl, '/') . '/admin';

        // 3. Buat URL lengkap untuk reset password di frontend Anda
        // [PERBAIKAN] Menggunakan $adminBaseUrl, bukan $baseUrl
        $resetUrl = $adminBaseUrl . '/#reset-password?token=' . $this->token . '&email=' . urlencode($this->email);

        // 4. Kirim email menggunakan template Blade kustom
        return (new MailMessage)
                    ->subject('Notifikasi Reset Password Admin')
                    // Memanggil view Blade dan meneruskan variabel $resetUrl
                    ->view('emails.admin-reset-password', ['resetUrl' => $resetUrl]);
    }
}