<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\User;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure you have at least one user
        $user = User::first() ?? User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Create sample tasks
        Task::create([
            'user_id' => $user->id,
            'statement' => 'Buy groceries',
            'completed' => false,
            'priority' => 2,
            'due_date' => now()->addDays(2),
            'order' => 1,
        ]);

        Task::create([
            'user_id' => $user->id,
            'statement' => 'Finish Laravel exam',
            'completed' => false,
            'priority' => 1,
            'due_date' => now()->addDays(1),
            'order' => 2,
        ]);

        Task::create([
            'user_id' => $user->id,
            'statement' => 'Clean the house',
            'completed' => true,
            'priority' => 3,
            'due_date' => now()->addDays(3),
            'order' => 3,
        ]);
    }
}
