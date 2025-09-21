<?php

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// uses(RefreshDatabase::class);
uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    // Create and authenticate a user
    $this->user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);
    $this->actingAs($this->user, 'sanctum');
});
it('can fetch a single task by ID', function () {
    // Create a task
    $task = Task::factory()->create([
        'user_id' => $this->user->id,
        'statement' => 'Test fetching single task',
    ]);

    $response = $this->getJson("/api/tasks/{$task->id}");

    $response->assertStatus(200)
        ->assertJsonFragment([
            'id' => $task->id,
            'statement' => 'Test fetching single task',
        ]);
});

it('can create a task', function () {
    $payload = [
        'statement' => 'Finish Laravel exam',
        'due_date' => now()->toDateString(),
        'order' => 1,
    ];

    $response = $this->postJson('/api/tasks', $payload);

    $response->assertStatus(201)
        ->assertJsonFragment(['statement' => 'Finish Laravel exam']);

    $this->assertDatabaseHas('tasks', [
        'statement' => 'Finish Laravel exam',
        'user_id' => $this->user->id,
    ]);
});

it('can fetch all tasks for a specific date', function () {
    Task::factory()->count(3)->create([
        'user_id' => $this->user->id,
        'due_date' => now()->toDateString(),
    ]);

    $response = $this->getJson('/api/tasks?date=' . now()->toDateString());

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');
});

it('can update a task', function () {
    $task = Task::factory()->create(['user_id' => $this->user->id]);

    $response = $this->putJson("/api/tasks/{$task->id}", [
        'statement' => 'Updated task statement',
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment(['statement' => 'Updated task statement']);

    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'statement' => 'Updated task statement',
    ]);
});

it('can toggle a task as completed', function () {
    $task = Task::factory()->create([
        'user_id' => $this->user->id,
        'completed' => false,
    ]);

    $response = $this->patchJson("/api/tasks/{$task->id}/toggle");

    $response->assertStatus(200)
        ->assertJsonFragment(['completed' => true]);

    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'completed' => true,
    ]);
});

it('can delete a task', function () {
    $task = Task::factory()->create(['user_id' => $this->user->id]);

    $response = $this->deleteJson("/api/tasks/{$task->id}");

    $response->assertStatus(204);

    $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
});

it('can search tasks by keyword', function () {
    Task::factory()->create([
        'user_id' => $this->user->id,
        'statement' => 'Buy groceries',
    ]);

    Task::factory()->create([
        'user_id' => $this->user->id,
        'statement' => 'Finish report',
    ]);

    $response = $this->getJson('/api/tasks/search?search=groceries');

    $response->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonFragment(['statement' => 'Buy groceries']);
});

it('can update the order of a task', function () {
    $task = Task::factory()->create([
        'user_id' => $this->user->id,
        'order' => 1,
    ]);

    $response = $this->patchJson("/api/tasks/{$task->id}/order", [
        'order' => 5,
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment(['order' => 5]);

    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'order' => 5,
    ]);
});
