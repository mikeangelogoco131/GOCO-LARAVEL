<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Student & Faculty Profile Management</title>
    <link rel="icon" href="/favicon.ico">
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
</head>
<body data-page="{{ $page ?? '' }}">
    <div class="app-shell">
        <aside class="app-sidebar">
            @include('partials.sidebar')
        </aside>
        <header class="app-header">
            @include('partials.navbar')
        </header>
        <main class="app-main">
            @yield('content')
        </main>
    </div>
    @include('partials.footer')
    <script src="{{ mix('js/app.js') }}" defer></script>
</body>
</html>
