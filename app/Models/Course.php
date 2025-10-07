<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['code','title','department_id'];

    public function department() { return $this->belongsTo(Department::class); }
    public function students() { return $this->hasMany(Student::class); }
}
