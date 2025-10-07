<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Course;
use App\Models\Department;
use App\Models\Student;
use App\Models\Faculty;

class IdGenerationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function student_ids_are_10_digit_numeric_with_year_prefix()
    {
        $dept = Department::factory()->create();
        $course = Course::factory()->create(['department_id' => $dept->id]);

        $res1 = $this->postJson('/api/students', [
            'first_name' => 'A', 'last_name' => 'B', 'email' => 'a@example.com',
            'course_id' => $course->id, 'department_id' => $dept->id
        ]);
        $res1->assertCreated();
        $id1 = $res1->json('student_id');
        $this->assertMatchesRegularExpression('/^\d{10}$/', $id1);
        $this->assertStringStartsWith(date('Y'), $id1);

        $res2 = $this->postJson('/api/students', [
            'first_name' => 'C', 'last_name' => 'D', 'email' => 'c@example.com',
            'course_id' => $course->id, 'department_id' => $dept->id
        ]);
        $res2->assertCreated();
        $id2 = $res2->json('student_id');
        $this->assertMatchesRegularExpression('/^\d{10}$/', $id2);
        $this->assertTrue(((int)substr($id2, 4)) === ((int)substr($id1, 4)) + 1);
    }

    /** @test */
    public function faculty_ids_are_10_digit_numeric_with_year_prefix()
    {
        $dept = Department::factory()->create();

        $res1 = $this->postJson('/api/faculties', [
            'first_name' => 'John', 'last_name' => 'Doe', 'email' => 'jd@example.com',
            'department_id' => $dept->id
        ]);
        $res1->assertCreated();
        $fid1 = $res1->json('faculty_id');
        $this->assertMatchesRegularExpression('/^\d{10}$/', $fid1);
        $this->assertStringStartsWith(date('Y'), $fid1);

        $res2 = $this->postJson('/api/faculties', [
            'first_name' => 'Jane', 'last_name' => 'Doe', 'email' => 'jane@example.com',
            'department_id' => $dept->id
        ]);
        $res2->assertCreated();
        $fid2 = $res2->json('faculty_id');
        $this->assertMatchesRegularExpression('/^\d{10}$/', $fid2);
        $this->assertTrue(((int)substr($fid2, 4)) === ((int)substr($fid1, 4)) + 1);
    }
}
