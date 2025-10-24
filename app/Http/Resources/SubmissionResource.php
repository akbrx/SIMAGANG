<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'unique_token' => $this->unique_token,
            'durasi_magang' => $this->durasi_magang,
            'submission_file' => $this->submission_file,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'processed_by' => $this->processed_by,
            // Di sinilah kita melakukan format
            'processed_at' => $this->processed_at ? $this->processed_at->format('d F Y H:i') : null,
            'created_at' => $this->created_at->format('d F Y H:i'),
            'updated_at' => $this->updated_at->format('d F Y H:i'),
            'accepted_at' => $this->accepted_at ? $this->accepted_at->format('d F Y H:i') : null,
            'rejected_at' => $this->rejected_at ? $this->rejected_at->format('d F Y H:i') : null,
            'first_accessed_at' => $this->first_accessed_at ? $this->first_accessed_at->format('d F Y H:i') : null,
            'student' => $this->whenLoaded('student'),
            'processor' => $this->whenLoaded('processor'),
            'original_filename' => $this->original_filename,
        ];
    }
}