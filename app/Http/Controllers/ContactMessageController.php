<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->input('q', ''));
        $query = ContactMessage::query()->orderByDesc('created_at');
        if ($q !== '') {
            $query->where(function($w) use ($q) {
                $w->where('name','like',"%$q%")
                  ->orWhere('email','like',"%$q%")
                  ->orWhere('message','like',"%$q%");
            });
        }
        return $query->paginate(min((int)$request->input('per_page', 20), 100));
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'name' => ['sometimes','required','string','max:120'],
            'email' => ['sometimes','required','email','max:150'],
            'message' => ['sometimes','required','string','max:2000'],
        ]);
        $msg = ContactMessage::findOrFail($id);
        $msg->update($data);
        return response()->json(['ok' => true, 'message' => $msg]);
    }

    public function destroy(int $id)
    {
        $msg = ContactMessage::findOrFail($id);
        $msg->delete();
        return response()->json(['ok' => true]);
    }
}
