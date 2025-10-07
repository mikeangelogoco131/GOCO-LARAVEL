<?php

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepartmentFactory extends Factory
{
    protected $model = Department::class;

    public function definition()
    {
        return [
            'code' => strtoupper($this->faker->unique()->bothify('DEPT##')),
            'name' => $this->faker->unique()->company() . ' Department',
        ];
    }
}
