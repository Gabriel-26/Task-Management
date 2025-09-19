<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'statement' => 'sometimes|required|string|max:255',
            'due_date' => 'sometimes|required|date',
            'order' => 'nullable|integer',
            'completed' => 'sometimes|boolean',
        ];
    }
}
