<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskStoreRequest;
use App\Http\Requests\TaskUpdateRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Repositories\TaskRepository;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    protected TaskRepository $tasks;

    public function __construct(TaskRepository $tasks)
    {
        $this->tasks = $tasks;
        
    }

    public function index(Request $request)
    {
        try {
            $tasks = $this->tasks->allByUser($request->user()->id, $request->date);
            return TaskResource::collection($tasks);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }
    

    public function search(Request $request)
    {
        $keyword = $request->query('search', ''); // get `?search=...` param
        $tasks = $this->tasks->search($request->user()->id, $keyword);
        return TaskResource::collection($tasks);
    }
    

    public function store(TaskStoreRequest $request)
    {
        $task = $this->tasks->create(array_merge(
            $request->validated(),
            ['user_id' => $request->user()->id]
        ));

        return new TaskResource($task);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        return new TaskResource($task);
    }

    public function update(TaskUpdateRequest $request, Task $task)
    {
        $this->authorize('update', $task);
        $task = $this->tasks->update($task, $request->validated());
        return new TaskResource($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $this->tasks->delete($task);
        return response()->noContent();
    }

    public function toggleCompleted(Task $task)
    {
        $this->authorize('toggleCompleted', $task);
        $task = $this->tasks->toggleCompleted($task);
        return new TaskResource($task);
    }

    public function updateOrder(Request $request, Task $task)
{
    $this->authorize('update', $task);

    $request->validate([
        'order' => 'required|integer',
    ]);

    $task = $this->tasks->updateOrder($task, $request->order);

    return new TaskResource($task);
}

}
