export function renderContactManager() {
  return `
    <div class="card">
      <div class="toolbar">
        <h2 style="margin:0">Contact Messages</h2>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
          <input id="cm-q" class="input" type="search" placeholder="Search name, email, message" />
          <button id="cm-refresh" class="btn btn-outline">Refresh</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="table" id="cm-table">
          <thead><tr>
            <th style="width:28px">#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th style="width:140px">Actions</th>
          </tr></thead>
          <tbody><tr><td colspan="5">Loading…</td></tr></tbody>
        </table>
      </div>
      <div id="cm-pager" class="toolbar"></div>
    </div>
  `;
}

export function afterContactManagerMount() {
  const tbody = document.querySelector('#cm-table tbody');
  const pager = document.getElementById('cm-pager');
  const inputQ = document.getElementById('cm-q');
  const btnRefresh = document.getElementById('cm-refresh');

  let state = { page: 1, q: '' };

  function setTbody(html) { tbody.innerHTML = html; }

  async function load() {
    setTbody(`<tr><td colspan="5">Loading…</td></tr>`);
    const params = new URLSearchParams();
    params.set('page', String(state.page));
    if (state.q) params.set('q', state.q);
    try {
      const res = await fetch(`/api/contact-messages?${params.toString()}`, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) { setTbody(`<tr><td colspan=\"5\">Failed to load (${res.status}).</td></tr>`); return; }
      const data = await res.json();
      const rows = (data.data || []).map((m, i) => rowTpl(m, i, data.from)).join('') || `<tr><td colspan=\"5\">No messages.</td></tr>`;
      setTbody(rows);
      renderPager(data);
      bindRowEvents();
    } catch (err) {
      setTbody(`<tr><td colspan=\"5\">Failed to load. Is the server running?</td></tr>`);
    }
  }

  function rowTpl(m, i, from) {
    const idx = (from || 1) + i;
    const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    return `
      <tr data-id="${m.id}">
        <td>${idx}</td>
        <td><input class="input cm-name" value="${esc(m.name)}" /></td>
        <td><input class="input cm-email" type="email" value="${esc(m.email)}" /></td>
        <td><textarea class="input cm-message" rows="2">${esc(m.message)}</textarea></td>
        <td>
          <button class="btn btn-primary cm-save">Save</button>
          <button class="btn btn-danger cm-del">Delete</button>
        </td>
      </tr>
    `;
  }

  function renderPager(p) {
    const prevDis = p.current_page <= 1 ? 'disabled' : '';
    const nextDis = p.current_page >= p.last_page ? 'disabled' : '';
    pager.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="cm-prev" class="btn" ${prevDis}>Prev</button>
        <span>Page ${p.current_page} of ${p.last_page || 1}</span>
        <button id="cm-next" class="btn" ${nextDis}>Next</button>
      </div>
    `;
    pager.querySelector('#cm-prev')?.addEventListener('click', () => { if (state.page>1){ state.page--; load(); } });
    pager.querySelector('#cm-next')?.addEventListener('click', () => { state.page++; load(); });
  }

  function bindRowEvents() {
    tbody.querySelectorAll('.cm-save').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const tr = e.target.closest('tr');
        const id = tr.getAttribute('data-id');
        const payload = {
          name: tr.querySelector('.cm-name').value.trim(),
          email: tr.querySelector('.cm-email').value.trim(),
          message: tr.querySelector('.cm-message').value.trim(),
        };
        btn.disabled = true;
        const res = await fetch(`/api/contact-messages/${id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload)
        });
        btn.disabled = false;
        if (!res.ok) { alert('Save failed'); return; }
        await res.json();
        alert('Saved');
      });
    });
    tbody.querySelectorAll('.cm-del').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const tr = e.target.closest('tr');
        const id = tr.getAttribute('data-id');
        if (!confirm('Delete this message?')) return;
        btn.disabled = true;
        const res = await fetch(`/api/contact-messages/${id}`, { method: 'DELETE', headers: { 'Accept':'application/json' } });
        btn.disabled = false;
        if (!res.ok) { alert('Delete failed'); return; }
        tr.remove();
      });
    });
  }

  inputQ.addEventListener('input', () => { state.q = inputQ.value.trim(); state.page = 1; load(); });
  btnRefresh.addEventListener('click', () => load());

  load();
}
