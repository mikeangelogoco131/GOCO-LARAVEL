export function renderRegister() {
  return `
    <div class="auth-page">
      <div class="auth-split">
        <div class="visual">
          <div class="headline">Create your account</div>
          <div class="sub">Join FSUU - SFPMS and keep academic records organized and insightful.</div>
        </div>
        <div class="auth-card">
          <div class="logo"><span>🎓</span><span>Student & Faculty</span></div>
          <h1>Sign up</h1>
          <form id="register-form">
            <div class="field">
              <label for="reg-name">Full name</label>
              <input id="reg-name" class="input" name="name" type="text" placeholder="Jane Doe" required />
            </div>
            <div class="field">
              <label for="reg-email">Email</label>
              <input id="reg-email" class="input" name="email" type="email" placeholder="you@school.edu" required />
            </div>
            <div class="field">
              <label for="reg-password">Password</label>
              <div style="position:relative">
                <input id="reg-password" class="input" name="password" type="password" placeholder="Create a strong password" required />
                <button type="button" id="toggle-reg-pass" class="btn" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:transparent;color:${'#'}666">Show</button>
              </div>
            </div>
            <div class="field">
              <label for="reg-password2">Confirm password</label>
              <div style="position:relative">
                <input id="reg-password2" class="input" name="password_confirmation" type="password" placeholder="Repeat your password" required />
                <button type="button" id="toggle-reg-pass2" class="btn" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:transparent;color:${'#'}666">Show</button>
              </div>
            </div>
            <div class="actions">
              <div></div>
              <button class="btn btn-primary" type="submit">Create account</button>
            </div>
          </form>
          <p class="muted">Already have an account? <a href="/login" data-nav>Login</a></p>
          <div class="error" id="register-error" hidden></div>
        </div>
      </div>
    </div>
  `;
}

export function afterRegisterMount() {
  const form = document.getElementById('register-form');
  const error = document.getElementById('register-error');
  const pass = document.getElementById('reg-password');
  const pass2 = document.getElementById('reg-password2');
  const t1 = document.getElementById('toggle-reg-pass');
  const t2 = document.getElementById('toggle-reg-pass2');
  if (t1 && pass) {
    t1.addEventListener('click', () => {
      const is = pass.getAttribute('type') === 'password';
      pass.setAttribute('type', is ? 'text' : 'password');
      t1.textContent = is ? 'Hide' : 'Show';
    });
  }
  if (t2 && pass2) {
    t2.addEventListener('click', () => {
      const is = pass2.getAttribute('type') === 'password';
      pass2.setAttribute('type', is ? 'text' : 'password');
      t2.textContent = is ? 'Hide' : 'Show';
    });
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': window.__CSRF__ || ''
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        let msg = 'Registration failed';
        try {
          const payload = await res.json();
          if (payload && payload.errors) {
            const firstKey = Object.keys(payload.errors)[0];
            if (firstKey) msg = payload.errors[firstKey][0];
          } else if (payload && payload.message) {
            msg = payload.message;
          }
        } catch {}
        throw new Error(msg);
      }
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
