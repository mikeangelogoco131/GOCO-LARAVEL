<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'student_sequence',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'gender',
    'birthday',
        'email',
        'course_id',
        'department_id',
        'academic_year_id',
        'status'
    ];

    public function course() { return $this->belongsTo(Course::class); }
    public function department() { return $this->belongsTo(Department::class); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
}
