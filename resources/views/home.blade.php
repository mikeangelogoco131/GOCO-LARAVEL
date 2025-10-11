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
        <h2 class="reveal">About the System</h2>
        <p class="reveal" style="--delay:.04s">
          The Student & Faculty Profile Management System (SFPMS) helps schools and departments
          quickly organize and maintain academic records. It centralizes profiles for students and
          faculty, aligns them with departments, courses, and academic years, and provides a clean
          dashboard with insightful charts. Reports are exportable to CSV for easy sharing and
          analysis.
        </p>
        <ul class="about-list reveal" style="--delay:.08s">
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
        <div class="fcard reveal" style="--delay:.0s">
          <h3>Modern Dashboard</h3>
          <p>Business-style charts and stat cards give quick insights into students and faculty.</p>
        </div>
        <div class="fcard reveal" style="--delay:.06s">
          <h3>Smart Forms</h3>
          <p>Cascading selects for Departments → Courses, with clean status indicators.</p>
        </div>
        <div class="fcard reveal" style="--delay:.12s">
          <h3>Exportable Reports</h3>
          <p>One-click CSV for Students by Course and Faculty by Department.</p>
        </div>
        <div class="fcard reveal" style="--delay:.18s">
          <h3>Secure Access</h3>
          <p>Authenticated SPA with profile management and optional password updates.</p>
        </div>
      </div>
    </section>

    <section class="why">
      <div class="container">
        <h2 class="reveal">Why choose SFPMS?</h2>
        <div class="grid">
          <div class="card reveal" style="--delay:.02s">
            <h3>Operational Efficiency</h3>
            <p>Replace spreadsheets with a single source of truth for students, faculty, and departments.</p>
          </div>
          <div class="card reveal" style="--delay:.08s">
            <h3>Decision-ready Insights</h3>
            <p>Dashboards and CSV exports help you analyze trends and report quickly to stakeholders.</p>
          </div>
          <div class="card reveal" style="--delay:.14s">
            <h3>Secure and Scalable</h3>
            <p>Built on Laravel with a SPA front-end for performance and maintainability.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="how">
      <div class="container">
        <h2 class="reveal">How it works</h2>
        <div class="steps">
          <div class="step reveal" style="--delay:.02s">
            <h3>1. Sign in</h3>
            <p>Access your dashboard and see key metrics at a glance.</p>
          </div>
          <div class="step reveal" style="--delay:.08s">
            <h3>2. Manage records</h3>
            <p>Add and update Students, Faculty, Departments, Courses, and Academic Years.</p>
          </div>
          <div class="step reveal" style="--delay:.14s">
            <h3>3. Report and export</h3>
            <p>Use built-in reports and export to CSV for presentations and audits.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="modules">
      <div class="container">
        <h2 class="reveal">Modules overview</h2>
        <div class="grid">
          <div class="mcard reveal" style="--delay:.02s">
            <h3>Students</h3>
            <p>Profiles with course and department mapping, statuses, and quick search.</p>
          </div>
          <div class="mcard reveal" style="--delay:.06s">
            <h3>Faculty</h3>
            <p>Track faculty by department, with filters and status controls.</p>
          </div>
          <div class="mcard reveal" style="--delay:.10s">
            <h3>Departments & Courses</h3>
            <p>Define your structure and relate entities for consistent data entry.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="faq">
      <div class="container">
        <h2 class="reveal">Frequently asked questions</h2>
        <div class="faq-list">
          <details class="reveal" style="--delay:.02s">
            <summary>Can I export reports?</summary>
            <div>Yes, the system includes CSV exports for key reports like Students by Course and Faculty by Department.</div>
          </details>
          <details class="reveal" style="--delay:.06s">
            <summary>Is the system mobile-friendly?</summary>
            <div>The SPA layout is responsive and works on modern mobile browsers.</div>
          </details>
          <details class="reveal" style="--delay:.10s">
            <summary>How are contact messages handled?</summary>
            <div>Messages sent from this page are stored securely and manageable from the Contact Manager in the dashboard.</div>
          </details>
        </div>
      </div>
    </section>

    <section id="contact" class="contact">
      <div class="container">
        <div class="contact-layout">
          <div class="contact-info reveal" style="--delay:.02s">
            <h2>Contact us</h2>
            <p class="muted">Have questions or feedback? Send us a message and we’ll get back to you shortly.</p>
            <div class="contact-meta">
              <div><strong>Email:</strong> support@sfpms.local</div>
              <div><strong>Phone:</strong> +63 900 000 0000</div>
            </div>
          </div>
          <div class="contact-card reveal" style="--delay:.08s">
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

    // Reveal on scroll via IntersectionObserver
    const revealEls = Array.from(document.querySelectorAll('.reveal'));
    if ('IntersectionObserver' in window && revealEls.length) {
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        }
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
      revealEls.forEach(el => io.observe(el));
    } else {
      // fallback: show all
      revealEls.forEach(el => el.classList.add('in-view'));
    }
  </script>
</body>
</html>
