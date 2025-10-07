<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Student::query()->with(['course','department','academicYear']);
        if ($request->filled('search')) {
            $s = $request->string('search');
            $q->where(fn($qq) => $qq
                ->where('first_name','like',"%$s%")
                ->orWhere('last_name','like',"%$s%")
                ->orWhere('middle_name','like',"%$s%")
                ->orWhere('suffix','like',"%$s%")
                ->orWhere('student_id','like',"%$s%")
                ->orWhere('email','like',"%$s%")
            );
        }
        if ($request->filled('course_id')) $q->where('course_id', $request->integer('course_id'));
        if ($request->filled('department_id')) $q->where('department_id', $request->integer('department_id'));
        if ($request->filled('academic_year_id')) $q->where('academic_year_id', $request->integer('academic_year_id'));
        if ($request->filled('status')) $q->where('status', $request->input('status'));
    $per = max(1, min(2000, (int) $request->input('per_page', 20)));
    return $q->paginate($per);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required','string','max:100'],
            'middle_name' => ['nullable','string','max:100'],
            'last_name' => ['required','string','max:100'],
            'suffix' => ['nullable','string','max:20'],
            'gender' => ['nullable', Rule::in(['male','female','other'])],
            'birthday' => ['nullable','date','before:today'],
            'email' => ['required','email','max:150','unique:students,email'],
            'course_id' => ['required','exists:courses,id'],
            'department_id' => ['required','exists:departments,id'],
            'academic_year_id' => ['nullable','exists:academic_years,id'],
            'status' => ['nullable', Rule::in(['active','archived'])],
        ]);

        // Generate student_id: 10-digit numeric (YYYY + 6-digit sequence), using academic_year if provided, else current year
        $year = null;
        if (!empty($data['academic_year_id'])) {
            $ay = \App\Models\AcademicYear::find($data['academic_year_id']);
            if ($ay && preg_match('/^(\d{4})/', (string) $ay->name, $m)) {
                $year = $m[1]; // take the starting year
            }
        }
        if (!$year) {
            $year = date('Y');
        }

        // Find next sequence for given year (based on student_sequence)
        $seq = (int) Student::where('student_id','like', $year.'%')
            ->max('student_sequence');
        $nextSeq = $seq ? $seq + 1 : 1;
        // Pad sequence to 6 digits and concatenate with year
        $studentId = $year . str_pad((string) $nextSeq, 6, '0', STR_PAD_LEFT);

        $data['student_id'] = $studentId;
        $data['student_sequence'] = $nextSeq;

        $student = Student::create($data);
        return response()->json($student->load(['course','department','academicYear']), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function show(Student $student)
    {
    return $student->load(['course','department','academicYear']);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'first_name' => ['sometimes','required','string','max:100'],
            'middle_name' => ['sometimes','nullable','string','max:100'],
            'last_name' => ['sometimes','required','string','max:100'],
            'suffix' => ['sometimes','nullable','string','max:20'],
            'gender' => ['sometimes','nullable', Rule::in(['male','female','other'])],
            'birthday' => ['sometimes','nullable','date','before:today'],
            'email' => ['sometimes','required','email','max:150', Rule::unique('students','email')->ignore($student->id)],
            'course_id' => ['sometimes','required','exists:courses,id'],
            'department_id' => ['sometimes','required','exists:departments,id'],
            'academic_year_id' => ['sometimes','nullable','exists:academic_years,id'],
            'status' => ['sometimes', Rule::in(['active','archived'])],
        ]);
        $student->update($data);
        return $student->refresh()->load(['course','department','academicYear']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function destroy(Student $student)
    {
        $student->status = 'archived';
        $student->save();
        $student->delete();
        return response()->json(['message' => 'Archived']);
    }

    public function archived(Request $request)
    {
        $q = Student::onlyTrashed()->with(['course','department','academicYear']);
        if ($request->filled('search')) {
            $s = $request->string('search');
            $q->where(fn($qq) => $qq
                ->where('first_name','like',"%$s%")
                ->orWhere('last_name','like',"%$s%")
                ->orWhere('middle_name','like',"%$s%")
                ->orWhere('suffix','like',"%$s%")
                ->orWhere('student_id','like',"%$s%")
                ->orWhere('email','like',"%$s%")
            );
        }
        if ($request->filled('course_id')) $q->where('course_id', $request->integer('course_id'));
        if ($request->filled('department_id')) $q->where('department_id', $request->integer('department_id'));
        if ($request->filled('academic_year_id')) $q->where('academic_year_id', $request->integer('academic_year_id'));
    $per = max(1, min(2000, (int) request()->input('per_page', 20)));
    return $q->paginate($per);
    }

    public function restore($id)
    {
        $student = Student::onlyTrashed()->findOrFail($id);
        $student->restore();
        $student->update(['status' => 'active']);
    return $student->load(['course','department','academicYear']);
    }
}
