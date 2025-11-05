<div class="sidebar">
    <div class="logo" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
        <img src="/images/fsuu-logo.png" alt="FSUU" width="48" height="48" onerror="this.onerror=null;this.src='/images/fsuu-logo.svg'" style="border-radius:6px; object-fit:cover; background:#fff;" />
        <div class="brand">SFPMS</div>
    </div>
    {{-- expose optional runtime logo URL from .env: FSUU_LOGO_URL --}}
    <script>
        window.__FSUU_LOGO_URL = {!! json_encode(env('FSUU_LOGO_URL') ?: '') !!};
    </script>
    <nav>
        <a class="nav-link {{ ($page ?? '')==='dashboard'?'active':'' }}" href="{{ route('dashboard') }}">Dashboard</a>
        <a class="nav-link {{ ($page ?? '')==='faculty'?'active':'' }}" href="{{ route('faculty.index') }}">Faculty</a>
        <a class="nav-link {{ ($page ?? '')==='students'?'active':'' }}" href="{{ route('students.index') }}">Students</a>
        <a class="nav-link {{ ($page ?? '')==='reports'?'active':'' }}" href="{{ route('reports') }}">Reports</a>
        <a class="nav-link {{ ($page ?? '')==='settings'?'active':'' }}" href="{{ route('settings') }}">System Settings</a>
        <a class="nav-link {{ ($page ?? '')==='profile'?'active':'' }}" href="{{ route('profile') }}">My Profile</a>
    </nav>
</div>
