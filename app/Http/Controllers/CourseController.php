<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Course::query()->with('department');
    if ($request->filled('department_id')) $q->where('department_id', (int) $request->input('department_id'));
        if ($request->filled('search')) {
            $s = trim((string) $request->input('search', ''));
            $q->where(fn($qq)=>$qq->where('code','like',"%$s%")->orWhere('title','like',"%$s%"));
        }
    $per = max(1, min(2000, (int) $request->input('per_page', 20)));
    return $q->paginate($per);
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
            'code' => ['required','string','max:20','unique:courses,code'],
            'title' => ['required','string','max:150'],
            'department_id' => ['required','exists:departments,id'],
        ]);
        return Course::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Course::with('department')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $data = $request->validate([
            'code' => ['sometimes','required','string','max:20', Rule::unique('courses','code')->ignore($course->id)],
            'title' => ['sometimes','required','string','max:150'],
            'department_id' => ['sometimes','required','exists:departments,id'],
        ]);
        $course->update($data);
        return $course->refresh()->load('department');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Archived']);
    }

    public function archived()
    {
        $per = max(1, min(2000, (int) request()->input('per_page', 20)));
        return Course::onlyTrashed()->paginate($per);
    }

    public function restore($id)
    {
        $course = Course::onlyTrashed()->findOrFail($id);
        $course->restore();
        return $course->refresh()->load('department');
    }

    public function forceDelete($id)
    {
        $course = Course::onlyTrashed()->findOrFail($id);
        $course->forceDelete();
        return response()->json(['message' => 'Deleted']);
    }
}
