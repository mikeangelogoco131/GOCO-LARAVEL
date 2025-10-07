export function renderLogin() {
  return `
    <div class="auth-page">
      <div class="auth-split">
        <div class="visual">
          <div class="headline">Welcome back to FSUU - Student and Faculty Profile Management System</div>
          <div class="sub">Manage students, faculty, courses and more.</div>
        </div>
        <div class="auth-card">
          <div class="logo"><span>🎓</span><span>Student & Faculty</span></div>
          <h1>Sign in</h1>
          <form id="login-form">
            <div class="field">
              <label for="login-email">Email</label>
              <input id="login-email" class="input" name="email" type="email" placeholder="you@school.edu" required />
            </div>
            <div class="field">
              <label for="login-password">Password</label>
              <div style="position:relative">
                <input id="login-password" class="input" name="password" type="password" placeholder="••••••••" required />
                <button type="button" id="toggle-login-pass" class="btn" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:transparent;color:${'#'}666">Show</button>
              </div>
            </div>
            <div class="actions">
              <label style="display:inline-flex;align-items:center;gap:8px;font-size:13px;color:#555"><input type="checkbox" name="remember" /> Remember me</label>
              <button class="btn btn-primary" type="submit">Login</button>
            </div>
          </form>
          <p class="muted">No account? <a href="/register" data-nav>Register</a></p>
          <div class="error" id="login-error" hidden></div>
        </div>
      </div>
    </div>
  `;
}

export function afterLoginMount() {
  const form = document.getElementById('login-form');
  const error = document.getElementById('login-error');
  const toggle = document.getElementById('toggle-login-pass');
  const pass = document.getElementById('login-password');
  if (toggle && pass) {
    toggle.addEventListener('click', () => {
      const is = pass.getAttribute('type') === 'password';
      pass.setAttribute('type', is ? 'text' : 'password');
      toggle.textContent = is ? 'Hide' : 'Show';
    });
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': window.__CSRF__ || ''
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        let msg = 'Invalid credentials';
        try {
          const payload = await res.json();
          if (payload && payload.message) msg = payload.message;
        } catch {}
        throw new Error(msg);
      }
      // If backend returns JSON {redirect}, follow it; else fall back
      try {
        const payload = await res.json();
        if (payload && payload.redirect) {
          window.location.href = payload.redirect;
          return;
        }
      } catch {}
      window.location.href = '/dashboard';
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
    }
  });
}
