export function renderSettings() {
  return `
    <section>
      <div class="dashboard-hero">
        <div class="hero-title">Program Management</div>
        <div class="hero-sub">FSUU - Manage academic programs and departments</div>
      </div>
      <h1 class="page-title" style="display:none">Settings</h1>
      <div class="tabs">
        <div class="tab-buttons" style="display:flex; gap:8px; margin-bottom:12px;">
          <button class="btn" data-tab="courses">Courses</button>
          <button class="btn" data-tab="departments">Departments</button>
          <button class="btn" data-tab="years">Academic Years</button>
        </div>
        <div class="tab-panels">
          <div id="tab-courses">
            <div class="card">
              <div class="toolbar" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                <input class="input" placeholder="Search courses..." id="courses-search" />
                <button class="btn btn-primary" id="courses-add">Add course</button>
                <div style="margin-left:auto"></div>
                <label style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#555"><input type="checkbox" id="courses-archived"/> Show archived</label>
              </div>
              <table class="table">
                <thead><tr><th>Code</th><th>Title</th><th>Department</th><th style="width:160px">Actions</th></tr></thead>
                <tbody id="courses-tbody"></tbody>
              </table>
            </div>
          </div>
          <div id="tab-departments" hidden>
            <div class="card">
              <div class="toolbar" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                <input class="input" placeholder="Search departments..." id="depts-search" />
                <button class="btn btn-primary" id="depts-add">Add department</button>
                <div style="margin-left:auto"></div>
                <label style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#555"><input type="checkbox" id="depts-archived"/> Show archived</label>
              </div>
              <table class="table">
                <thead><tr><th>Code</th><th>Name</th><th style="width:160px">Actions</th></tr></thead>
                <tbody id="depts-tbody"></tbody>
              </table>
            </div>
          </div>
          <div id="tab-years" hidden>
            <div class="card">
              <div class="toolbar" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                <button class="btn btn-primary" id="years-add">Add academic year</button>
                <div style="margin-left:auto"></div>
                <label style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#555"><input type="checkbox" id="years-archived"/> Show archived</label>
              </div>
              <table class="table">
                <thead><tr><th>Name</th><th>Current</th><th style="width:160px">Actions</th></tr></thead>
                <tbody id="years-tbody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <div id="modal-course" class="modal" hidden>
        <div class="modal-card">
          <h2 id="modal-course-title">Add course</h2>
          <form id="form-course">
            <input class="input" name="code" placeholder="Code (e.g., BSCS)" required />
            <input class="input" name="title" placeholder="Title" required />
            <select class="input" name="department_id" id="form-course-dept" required></select>
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
              <button type="button" class="btn" id="course-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
          <div class="error" id="course-error" hidden></div>
        </div>
      </div>

      <div id="modal-dept" class="modal" hidden>
        <div class="modal-card">
          <h2 id="modal-dept-title">Add department</h2>
          <form id="form-dept">
            <input class="input" name="code" placeholder="Code (e.g., CCIS)" required />
            <input class="input" name="name" placeholder="Name" required />
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
              <button type="button" class="btn" id="dept-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
          <div class="error" id="dept-error" hidden></div>
        </div>
      </div>

      <div id="modal-year" class="modal" hidden>
        <div class="modal-card">
          <h2 id="modal-year-title">Add academic year</h2>
          <form id="form-year">
            <input class="input" name="name" placeholder="Academic year (e.g., 2025-2026)" required />
            <label style="display:inline-flex; align-items:center; gap:8px; font-size:14px;"><input type="checkbox" name="current"/> Set as current</label>
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
              <button type="button" class="btn" id="year-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
          <div class="error" id="year-error" hidden></div>
        </div>
      </div>
    </section>
  `;
}

export function afterSettingsMount() {
  // Tab behavior
  const buttons = document.querySelectorAll('[data-tab]');
  const tabs = { courses: document.getElementById('tab-courses'), departments: document.getElementById('tab-departments'), years: document.getElementById('tab-years') };
  function showTab(name) { Object.keys(tabs).forEach(k => tabs[k].hidden = k !== name); }
  // Initialize from query (?tab=...)
  const params = new URLSearchParams(window.location.search);
  let initial = params.get('tab');
  if (!['courses','departments','years'].includes(initial)) initial = 'courses';
  showTab(initial);
  // Clicking buttons switches tab and syncs query
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    showTab(target);
    const u = new URL(window.location.href);
    u.searchParams.set('tab', target);
    history.replaceState({}, '', u.pathname + u.search);
  }));

  // Elements
  const cSearch = document.getElementById('courses-search');
  const cArchived = document.getElementById('courses-archived');
  const cAdd = document.getElementById('courses-add');
  const cTbody = document.getElementById('courses-tbody');
  const dSearch = document.getElementById('depts-search');
  const dArchived = document.getElementById('depts-archived');
  const dAdd = document.getElementById('depts-add');
  const dTbody = document.getElementById('depts-tbody');
  const yArchived = document.getElementById('years-archived');
  const yAdd = document.getElementById('years-add');
  const yTbody = document.getElementById('years-tbody');

  // Helpers
  async function loadDeptOptions(selectEl) {
    const list = await fetch('/api/departments?per_page=2000').then(r=>r.json()).then(j=>j.data||j).catch(()=>[]);
    if (selectEl) selectEl.innerHTML = ['<option value="" disabled selected>Select department</option>'].concat(list.map(d=>`<option value="${d.id}">${d.name}</option>`)).join('');
  }

  async function loadCourses() {
    const params = new URLSearchParams();
    if (cSearch.value) params.set('search', cSearch.value);
    params.set('per_page','200');
    const base = cArchived.checked ? '/api/courses-archived' : '/api/courses';
    const res = await fetch(`${base}?${params.toString()}`);
    const json = await res.json();
    cTbody.innerHTML = (json.data||json).map(c => `
      <tr>
        <td>${c.code}</td>
        <td>${c.title}</td>
        <td>${c.department?.name ?? ''}</td>
        <td>
          ${cArchived.checked
            ? `<button class="btn" data-course-restore="${c.id}">Restore</button> <button class="btn btn-danger" data-course-delete="${c.id}">Delete</button>`
            : `<button class="btn" data-course-edit="${c.id}">Edit</button> <button class="btn" data-course-archive="${c.id}">Archive</button>`}
        </td>
      </tr>`).join('');
  }

  async function loadDepartments() {
    const params = new URLSearchParams();
    if (dSearch.value) params.set('search', dSearch.value);
    params.set('per_page','200');
    const base = dArchived.checked ? '/api/departments-archived' : '/api/departments';
    const res = await fetch(`${base}?${params.toString()}`);
    const json = await res.json();
    const list = (json.data||json);
    if (!Array.isArray(list) || list.length === 0) {
      const hint = dArchived.checked
        ? 'No archived departments. Toggle off "Show archived" to see active items.'
        : 'No departments found. Try clearing search or toggle "Show archived".';
      dTbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#777;padding:16px">${hint}</td></tr>`;
      return;
    }
    dTbody.innerHTML = list.map(d => `
      <tr>
        <td>${d.code}</td>
        <td>${d.name}</td>
        <td>
          ${dArchived.checked
            ? `<button class="btn" data-dept-restore="${d.id}">Restore</button> <button class="btn btn-danger" data-dept-delete="${d.id}">Delete</button>`
            : `<button class="btn" data-dept-edit="${d.id}">Edit</button> <button class="btn" data-dept-archive="${d.id}">Archive</button>`}
        </td>
      </tr>`).join('');
  }

  async function loadYears() {
    const params = new URLSearchParams();
    params.set('per_page','200');
    const base = yArchived.checked ? '/api/academic-years-archived' : '/api/academic-years';
    const res = await fetch(`${base}?${params.toString()}`);
    const json = await res.json();
    yTbody.innerHTML = (json.data||json).map(y => `
      <tr>
        <td>${y.name}</td>
        <td>${y.current ? 'Yes' : 'No'}</td>
        <td>
          ${yArchived.checked
            ? `<button class="btn" data-year-restore="${y.id}">Restore</button> <button class="btn btn-danger" data-year-delete="${y.id}">Delete</button>`
            : `<button class="btn" data-year-edit="${y.id}">Edit</button> <button class="btn" data-year-archive="${y.id}">Archive</button>`}
        </td>
      </tr>`).join('');
  }

  // Modal helpers
  function openCourseModal(mode='add', data=null) {
    const modal = document.getElementById('modal-course');
    const title = document.getElementById('modal-course-title');
    const form = document.getElementById('form-course');
    const err = document.getElementById('course-error');
    const sel = document.getElementById('form-course-dept');
    err.hidden = true; err.textContent = '';
    title.textContent = mode === 'edit' ? 'Edit course' : 'Add course';
    form.reset();
    form.dataset.editId = data?.id || '';
    if (data) {
      form.code.value = data.code;
      form.title.value = data.title;
      setTimeout(()=>{ form.department_id.value = data.department_id; }, 0);
    }
    modal.hidden = false;
    loadDeptOptions(sel);
  }
  function openDeptModal(mode='add', data=null) {
    const modal = document.getElementById('modal-dept');
    const title = document.getElementById('modal-dept-title');
    const form = document.getElementById('form-dept');
    const err = document.getElementById('dept-error');
    err.hidden = true; err.textContent = '';
    title.textContent = mode === 'edit' ? 'Edit department' : 'Add department';
    form.reset();
    form.dataset.editId = data?.id || '';
    if (data) {
      form.code.value = data.code;
      form.name.value = data.name;
    }
    modal.hidden = false;
  }
  function openYearModal(mode='add', data=null) {
    const modal = document.getElementById('modal-year');
    const title = document.getElementById('modal-year-title');
    const form = document.getElementById('form-year');
    const err = document.getElementById('year-error');
    err.hidden = true; err.textContent = '';
    title.textContent = mode === 'edit' ? 'Edit academic year' : 'Add academic year';
    form.reset();
    form.dataset.editId = data?.id || '';
    if (data) {
      form.name.value = data.name;
      form.current.checked = !!data.current;
    }
    modal.hidden = false;
  }
  function closeModal(id) { document.getElementById(id).hidden = true; }

  // Events
  cSearch.addEventListener('input', loadCourses);
  cArchived.addEventListener('change', loadCourses);
  dSearch.addEventListener('input', loadDepartments);
  dArchived.addEventListener('change', loadDepartments);
  yArchived.addEventListener('change', loadYears);
  cAdd.addEventListener('click', () => openCourseModal('add'));
  dAdd.addEventListener('click', () => openDeptModal('add'));
  yAdd.addEventListener('click', () => openYearModal('add'));

  document.body.addEventListener('click', async (e) => {
    const t = e.target;
    // Courses
    if (t.matches('[data-course-edit]')) {
      const id = t.getAttribute('data-course-edit');
      const c = await fetch(`/api/courses/${id}`).then(r=>r.json());
      openCourseModal('edit', c);
    }
    if (t.matches('[data-course-archive]')) {
      const id = t.getAttribute('data-course-archive');
      await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      await loadCourses();
    }
    if (t.matches('[data-course-restore]')) {
      const id = t.getAttribute('data-course-restore');
      await fetch(`/api/courses/${id}/restore`, { method: 'POST' });
      await loadCourses();
    }
    if (t.matches('[data-course-delete]')) {
      const id = t.getAttribute('data-course-delete');
      if (!confirm('Permanently delete this course? This cannot be undone.')) return;
      await fetch(`/api/courses/${id}/delete`, { method: 'POST' });
      await loadCourses();
    }

    // Departments
    if (t.matches('[data-dept-edit]')) {
      const id = t.getAttribute('data-dept-edit');
      const d = await fetch(`/api/departments/${id}`).then(r=>r.json());
      openDeptModal('edit', d);
    }
    if (t.matches('[data-dept-archive]')) {
      const id = t.getAttribute('data-dept-archive');
      await fetch(`/api/departments/${id}`, { method: 'DELETE' });
      await loadDepartments();
    }
    if (t.matches('[data-dept-restore]')) {
      const id = t.getAttribute('data-dept-restore');
      await fetch(`/api/departments/${id}/restore`, { method: 'POST' });
      await loadDepartments();
    }
    if (t.matches('[data-dept-delete]')) {
      const id = t.getAttribute('data-dept-delete');
      if (!confirm('Permanently delete this department? This cannot be undone.')) return;
      await fetch(`/api/departments/${id}/delete`, { method: 'POST' });
      await loadDepartments();
    }

    // Years
    if (t.matches('[data-year-edit]')) {
      const id = t.getAttribute('data-year-edit');
      const y = await fetch(`/api/academic-years/${id}`).then(r=>r.json());
      openYearModal('edit', y);
    }
    if (t.matches('[data-year-archive]')) {
      const id = t.getAttribute('data-year-archive');
      await fetch(`/api/academic-years/${id}`, { method: 'DELETE' });
      await loadYears();
    }
    if (t.matches('[data-year-restore]')) {
      const id = t.getAttribute('data-year-restore');
      await fetch(`/api/academic-years/${id}/restore`, { method: 'POST' });
      await loadYears();
    }
    if (t.matches('[data-year-delete]')) {
      const id = t.getAttribute('data-year-delete');
      if (!confirm('Permanently delete this academic year? This cannot be undone.')) return;
      await fetch(`/api/academic-years/${id}/delete`, { method: 'POST' });
      await loadYears();
    }
  });

  document.addEventListener('submit', async (e) => {
    const form = e.target;
    // Course form
    if (form.id === 'form-course') {
      e.preventDefault();
      const err = document.getElementById('course-error'); err.hidden = true; err.textContent = '';
      const payload = Object.fromEntries(new FormData(form).entries());
      try {
        const editId = form.dataset.editId;
        const res = await fetch(editId ? `/api/courses/${editId}` : '/api/courses', {
          method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!res.ok) { const j = await res.json().catch(()=>({})); throw new Error(j.message || Object.values(j.errors||{})[0]?.[0] || 'Save failed'); }
        closeModal('modal-course'); await loadCourses();
      } catch (ex) { err.textContent = ex.message; err.hidden = false; }
      return;
    }

    // Dept form
    if (form.id === 'form-dept') {
      e.preventDefault();
      const err = document.getElementById('dept-error'); err.hidden = true; err.textContent = '';
      const payload = Object.fromEntries(new FormData(form).entries());
      try {
        const editId = form.dataset.editId;
        const res = await fetch(editId ? `/api/departments/${editId}` : '/api/departments', {
          method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!res.ok) { const j = await res.json().catch(()=>({})); throw new Error(j.message || Object.values(j.errors||{})[0]?.[0] || 'Save failed'); }
        closeModal('modal-dept'); await loadDepartments();
      } catch (ex) { err.textContent = ex.message; err.hidden = false; }
      return;
    }

    // Year form
    if (form.id === 'form-year') {
      e.preventDefault();
      const err = document.getElementById('year-error'); err.hidden = true; err.textContent = '';
      const entries = new FormData(form).entries();
      const raw = Object.fromEntries(entries);
      const payload = { ...raw, current: raw.current ? true : false };
      try {
        const editId = form.dataset.editId;
        const res = await fetch(editId ? `/api/academic-years/${editId}` : '/api/academic-years', {
          method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!res.ok) { const j = await res.json().catch(()=>({})); throw new Error(j.message || Object.values(j.errors||{})[0]?.[0] || 'Save failed'); }
        closeModal('modal-year'); await loadYears();
      } catch (ex) { err.textContent = ex.message; err.hidden = false; }
      return;
    }
  });

  // Cancel buttons
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('#course-cancel')) closeModal('modal-course');
    if (e.target.matches('#dept-cancel')) closeModal('modal-dept');
    if (e.target.matches('#year-cancel')) closeModal('modal-year');
  });

  // Initial loads
  loadCourses(); loadDepartments(); loadYears();
}
