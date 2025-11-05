<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class SuratBalasanMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $mailData;
    public string $filePath;

    /**
     * Buat instance pesan baru.
     */
    public function __construct(array $mailData, string $filePath)
    {
        $this->mailData = $mailData;
        $this->filePath = $filePath;
    }

    /**
     * Dapatkan subjek pesan.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Balasan Pengajuan Magang Anda Telah Diterima',
        );
    }

    /**
     * Dapatkan konten pesan.
     */
    public function content(): Content
    {
        // Kita akan membuat view 'emails.surat-balasan'
        return new Content(
            view: 'emails.surat-balasan', 
            with: [
                'data' => $this->mailData,
            ],
        );
    }

    /**
     * Dapatkan lampiran untuk pesan.
     */
    public function attachments(): array
    {
        return [
            // Lampirkan file PDF dari storage
            Attachment::fromPath($this->filePath)
                ->as('Surat_Balasan.pdf')
                ->withMime('application/pdf'),
        ];
    }
}