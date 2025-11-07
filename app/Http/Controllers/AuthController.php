<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function showLogin() {
        if (\Illuminate\Support\Facades\Auth::check()) {
            return redirect()->route('dashboard');
        }
        return view('auth.login');
    }
    public function showRegister() {
        if (\Illuminate\Support\Facades\Auth::check()) {
            return redirect()->route('dashboard');
        }
        return view('auth.register');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required','email'],
            'password' => ['required']
        ]);
        $remember = $request->boolean('remember');
        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
            if ($request->expectsJson()) {
                return response()->json([
                    'ok' => true,
                    'redirect' => route('dashboard')
                ]);
            }
            return redirect()->intended(route('dashboard'));
        }
        if ($request->expectsJson()) {
            return response()->json([
                'ok' => false,
                'message' => 'Invalid credentials'
            ], 422);
        }
        return back()->withErrors(['email' => 'Invalid credentials'])->onlyInput('email');
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:100'],
            'email' => ['required','email','unique:users,email'],
            'password' => ['required','confirmed','min:6']
        ]);
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);
        Auth::login($user);
        if ($request->expectsJson()) {
            return response()->json([
                'ok' => true,
                'redirect' => route('dashboard')
            ]);
        }
        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }

    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $data = $request->validate([
            'name' => ['sometimes','required','string','max:100'],
            'email' => ['sometimes','required','email', 'unique:users,email,'.$user->id],
            'password' => ['sometimes','nullable','confirmed','min:6'],
            'profile_photo' => ['sometimes','nullable','image','max:2048']
        ]);
        if (array_key_exists('password', $data)) {
            if ($data['password']) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }
        }
        // handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            $file = $request->file('profile_photo');
            $path = $file->store('profile_photos', 'public');
            // delete previous photo if exists
            if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $data['profile_photo'] = $path;
        }
        try {
            \App\Models\User::where('id', $user->id)->update($data);
            $fresh = \App\Models\User::find($user->id);
            return response()->json(['ok' => true, 'user' => $fresh]);
        } catch (\Throwable $e) {
            // log and return structured JSON error instead of letting a fatal exception bubble up
            Log::error('Failed to update profile', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            return response()->json(['ok' => false, 'message' => 'Failed to update profile. Database may be unavailable.'], 500);
        }
    }

    /**
     * Delete the authenticated user's profile photo.
     */
    public function deleteProfilePhoto(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        try {
            if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $user->profile_photo = null;
            $user->save();
            return response()->json(['ok' => true, 'user' => $user]);
        } catch (\Throwable $e) {
            Log::error('Failed to delete profile photo', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            return response()->json(['ok' => false, 'message' => 'Failed to remove photo. Database may be unavailable.'], 500);
        }
    }

    /**
     * Upload or replace the authenticated user's profile photo only.
     */
    public function uploadProfilePhoto(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $data = $request->validate([
            'profile_photo' => ['required','image','max:2048']
        ]);
        if ($request->hasFile('profile_photo')) {
            try {
                $file = $request->file('profile_photo');
                $path = $file->store('profile_photos', 'public');
                // delete previous photo if exists
                if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
                    Storage::disk('public')->delete($user->profile_photo);
                }
                $user->profile_photo = $path;
                $user->save();
                return response()->json(['ok' => true, 'user' => $user]);
            } catch (\Throwable $e) {
                Log::error('Failed to upload profile photo', ['user_id' => $user->id, 'error' => $e->getMessage()]);
                return response()->json(['ok' => false, 'message' => 'Failed to upload photo. Database may be unavailable.'], 500);
            }
        }
        return response()->json(['ok' => false, 'message' => 'No file uploaded'], 422);
    }
}
