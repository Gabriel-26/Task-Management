<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Fine-grained check will be done in controller/policy
    }

    public function rules(): array
    {
        return [
            'statement' => 'required|string|max:255',
            'due_date' => 'required|date',
            'order' => 'nullable|integer',
        ];
    }
}
