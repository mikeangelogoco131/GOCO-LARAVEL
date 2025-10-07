<div style="display:flex;gap:10px;align-items:center;width:100%;justify-content:space-between;">
    <div style="font-weight:700;">Student & Faculty Profile Management</div>
    <div style="display:flex;gap:8px;align-items:center;">
        <input class="input" type="search" placeholder="Search...">
        <button class="btn btn-outline">Help</button>
        @auth
            <a href="{{ route('profile') }}" class="btn btn-primary">My Profile</a>
            <form method="post" action="{{ route('logout') }}" style="display:inline;">
                @csrf
                <button class="btn btn-outline" type="submit">Logout</button>
            </form>
        @else
            <a href="{{ route('login') }}" class="btn btn-outline">Login</a>
            <a href="{{ route('register') }}" class="btn btn-primary">Register</a>
        @endauth
    </div>
</div>
