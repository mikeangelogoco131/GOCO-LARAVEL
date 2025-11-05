<div style="display:flex;gap:10px;align-items:center;width:100%;justify-content:space-between;">
    <div style="font-weight:700;">Student & Faculty Profile Management</div>
    <div style="display:flex;gap:8px;align-items:center;">
        <input class="input" type="search" placeholder="Search...">
        <button class="btn btn-outline">Help</button>
        @auth
            @php $photo = auth()->user()->profile_photo ?? null; @endphp
            <a href="{{ route('profile') }}" style="display:flex;align-items:center;gap:8px;text-decoration:none;">
                <img src="{{ $photo ? asset('storage/'.$photo) : '/images/fsuu-logo.svg' }}" alt="avatar" style="width:36px;height:36px;border-radius:999px;object-fit:cover;border:1px solid rgba(0,0,0,.06)" />
            </a>
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
