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
        $frontendUrl = env('FRONTEND_URL', 'https://magang.pekanbaru.go.id/');

        // Buat URL lengkap untuk reset password di frontend Anda
        $resetUrl = $frontendUrl . '/#reset-password?token=' . $this->token . '&email=' . $this->email;

        return (new MailMessage)
                    ->subject('Notifikasi Reset Password Admin')
                    ->line('Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.')
                    ->action('Reset Password', $resetUrl) // Tombol akan mengarah ke frontend
                    ->line('Token ini akan kedaluwarsa dalam 60 menit.')
                    ->line('Jika Anda tidak meminta reset password, abaikan email ini.');
    }
}