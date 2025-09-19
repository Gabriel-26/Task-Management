<?php

namespace App\Repositories;

use App\Models\Task;

class TaskRepository
{
    public function allByUser(int $userId, ?string $date = null)
    {
        $query = Task::where('user_id', $userId);
        if ($date) {
            $query->whereDate('due_date', $date);
        }
        return $query->orderBy('order')->get();
    }

    public function search(int $userId, string $keyword)
    {
        return Task::where('user_id', $userId)
            ->where('statement', 'like', "%{$keyword}%")
            ->orderBy('order')
            ->get();
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task;
    }

    public function delete(Task $task): bool
    {
        return $task->delete();
    }

    public function toggleCompleted(Task $task): Task
    {
        $task->completed = !$task->completed;
        $task->save();
        return $task;
    }

    public function updateOrder(Task $task, int $order): Task
    {
        $task->order = $order;
        $task->save();
        return $task;
    }
}
