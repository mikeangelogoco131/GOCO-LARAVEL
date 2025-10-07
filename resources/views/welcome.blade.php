<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Student & Faculty Profile Management</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" href="/favicon.ico">
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    <script>
      window.__CSRF__ = '{{ csrf_token() }}';
      window.__USER__ = @json(auth()->user());
    </script>
    <style>html,body{height:100%}body{margin:0}</style>
    <script src="{{ mix('js/app.js') }}" defer></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>
