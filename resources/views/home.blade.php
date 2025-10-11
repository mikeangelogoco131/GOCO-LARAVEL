<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Student & Faculty Profile Management System</title>
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="{{ mix('css/app.css') }}" />
</head>
<body class="home">
  <header class="home-header">
    <div class="container">
      <div class="brand">FSUU • SFPMS</div>
      <nav class="actions">
        <a class="btn ghost" href="{{ route('login') }}" data-nav>Login</a>
        <a class="btn" href="{{ route('register') }}" data-nav>Sign up</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <div class="hero-text">
          <h1>Student & Faculty Profile Management</h1>
          <p class="sub">A fast, modern system to manage profiles, departments, courses, and academic years — with clean dashboards and exportable reports.</p>
          <div class="cta">
            <a class="btn primary" href="{{ route('login') }}">Get Started</a>
            <a class="btn ghost" href="#features">See Features</a>
          </div>
        </div>
        <div class="hero-art">
          <div class="glass-card">
            <div class="stat">
              <div class="stat-kpi">Students</div>
              <div class="stat-val">{{ \App\Models\Student::count() }}</div>
            </div>
            <div class="stat">
              <div class="stat-kpi">Faculty</div>
              <div class="stat-val">{{ \App\Models\Faculty::count() }}</div>
            </div>
            <div class="stat">
              <div class="stat-kpi">Courses</div>
              <div class="stat-val">{{ \App\Models\Course::count() }}</div>
            </div>
            <div class="stat">
              <div class="stat-kpi">Departments</div>
              <div class="stat-val">{{ \App\Models\Department::count() }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-bg"></div>
    </section>

    <section id="features" class="features">
      <div class="container grid">
        <div class="fcard">
          <h3>Modern Dashboard</h3>
          <p>Business-style charts and stat cards give quick insights into students and faculty.</p>
        </div>
        <div class="fcard">
          <h3>Smart Forms</h3>
          <p>Cascading selects for Departments → Courses, with clean status indicators.</p>
        </div>
        <div class="fcard">
          <h3>Exportable Reports</h3>
          <p>One-click CSV for Students by Course and Faculty by Department.</p>
        </div>
        <div class="fcard">
          <h3>Secure Access</h3>
          <p>Authenticated SPA with profile management and optional password updates.</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="home-footer">
    <div class="container">© {{ date('Y') }} FSUU • Student & Faculty Profile Management System</div>
  </footer>

  <script>
    // Smooth scroll for features link
    document.addEventListener('click', function(e){
      const a = e.target.closest('a[href^="#"]');
      if(!a) return; e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
    });
    // If SPA is loaded under /login or /register, the data-nav links will be handled by app.js
  </script>
</body>
</html>
