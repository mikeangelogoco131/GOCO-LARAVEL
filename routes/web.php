<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Single-page app entry - we still gate access server-side for top-level routes
Route::get('/', function () { return view('welcome'); });

// Auth routes
// Auth actions (SPA renders forms, backend processes)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth')->group(function () {
	Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
	Route::post('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');
});

// Let the SPA handle the following GET routes client-side; server always returns the same shell
Route::get('/login', function () { return view('welcome'); })->name('login');
Route::get('/register', function () { return view('welcome'); })->name('register');
Route::get('/dashboard', function () { return view('welcome'); })->name('dashboard');
Route::get('/faculty', function () { return view('welcome'); })->name('faculty.index');
Route::get('/students', function () { return view('welcome'); })->name('students.index');
Route::get('/reports', function () { return view('welcome'); })->name('reports');
Route::get('/settings', function () { return view('welcome'); })->name('settings');
Route::get('/profile', function () { return view('welcome'); })->name('profile');
