<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login</title>
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    <style> body{display:grid;min-height:100vh;place-items:center;} </style>
    </head>
<body>

<div class="auth-card card">
    <h1>Sign in</h1>
    <p style="color:#6b7280;margin:0 0 16px;">Welcome back, please sign in to continue.</p>
    <form method="post" action="{{ url('/login') }}" style="display:grid;gap:12px;">
        @csrf
        <div>
            <label>Email</label>
            <input class="input" type="email" name="email" value="{{ old('email') }}" required>
            @error('email')<div style="color:#ef4444;">{{ $message }}</div>@enderror
        </div>
        <div>
            <label>Password</label>
            <input class="input" type="password" name="password" required>
        </div>
        <label style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" name="remember"> Remember me
        </label>
        <div class="actions">
            <a href="{{ route('register') }}" class="btn btn-outline">Create account</a>
            <button class="btn btn-primary" type="submit">Sign in</button>
        </div>
    </form>
</div>
<script src="{{ mix('js/app.js') }}" defer></script>
</body>
</html>
