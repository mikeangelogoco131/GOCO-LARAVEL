<div class="sidebar">
    <div class="brand">SFPMS</div>
    <nav>
        <a class="nav-link {{ ($page ?? '')==='dashboard'?'active':'' }}" href="{{ route('dashboard') }}">Dashboard</a>
        <a class="nav-link {{ ($page ?? '')==='faculty'?'active':'' }}" href="{{ route('faculty.index') }}">Faculty</a>
        <a class="nav-link {{ ($page ?? '')==='students'?'active':'' }}" href="{{ route('students.index') }}">Students</a>
        <a class="nav-link {{ ($page ?? '')==='reports'?'active':'' }}" href="{{ route('reports') }}">Reports</a>
        <a class="nav-link {{ ($page ?? '')==='settings'?'active':'' }}" href="{{ route('settings') }}">System Settings</a>
        <a class="nav-link {{ ($page ?? '')==='profile'?'active':'' }}" href="{{ route('profile') }}">My Profile</a>
    </nav>
</div>
