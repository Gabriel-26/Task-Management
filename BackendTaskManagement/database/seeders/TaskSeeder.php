<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;

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

        // Example statements to choose from
        $statements = [
            'Buy groceries',
            'Finish Laravel exam',
            'Clean the house',
            'Prepare presentation slides',
            'Read a new Laravel blog post',
            'Workout at the gym',
            'Call the bank for account inquiry',
            'Plan weekend trip',
            'Fix laptop issues',
            'Submit tax documents',
            'Pay electricity bill',
            'Organize bookshelf',
            'Cook dinner for family',
            'Study Vue.js components',
            'Schedule dentist appointment',
            'Write blog draft about PHP tips',
            'Backup project files',
            'Review pull requests on GitHub',
            'Attend team meeting',
            'Brainstorm side project ideas',
            'Walk the dog',
            'Water the plants',
            'Reply to emails',
            'Update project documentation',
            'Refactor old code',
            'Debug API endpoint',
            'Check database backups',
            'Meet with mentor',
            'Research new tech stack',
            'Plan birthday surprise',
        ];

        // How many tasks you want
        $taskCount = 100;

        // Range: first day of current month -> yesterday (strictly before today)
        $start = Carbon::now()->startOfMonth()->startOfDay();
        $end   = Carbon::yesterday()->endOfDay();

        // Edge case: if today is the 1st of month, there are no prior days in same month.
        // Here we set end == start (you can change logic if you prefer to skip seeding or use previous month).
        if ($end->lt($start)) {
            $end = $start;
        }

        $minTs = $start->timestamp;
        $maxTs = $end->timestamp;

        for ($i = 1; $i <= $taskCount; $i++) {
            // pick a random timestamp in the allowed window
            $dueTimestamp = mt_rand($minTs, $maxTs);
            $dueDate = Carbon::createFromTimestamp($dueTimestamp)->startOfDay();

            $statement = $statements[array_rand($statements)] . " #" . $i;

            Task::create([
                'user_id'   => $user->id,
                'statement' => $statement,
                'completed' => (bool) rand(0, 1),
                'priority'  => rand(1, 3),
                'due_date'  => $dueDate, // Eloquent will handle Carbon instances
                'order'     => $i,
            ]);
        }
    }
}
