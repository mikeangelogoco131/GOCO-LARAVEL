export function renderFaculty() {
  return `
    <section>
      <div class="dashboard-hero">
        <div class="hero-title">Faculty Management</div>
        <div class="hero-sub">FSUU - Manage faculty profiles, positions, and departments</div>
      </div>
      <h1 class="page-title" style="display:none">Faculty</h1>
      <div class="card">
        <div class="toolbar" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
          <input class="input" placeholder="Search faculty..." id="faculty-search" />
          <select class="input" id="faculty-dept" style="min-width:220px"></select>
          <button class="btn btn-primary" id="btn-add-faculty">Add faculty</button>
          <div style="margin-left:auto"></div>
          <label style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#555"><input type="checkbox" id="toggle-archived"/> Show archived</label>
        </div>
        <table class="table">
          <thead><tr><th>Faculty ID</th><th>Name</th><th>Position</th><th>Email</th><th>Department</th><th>Status</th><th style="width:160px">Actions</th></tr></thead>
          <tbody id="faculty-tbody"></tbody>
        </table>
      </div>
    </section>

    <div id="faculty-modal" class="modal" hidden>
      <div class="modal-card">
        <h2 id="faculty-modal-title">Add faculty</h2>
        <form id="faculty-form">
          <div class="grid two">
            <input class="input" name="first_name" placeholder="First name" required />
            <input class="input" name="middle_name" placeholder="Middle name" />
          </div>
          <div class="grid two">
            <input class="input" name="last_name" placeholder="Last name" required />
            <input class="input" name="suffix" placeholder="Suffix (Jr., III, etc.)" />
          </div>
          <select class="input" name="position" id="faculty-form-position">
            <option value="">Select position</option>
            <option value="Professor">Professor</option>
            <option value="Instructor">Instructor</option>
            <option value="Dean">Dean</option>
          </select>
          <input class="input" name="email" type="email" placeholder="Email" required />
          <select class="input" name="department_id" id="faculty-form-dept" required></select>
          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
            <button type="button" class="btn" id="faculty-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
        <div class="error" id="faculty-error" hidden></div>
      </div>
    </div>
  `;
}

export async function afterFacultyMount() {
  const tbody = document.getElementById('faculty-tbody');
  const search = document.getElementById('faculty-search');
  const dept = document.getElementById('faculty-dept');
  const showArchived = document.getElementById('toggle-archived');
  const btnAdd = document.getElementById('btn-add-faculty');

  let editId = null;

  async function loadDepartments(selectEl) {
    const depts = await fetch('/api/departments').then(r=>r.json()).then(j=>j.data||j).catch(()=>[]);
    const opts = ['<option value="">All departments</option>'].concat(depts.map(d=>`<option value="${d.id}">${d.name}</option>`));
    dept.innerHTML = opts.join('');
    if (selectEl) selectEl.innerHTML = ['<option value="" disabled selected>Select department</option>'].concat(depts.map(d=>`<option value="${d.id}">${d.name}</option>`)).join('');
  }

  async function loadTable() {
    const params = new URLSearchParams();
    if (search.value) params.set('search', search.value);
    if (dept.value) params.set('department_id', dept.value);
    const base = showArchived.checked ? '/api/faculties-archived' : '/api/faculties';
    const res = await fetch(`${base}?${params.toString()}`);
    const json = await res.json();
    const rows = (json.data || json).map(f => {
      const statusClass = (f.status || '').toLowerCase() === 'active' ? 'status-active' : 'status-archived';
      const statusLabel = f.status || 'active';
      return `
      <tr>
        <td>${f.faculty_id ?? ''}</td>
        <td>${[f.first_name, f.middle_name, f.last_name, f.suffix].filter(Boolean).join(' ')}</td>
        <td>${f.position ?? ''}</td>
        <td>${f.email}</td>
        <td>${f.department?.name ?? ''}</td>
        <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
        <td>
          ${showArchived.checked
            ? `<button class="btn" data-restore="${f.id}">Restore</button>`
            : `<button class="btn" data-edit="${f.id}">Edit</button> <button class="btn" data-archive="${f.id}">Delete</button>`}
        </td>
      </tr>`
    }).join('');
    tbody.innerHTML = rows;
  }

  function openModal(mode = 'add', data = null) {
    const modal = document.getElementById('faculty-modal');
    const title = document.getElementById('faculty-modal-title');
    const form = document.getElementById('faculty-form');
    const err = document.getElementById('faculty-error');
    const select = document.getElementById('faculty-form-dept');
    err.hidden = true; err.textContent = '';
    title.textContent = mode === 'edit' ? 'Edit faculty' : 'Add faculty';
    editId = data?.id ?? null;
    form.reset();
    if (data) {
      form.first_name.value = data.first_name;
      form.middle_name.value = data.middle_name || '';
      form.last_name.value = data.last_name;
      form.suffix.value = data.suffix || '';
      form.position.value = data.position || '';
      form.email.value = data.email;
      setTimeout(() => { form.department_id.value = data.department_id; }, 0);
    }
    modal.hidden = false;
    loadDepartments(select);
  }

  function closeModal() {
    document.getElementById('faculty-modal').hidden = true;
    editId = null;
  }

  // Events
  search.addEventListener('input', () => loadTable());
  dept.addEventListener('change', () => loadTable());
  showArchived.addEventListener('change', () => loadTable());
  btnAdd.addEventListener('click', () => openModal('add'));

  document.body.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.matches('[data-edit]')) {
      const id = t.getAttribute('data-edit');
      const f = await fetch(`/api/faculties/${id}`).then(r=>r.json());
      openModal('edit', f);
    }
    if (t.matches('#faculty-cancel')) closeModal();
    if (t.matches('[data-archive]')) {
      const id = t.getAttribute('data-archive');
      await fetch(`/api/faculties/${id}`, { method: 'DELETE' });
      await loadTable();
    }
    if (t.matches('[data-restore]')) {
      const id = t.getAttribute('data-restore');
      await fetch(`/api/faculties/${id}/restore`, { method: 'POST' });
      await loadTable();
    }
  });

  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (form.id !== 'faculty-form') return;
    e.preventDefault();
    const err = document.getElementById('faculty-error');
    err.hidden = true; err.textContent = '';
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch(editId ? `/api/faculties/${editId}` : '/api/faculties', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        const msg = j?.message || Object.values(j?.errors||{})[0]?.[0] || 'Save failed';
        throw new Error(msg);
      }
      closeModal();
      await loadTable();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
    }
  });

  // init
  await loadDepartments();
  await loadTable();
}
