<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Balasan Pengajuan Magang</title>
    <style>
        body { margin: 0; padding: 0; width: 100% !important; font-family: Arial, sans-serif; }
    </style>
</head>
<body style="background-color: #f4f4f4; margin: 0; padding: 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin: 20px auto;">
                    <tr>
                        <td align="center" style="padding: 30px 30px 20px 30px;">
                            <h1 style="font-size: 24px; color: #333333; margin: 0; font-weight: 600;">Pengajuan Magang Anda Diterima</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="padding: 0 30px 30px 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                            <p style="margin: 0;">Halo,</p>
                            <p style="margin-top: 15px;">Selamat! Pengajuan magang Anda telah kami proses dan diterima. Silakan unduh surat balasan resmi yang terlampir dalam email ini.</p>
                            <p style="margin-top: 15px;">Berikut adalah detail penempatan Anda:</p>
                            <ul style="list-style-type: none; padding-left: 0;">
                                <li style="margin-bottom: 10px;"><strong>Bidang Penempatan:</strong> {{ $data['bidang_penempatan'] ?? 'N/A' }}</li>
                                <li style="margin-bottom: 10px;"><strong>Nama Pembimbing:</strong> {{ $data['nama_pembimbing'] ?? 'N/A' }}</li>
                                <li style="margin-bottom: 10px;"><strong>Kontak Pembimbing (HP):</strong> {{ $data['kontak_pembimbing'] ?? 'N/A' }}</li>
                            </ul>
                            @if(!empty($data['catatan']))
                                <p style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #0d6efd; color: #555;">
                                    <strong>Catatan dari Admin:</strong><br>
                                    {{ $data['catatan'] }}
                                </p>
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; text-align: center; font-size: 12px; color: #aaaaaa; border-top: 1px solid #e4e4e4;">
                            &copy; 2025 Diskomifotiksan. Semua Hak Cipta Dilindungi.<br>
                            Kantor Wali Kota Pekanbaru, Tenayan Raya, Kota Pekanbaru
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>