<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DashboardController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. Public Welcome Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// 2. Dashboard (Controller handles stats including vehicleModelData)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth','verified'])
    ->name('dashboard');

// 3. Protected Routes (User must be logged in)
Route::middleware('auth')->group(function () {

    // --- PROFILE MANAGEMENT ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- OWNER MODULE (CRUD) ---
    Route::resource('owners', OwnerController::class)->except(['create', 'edit', 'show']);

    // --- VEHICLE MODULE (CRUD) ---
    Route::resource('vehicles', VehicleController::class)->except(['create', 'edit', 'show']);

    // --- REGISTRATION MODULE (CRUD) ---
    Route::resource('registrations', RegistrationController::class)->except(['create', 'edit', 'show']);

    // --- PAYMENT MODULE (CRUD) ---
    Route::resource('payments', PaymentController::class)->except(['create', 'edit', 'show']);
});

// 4. Auth routes (Login/Register)
require __DIR__.'/auth.php';