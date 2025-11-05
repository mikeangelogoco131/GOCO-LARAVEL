<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AcademicYear;
use Illuminate\Validation\Rule;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $per = max(1, min(2000, (int) $request->input('per_page', 20)));
        return AcademicYear::query()->orderByDesc('current')->orderBy('name','desc')->paginate($per);
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
            'name' => ['required','string','max:30','unique:academic_years,name'],
            'current' => ['nullable','boolean'],
        ]);
        if (!empty($data['current'])) {
            AcademicYear::query()->update(['current' => false]);
        }
        return AcademicYear::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return AcademicYear::findOrFail($id);
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
        $year = AcademicYear::findOrFail($id);
        $data = $request->validate([
            'name' => ['sometimes','required','string','max:30', Rule::unique('academic_years','name')->ignore($year->id)],
            'current' => ['sometimes','boolean'],
        ]);
        if (array_key_exists('current', $data) && $data['current']) {
            AcademicYear::query()->update(['current' => false]);
        }
        $year->update($data);
        return $year;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $year = AcademicYear::findOrFail($id);
        $year->delete();
        return response()->json(['message' => 'Archived']);
    }

    public function archived()
    {
        $per = max(1, min(2000, (int) request()->input('per_page', 20)));
        return AcademicYear::onlyTrashed()->paginate($per);
    }

    public function restore($id)
    {
        $year = AcademicYear::onlyTrashed()->findOrFail($id);
        $year->restore();
        return $year;
    }

    public function forceDelete($id)
    {
        $year = AcademicYear::onlyTrashed()->findOrFail($id);
        $year->forceDelete();
        return response()->json(['message' => 'Deleted']);
    }
}
