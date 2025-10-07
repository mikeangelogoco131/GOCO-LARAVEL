<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['code','name'];

    public function courses() { return $this->hasMany(Course::class); }
    public function faculties() { return $this->hasMany(Faculty::class); }
    public function students() { return $this->hasMany(Student::class); }
}
