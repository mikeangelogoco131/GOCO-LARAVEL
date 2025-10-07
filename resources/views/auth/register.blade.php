<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Register</title>
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    <style> body{display:grid;min-height:100vh;place-items:center;} </style>
    </head>
<body>

<div class="auth-card card">
    <h1>Create account</h1>
    <p style="color:#6b7280;margin:0 0 16px;">Register to access the system.</p>
    <form method="post" action="{{ url('/register') }}" style="display:grid;gap:12px;">
        @csrf
        <div>
            <label>Name</label>
            <input class="input" type="text" name="name" value="{{ old('name') }}" required>
            @error('name')<div style="color:#ef4444;">{{ $message }}</div>@enderror
        </div>
        <div>
            <label>Email</label>
            <input class="input" type="email" name="email" value="{{ old('email') }}" required>
            @error('email')<div style="color:#ef4444;">{{ $message }}</div>@enderror
        </div>
        <div class="grid grid-2">
            <div>
                <label>Password</label>
                <input class="input" type="password" name="password" required>
            </div>
            <div>
                <label>Confirm Password</label>
                <input class="input" type="password" name="password_confirmation" required>
            </div>
        </div>
        <div class="actions">
            <a href="{{ route('login') }}" class="btn btn-outline">Back to login</a>
            <button class="btn btn-primary" type="submit">Register</button>
        </div>
    </form>
</div>
<script src="{{ mix('js/app.js') }}" defer></script>
</body>
</html>
