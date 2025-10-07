<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faculty extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'faculty_id',
        'faculty_sequence',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'position',
        'email',
        'department_id',
        'status'
    ];

    public function department() { return $this->belongsTo(Department::class); }
}
