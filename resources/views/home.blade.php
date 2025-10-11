<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Student & Faculty Profile Management System</title>
  <link rel="icon" href="/favicon.ico" />
  <meta name="csrf-token" content="{{ csrf_token() }}" />
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

    <section id="about" class="about">
      <div class="container">
        <h2>About the System</h2>
        <p>
          The Student & Faculty Profile Management System (SFPMS) helps schools and departments
          quickly organize and maintain academic records. It centralizes profiles for students and
          faculty, aligns them with departments, courses, and academic years, and provides a clean
          dashboard with insightful charts. Reports are exportable to CSV for easy sharing and
          analysis.
        </p>
        <ul class="about-list">
          <li>Unified profiles for Students and Faculty</li>
          <li>Department and Course relationships with status tracking</li>
          <li>Fast search and filters with an intuitive interface</li>
          <li>Reports and one-click CSV exports</li>
          <li>Secure, authenticated access with profile management</li>
        </ul>
      </div>
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

    <section id="contact" class="contact">
      <div class="container">
        <div class="contact-layout">
          <div class="contact-info">
            <h2>Contact us</h2>
            <p class="muted">Have questions or feedback? Send us a message and we’ll get back to you shortly.</p>
            <div class="contact-meta">
              <div><strong>Email:</strong> support@sfpms.local</div>
              <div><strong>Phone:</strong> +63 900 000 0000</div>
            </div>
          </div>
          <div class="contact-card">
            <form id="contact-form">
              <div class="field">
                <label for="c-name">Full name</label>
                <input id="c-name" name="name" class="input" type="text" placeholder="Your name" required />
              </div>
              <div class="field">
                <label for="c-email">Email</label>
                <input id="c-email" name="email" class="input" type="email" placeholder="you@example.com" required />
              </div>
              <div class="field">
                <label for="c-msg">Message</label>
                <textarea id="c-msg" name="message" class="input" rows="5" placeholder="How can we help?" required></textarea>
              </div>
              <div class="actions">
                <a href="/contact-manager" data-nav class="btn btn-outline">Contact manager</a>
                <button class="btn primary" type="submit">Send message</button>
              </div>
              <p id="contact-status" class="status" hidden></p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="home-footer">
    <div class="container">© {{ date('Y') }} FSUU • Student & Faculty Profile Management System</div>
  </footer>

  <script>
    // Expose CSRF for simple fetch usage
    window.__CSRF__ = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    // Smooth scroll for features link
    document.addEventListener('click', function(e){
      const a = e.target.closest('a[href^="#"]');
      if(!a) return; e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
    });
    // If SPA is loaded under /login or /register, the data-nav links will be handled by app.js
    // Contact form submit
    const cform = document.getElementById('contact-form');
    if (cform) {
      cform.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('contact-status');
        status.hidden = true;
        status.classList.remove('ok','err');
        const data = Object.fromEntries(new FormData(cform).entries());
        try {
          const res = await fetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': window.__CSRF__ || '' },
            body: JSON.stringify(data)
          });
          if (!res.ok) {
            let msg = 'Unable to send message.';
            try { const p = await res.json(); if (p && p.message) msg = p.message; } catch {}
            throw new Error(msg);
          }
          status.textContent = 'Thanks! We\'ve received your message.';
          status.classList.add('ok');
          status.hidden = false;
          cform.reset();
        } catch (err) {
          status.textContent = err.message || 'Something went wrong.';
          status.classList.add('err');
          status.hidden = false;
        }
      });
    }
  </script>
</body>
</html>
