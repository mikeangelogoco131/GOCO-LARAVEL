<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition()
    {
        return [
            'code' => strtoupper($this->faker->unique()->bothify('CSE###')),
            'title' => $this->faker->sentence(3),
            'department_id' => Department::factory(),
        ];
    }
}
