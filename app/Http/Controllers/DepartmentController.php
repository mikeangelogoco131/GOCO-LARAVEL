<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = Department::query();
        if ($request->filled('search')) {
            $s = trim((string) $request->input('search', ''));
            $q->where(fn($qq)=>$qq->where('code','like',"%$s%")->orWhere('name','like',"%$s%"));
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
            'code' => ['required','string','max:20','unique:departments,code'],
            'name' => ['required','string','max:150'],
        ]);
        return Department::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Department::findOrFail($id);
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
        $dept = Department::findOrFail($id);
        $data = $request->validate([
            'code' => ['sometimes','required','string','max:20', Rule::unique('departments','code')->ignore($dept->id)],
            'name' => ['sometimes','required','string','max:150'],
        ]);
        $dept->update($data);
        return $dept;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $dept = Department::findOrFail($id);
        $dept->delete();
        return response()->json(['message' => 'Archived']);
    }

    public function archived()
    {
        $per = max(1, min(2000, (int) request()->input('per_page', 20)));
        return Department::onlyTrashed()->paginate($per);
    }

    public function restore($id)
    {
        $dept = Department::onlyTrashed()->findOrFail($id);
        $dept->restore();
        return $dept;
    }
}
