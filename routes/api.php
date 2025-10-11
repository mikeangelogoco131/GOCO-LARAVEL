<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\Department;
use App\Http\Controllers\ContactMessageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// REST resources
Route::apiResource('students', \App\Http\Controllers\StudentController::class);
Route::get('students-archived', [\App\Http\Controllers\StudentController::class, 'archived']);
Route::post('students/{id}/restore', [\App\Http\Controllers\StudentController::class, 'restore']);

Route::apiResource('faculties', \App\Http\Controllers\FacultyController::class);
Route::get('faculties-archived', [\App\Http\Controllers\FacultyController::class, 'archived']);
Route::post('faculties/{id}/restore', [\App\Http\Controllers\FacultyController::class, 'restore']);

Route::apiResource('courses', \App\Http\Controllers\CourseController::class);
Route::get('courses-archived', [\App\Http\Controllers\CourseController::class, 'archived']);
Route::post('courses/{id}/restore', [\App\Http\Controllers\CourseController::class, 'restore']);
Route::apiResource('departments', \App\Http\Controllers\DepartmentController::class);
Route::get('departments-archived', [\App\Http\Controllers\DepartmentController::class, 'archived']);
Route::post('departments/{id}/restore', [\App\Http\Controllers\DepartmentController::class, 'restore']);
Route::apiResource('academic-years', \App\Http\Controllers\AcademicYearController::class);
Route::get('academic-years-archived', [\App\Http\Controllers\AcademicYearController::class, 'archived']);
Route::post('academic-years/{id}/restore', [\App\Http\Controllers\AcademicYearController::class, 'restore']);

// Summary for dashboard
Route::get('summary', function() {
    return [
        'totals' => [
            'students' => Student::count(),
            'faculty' => Faculty::count(),
            'courses' => Course::count(),
            'departments' => Department::count(),
        ],
        'studentsPerCourse' => Course::withCount('students')->get()->map(fn($c)=>['course'=>$c->code, 'count'=>$c->students_count])->values(),
        'facultyPerDepartment' => Department::withCount('faculties')->get()->map(fn($d)=>['department'=>$d->code, 'count'=>$d->faculties_count])->values(),
    ];
});

// Contact messages (manager) — protect if needed later with auth:sanctum
Route::get('contact-messages', [ContactMessageController::class, 'index']);
Route::put('contact-messages/{id}', [ContactMessageController::class, 'update']);
Route::delete('contact-messages/{id}', [ContactMessageController::class, 'destroy']);
