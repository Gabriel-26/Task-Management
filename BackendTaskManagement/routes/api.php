<?php


use App\Http\Controllers\ResourceController;
use App\Http\Controllers\AuthController;


Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [AuthController::class, 'getUser']); // new route
    Route::get('tasks', [ResourceController::class, 'index']);
    Route::get('tasks/search', [ResourceController::class, 'search']);
    Route::post('tasks', [ResourceController::class, 'store']);
    Route::get('tasks/{task}', [ResourceController::class, 'show']);
    Route::put('tasks/{task}', [ResourceController::class, 'update']);
    Route::delete('tasks/{task}', [ResourceController::class, 'destroy']);
    Route::patch('tasks/{task}/toggle', [ResourceController::class, 'toggleCompleted']);
    Route::patch('tasks/{task}/order', [ResourceController::class, 'updateOrder']);

});

