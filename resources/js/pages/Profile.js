export function renderProfile() {
  const u = window.__USER__ || {};
  return `
    <section>
      <h1 class="page-title">My Profile</h1>
      <div class="card" style="max-width:560px;">
        <form id="profile-form">
          <label style="display:block; font-weight:600; margin:8px 0 4px;">Name</label>
          <input class="input" name="name" value="${u.name ?? ''}" placeholder="Your name" required />

          <label style="display:block; font-weight:600; margin:12px 0 4px;">Email</label>
          <input class="input" name="email" type="email" value="${u.email ?? ''}" placeholder="Your email" required />

          <div class="hint" style="font-size:12px; color:#666; margin-top:12px;">Change password (optional)</div>
          <input class="input" name="password" type="password" placeholder="New password" />
          <input class="input" name="password_confirmation" type="password" placeholder="Confirm new password" />

          <div style="display:flex; gap:8px; margin-top:16px;">
            <button type="submit" class="btn btn-primary">Save changes</button>
            <button type="button" class="btn" id="profile-logout">Logout</button>
          </div>
        </form>
        <div class="error" id="profile-error" hidden></div>
        <div class="success" id="profile-success" hidden>Profile updated.</div>
      </div>
    </section>
  `;
}

export function afterProfileMount() {
  const form = document.getElementById('profile-form');
  const err = document.getElementById('profile-error');
  const ok = document.getElementById('profile-success');
  const btnLogout = document.getElementById('profile-logout');

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      try { await fetch('/logout', { method: 'POST', headers: { 'X-CSRF-TOKEN': window.__CSRF__ || '' } }); } finally { window.location.href = '/login'; }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true; ok.hidden = true; err.textContent = '';
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': window.__CSRF__ || '' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        const msg = j?.message || Object.values(j?.errors||{})[0]?.[0] || 'Update failed';
        throw new Error(msg);
      }
      const json = await res.json();
      window.__USER__ = json.user;
      ok.hidden = false;
    } catch (ex) {
      err.textContent = ex.message; err.hidden = false;
    }
  });
}
