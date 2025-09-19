<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Task;
use App\Models\User;

class TaskFactory extends Factory
{
    // The name of the factory’s corresponding model.
    protected $model = Task::class;

    /**
     * Define the model’s default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'   => User::factory(), // Creates a user if not provided
            'statement' => $this->faker->sentence(6), // Random task statement
            'due_date'  => $this->faker->date(),      // Random due date
            'completed' => $this->faker->boolean(20), // 20% chance completed
            'order'     => $this->faker->numberBetween(1, 10),
        ];
    }
}
