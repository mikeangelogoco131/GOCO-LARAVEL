<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Log;
use App\Models\ContactMessage;

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
// Public Home (landing) page shown before login/register; redirect authed users to dashboard
Route::get('/', function () {
	if (auth()->check()) {
		return redirect()->route('dashboard');
	}
	return view('home');
})->name('home');

// Auth routes
// Auth actions (SPA renders forms, backend processes)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth')->group(function () {
	Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
	Route::post('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');
});

// Let the SPA handle the following GET routes client-side; server always returns the same shell
Route::get('/login', function () {
	if (auth()->check()) {
		return redirect()->route('dashboard');
	}
	return view('welcome');
})->name('login');
Route::get('/register', function () {
	if (auth()->check()) {
		return redirect()->route('dashboard');
	}
	return view('welcome');
})->name('register');
Route::get('/dashboard', function () { return view('welcome'); })->name('dashboard');
Route::get('/faculty', function () { return view('welcome'); })->name('faculty.index');
Route::get('/students', function () { return view('welcome'); })->name('students.index');
Route::get('/reports', function () { return view('welcome'); })->name('reports');
Route::get('/settings', function () { return view('welcome'); })->name('settings');
Route::get('/profile', function () { return view('welcome'); })->name('profile');
Route::post('/profile/photo/delete', [App\Http\Controllers\AuthController::class, 'deleteProfilePhoto'])->name('profile.photo.delete');
Route::post('/profile/photo', [App\Http\Controllers\AuthController::class, 'uploadProfilePhoto'])->name('profile.photo.upload');
Route::get('/contact-manager', function () { return view('welcome'); })->name('contact.manager');

// Simple contact endpoint (public)
Route::post('/contact', function (\Illuminate\Http\Request $request) {
	$data = $request->validate([
		'name' => ['required','string','max:120'],
		'email' => ['required','email','max:150'],
		'message' => ['required','string','max:2000'],
	]);
	// Save to DB
	$msg = ContactMessage::create($data);
	Log::info('Contact message saved', ['id' => $msg->id] + $data);
	if ($request->expectsJson()) {
		return response()->json(['ok' => true, 'id' => $msg->id]);
	}
	return back()->with('status', 'Message sent!');
});
