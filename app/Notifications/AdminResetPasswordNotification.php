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

        $adminBaseUrl = rtrim($frontendUrl, '/') . '/admin';

        // Buat URL lengkap untuk reset password di frontend Anda
        $resetUrl = $adminBaseUrl . '/#reset-password?token=' . $this->token . '&email=' . $this->email;

        return (new MailMessage)
                    ->subject('Notifikasi Reset Password Admin')
                    ->view('emails.admin-reset-password', ['resetUrl' => $resetUrl]);
    }
}