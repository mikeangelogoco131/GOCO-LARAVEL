export function renderProfile() {
  const u = window.__USER__ || {};
  return `
    <section>
      <h1 class="page-title">My Profile</h1>
      <div class="card" style="max-width:560px;">
        <form id="profile-form">
          <label style="display:block; font-weight:600; margin:8px 0 4px;">Profile photo</label>
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <img id="profile-preview" src="${u.profile_photo ? ('/storage/' + u.profile_photo) : '/images/fsuu-logo.svg'}" alt="avatar" style="width:84px;height:84px;border-radius:8px;object-fit:cover;border:1px solid rgba(0,0,0,.06)" />
            <div>
              <input type="file" name="profile_photo" id="profile-photo-input" accept="image/*" />
              <div class="hint" style="font-size:12px;color:#666;margin-top:6px;">Max 2MB. JPG/PNG/GIF</div>
              ${u.profile_photo ? '<div style="margin-top:8px"><button type="button" id="remove-photo" class="btn btn-outline">Remove photo</button></div>' : ''}
            </div>
          </div>
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
  // Determine if this submit is "photo-only" (user selected a file and didn't change name/email)
  const nameChanged = (fd.get('name') || '').trim() !== (u.name || '').trim();
  const emailChanged = (fd.get('email') || '').trim() !== (u.email || '').trim();
  const photoField = fd.get('profile_photo');
  const hasPhoto = photoField && (photoField instanceof File ? photoField.size > 0 : true);

  // If this is a photo-only submit, ignore any accidental password autofill and remove password fields
  if (hasPhoto && !nameChanged && !emailChanged) {
    fd.delete('password');
    fd.delete('password_confirmation');
  }

  // Client-side handling for optional password change using FormData values
  const pwd = (fd.get('password') || '').trim();
  const pwd2 = (fd.get('password_confirmation') || '').trim();
  if (!pwd && !pwd2) {
    // if both empty, remove password fields so backend won't validate them
    fd.delete('password');
    fd.delete('password_confirmation');
  } else {
    if (!pwd) { err.textContent = 'Please enter a new password or leave both fields empty.'; err.hidden = false; return; }
    if (!pwd2) { err.textContent = 'Please confirm your new password.'; err.hidden = false; return; }
    if (pwd !== pwd2) { err.textContent = 'Passwords do not match.'; err.hidden = false; return; }
    if (pwd.length < 6) { err.textContent = 'Password must be at least 6 characters.'; err.hidden = false; return; }
  }
    try {
      // Determine whether only the profile photo is being changed. If so, call the dedicated upload endpoint
  // (nameChanged, emailChanged, hasPhoto were computed above and may have had password fields removed)
  const hasPassword = fd.get('password') && String(fd.get('password')).trim().length > 0;

      let res;
  if (hasPhoto && !nameChanged && !emailChanged && !hasPassword) {
        // Upload only the photo
        res = await fetch('/profile/photo', {
          method: 'POST',
          headers: { 'X-CSRF-TOKEN': window.__CSRF__ || '' },
          body: fd
        });
      } else {
        // Regular profile update (may include photo and other fields)
        res = await fetch('/profile', {
          method: 'POST',
          headers: { 'X-CSRF-TOKEN': window.__CSRF__ || '' },
          body: fd
        });
      }
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        let msg = 'Update failed';
        if (j?.errors && typeof j.errors === 'object') {
          const parts = [];
          for (const [k, v] of Object.entries(j.errors)) {
            const first = Array.isArray(v) ? v[0] : String(v);
            parts.push(first);
          }
          if (parts.length) msg = parts.join(' ');
        }
        if (j?.message) msg = j.message;
        throw new Error(msg);
      }
      const json = await res.json();
      window.__USER__ = json.user;
      // update preview src if new photo uploaded
      if (json.user && json.user.profile_photo) {
        const img = document.getElementById('profile-preview');
        if (img) img.src = '/storage/' + json.user.profile_photo;
      }
      ok.hidden = false;
    } catch (ex) {
      err.textContent = ex.message; err.hidden = false;
    }
  });

  // preview selected image
  const photoInput = document.getElementById('profile-photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = function(ev) { const img = document.getElementById('profile-preview'); if (img) img.src = ev.target.result; };
      reader.readAsDataURL(f);
    });
  }

  // remove photo handler
  const removeBtn = document.getElementById('remove-photo');
  if (removeBtn) {
    removeBtn.addEventListener('click', async () => {
      if (!confirm('Remove your profile photo?')) return;
      try {
        const res = await fetch('/profile/photo/delete', { method: 'POST', headers: { 'X-CSRF-TOKEN': window.__CSRF__ || '' } });
        if (!res.ok) throw new Error('Failed to remove photo');
        const j = await res.json();
        window.__USER__ = j.user;
        const img = document.getElementById('profile-preview');
        if (img) img.src = '/images/fsuu-logo.svg';
        // remove the button
        removeBtn.remove();
      } catch (ex) {
        alert(ex.message || 'Could not remove photo');
      }
    });
  }
}
