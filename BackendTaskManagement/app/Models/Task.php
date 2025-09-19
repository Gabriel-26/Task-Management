<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    // Fields that can be mass-assigned
    protected $fillable = [
        'user_id',
        'statement',
        'completed',
        'priority',
        'due_date',
        'order',
    ];

    // Optional: cast completed to boolean
    protected $casts = [
        'completed' => 'boolean',
        'due_date' => 'date',
    ];

    // Relationship: Task belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
