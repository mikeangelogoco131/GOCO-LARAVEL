<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Faculty::query()->with('department');
        if ($request->filled('search')) {
            $s = trim((string) $request->input('search', ''));
            $q->where(fn($qq) => $qq
                ->where('first_name','like',"%$s%")
                ->orWhere('last_name','like',"%$s%")
                ->orWhere('middle_name','like',"%$s%")
                ->orWhere('suffix','like',"%$s%")
                ->orWhere('faculty_id','like',"%$s%")
                ->orWhere('email','like',"%$s%")
                ->orWhere('position','like',"%$s%")
            );
        }
    if ($request->filled('department_id')) $q->where('department_id', (int) $request->input('department_id'));
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
            'position' => ['nullable','string','max:150', Rule::in(['Professor','Instructor','Dean'])],
            'email' => ['required','email','max:150','unique:faculties,email'],
            'department_id' => ['required','exists:departments,id'],
            'status' => ['nullable', Rule::in(['active','archived'])],
        ]);

    // Generate faculty_id: 10-digit numeric (YYYY + 6-digit sequence)
    $year = date('Y');
    $seq = (int) Faculty::where('faculty_id','like', $year.'%')->max('faculty_sequence');
    $nextSeq = $seq ? $seq + 1 : 1;
    $facultyId = $year . str_pad((string) $nextSeq, 6, '0', STR_PAD_LEFT);
    $data['faculty_id'] = $facultyId;
        $data['faculty_sequence'] = $nextSeq;

        $faculty = Faculty::create($data);
        return response()->json($faculty->load('department'), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Faculty  $faculty
     * @return \Illuminate\Http\Response
     */
    public function show(Faculty $faculty)
    {
        return $faculty->load('department');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Faculty  $faculty
     * @return \Illuminate\Http\Response
     */
    public function edit(Faculty $faculty)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Faculty  $faculty
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Faculty $faculty)
    {
        $data = $request->validate([
            'first_name' => ['sometimes','required','string','max:100'],
            'middle_name' => ['sometimes','nullable','string','max:100'],
            'last_name' => ['sometimes','required','string','max:100'],
            'suffix' => ['sometimes','nullable','string','max:20'],
            'position' => ['sometimes','nullable','string','max:150', Rule::in(['Professor','Instructor','Dean'])],
            'email' => ['sometimes','required','email','max:150', Rule::unique('faculties','email')->ignore($faculty->id)],
            'department_id' => ['sometimes','required','exists:departments,id'],
            'status' => ['sometimes', Rule::in(['active','archived'])],
        ]);
        $faculty->update($data);
        return $faculty->refresh()->load('department');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Faculty  $faculty
     * @return \Illuminate\Http\Response
     */
    public function destroy(Faculty $faculty)
    {
        $faculty->status = 'archived';
        $faculty->save();
        $faculty->delete();
        return response()->json(['message' => 'Archived']);
    }

    public function archived()
    {
        $q = Faculty::onlyTrashed()->with('department');
        if (request()->filled('search')) {
            $s = trim((string) request()->input('search', ''));
            $q->where(fn($qq) => $qq
                ->where('first_name','like',"%$s%")
                ->orWhere('last_name','like',"%$s%")
                ->orWhere('email','like',"%$s%")
                ->orWhere('position','like',"%$s%")
            );
        }
    if (request()->filled('department_id')) $q->where('department_id', (int) request()->input('department_id'));
    $per = max(1, min(2000, (int) request()->input('per_page', 20)));
    return $q->paginate($per);
    }

    public function restore($id)
    {
        $faculty = Faculty::onlyTrashed()->findOrFail($id);
        $faculty->restore();
        $faculty->update(['status' => 'active']);
        return $faculty->load('department');
    }

    public function forceDelete($id)
    {
        $faculty = Faculty::onlyTrashed()->findOrFail($id);
        $faculty->forceDelete();
        return response()->json(['message' => 'Deleted']);
    }
}
