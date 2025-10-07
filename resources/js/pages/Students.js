export function renderStudents() {
  return `
    <section>
      <div class="dashboard-hero">
        <div class="hero-title">Student Management</div>
        <div class="hero-sub">FSUU - Manage student profiles, enrollment, and academic details</div>
      </div>
      <h1 class="page-title" style="display:none">Students</h1>
      <div class="card">
        <div class="toolbar" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
          <input class="input" placeholder="Search students..." id="students-search" />
          <select class="input" id="students-course" style="min-width:200px"></select>
          <select class="input" id="students-dept" style="min-width:200px"></select>
          <select class="input" id="students-year" style="min-width:200px"></select>
          <button class="btn btn-primary" id="btn-add-student">Add student</button>
          <div style="margin-left:auto"></div>
          <label style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#555"><input type="checkbox" id="students-toggle-archived"/> Show archived</label>
        </div>
        <table class="table">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Gender</th><th>Birthday</th><th>Course</th><th>Department</th><th>Year</th><th>Status</th><th style="width:160px">Actions</th></tr></thead>
          <tbody id="students-tbody"></tbody>
        </table>
      </div>
    </section>

    <div id="students-modal" class="modal" hidden>
      <div class="modal-card">
        <h2 id="students-modal-title">Add student</h2>
        <form id="students-form">
          <div class="grid two">
            <input class="input" name="first_name" placeholder="First name" required />
            <input class="input" name="middle_name" placeholder="Middle name" />
          </div>
          <div class="grid two">
            <input class="input" name="last_name" placeholder="Last name" required />
            <input class="input" name="suffix" placeholder="Suffix (Jr., III, etc.)" />
          </div>
          <select class="input" name="gender">
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input class="input" name="birthday" type="date" placeholder="Birthday" />
          <input class="input" name="email" type="email" placeholder="Email" required />
          <div class="grid two">
            <select class="input" name="course_id" id="students-form-course" required></select>
            <select class="input" name="department_id" id="students-form-dept" required></select>
          </div>
          <select class="input" name="academic_year_id" id="students-form-year"></select>
          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
            <button type="button" class="btn" id="students-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
        <div class="error" id="students-error" hidden></div>
      </div>
    </div>
  `;
}

export async function afterStudentsMount() {
  const tbody = document.getElementById('students-tbody');
  const search = document.getElementById('students-search');
  const course = document.getElementById('students-course');
  const dept = document.getElementById('students-dept');
  const year = document.getElementById('students-year');
  const toggleArchived = document.getElementById('students-toggle-archived');
  const btnAdd = document.getElementById('btn-add-student');

  let editId = null;

  async function loadCourses(selectEl) {
    const list = await fetch('/api/courses').then(r=>r.json()).then(j=>j.data||j).catch(()=>[]);
    course.innerHTML = ['<option value="">All courses</option>'].concat(list.map(c=>`<option value="${c.id}">${c.title}</option>`)).join('');
    if (selectEl) selectEl.innerHTML = ['<option value="" disabled selected>Select course</option>'].concat(list.map(c=>`<option value="${c.id}">${c.title}</option>`)).join('');
  }
  async function loadDepartments(selectEl) {
    const list = await fetch('/api/departments').then(r=>r.json()).then(j=>j.data||j).catch(()=>[]);
    dept.innerHTML = ['<option value="">All departments</option>'].concat(list.map(d=>`<option value="${d.id}">${d.name}</option>`)).join('');
    if (selectEl) selectEl.innerHTML = ['<option value="" disabled selected>Select department</option>'].concat(list.map(d=>`<option value="${d.id}">${d.name}</option>`)).join('');
  }
  async function loadYears(selectEl) {
    const list = await fetch('/api/academic-years').then(r=>r.json()).then(j=>j.data||j).catch(()=>[]);
    year.innerHTML = ['<option value="">All years</option>'].concat(list.map(y=>`<option value="${y.id}">${y.name}${y.current?' (current)':''}</option>`)).join('');
    if (selectEl) selectEl.innerHTML = ['<option value="">Select academic year</option>'].concat(list.map(y=>`<option value="${y.id}">${y.name}${y.current?' (current)':''}</option>`)).join('');
  }

  async function loadTable() {
    const params = new URLSearchParams();
    if (search.value) params.set('search', search.value);
    if (course.value) params.set('course_id', course.value);
    if (dept.value) params.set('department_id', dept.value);
    if (year.value) params.set('academic_year_id', year.value);
    const base = toggleArchived.checked ? '/api/students-archived' : '/api/students';
    const res = await fetch(`${base}?${params.toString()}`);
    const json = await res.json();
    const rows = (json.data || json).map(s => `
      <tr>
        <td>${s.student_id ?? ''}</td>
        <td>${[s.first_name, s.middle_name, s.last_name, s.suffix].filter(Boolean).join(' ')}</td>
        <td>${s.email}</td>
  <td>${s.gender ?? ''}</td>
  <td>${s.birthday ?? ''}</td>
        <td>${s.course?.title ?? ''}</td>
        <td>${s.department?.name ?? ''}</td>
        <td>${s.academic_year?.name ?? s.academicYear?.name ?? ''}</td>
        <td>${s.status}</td>
        <td>
          ${toggleArchived.checked
            ? `<button class="btn" data-stu-restore="${s.id}">Restore</button>`
            : `<button class="btn" data-stu-edit="${s.id}">Edit</button> <button class="btn" data-stu-archive="${s.id}">Archive</button>`}
        </td>
      </tr>`).join('');
    tbody.innerHTML = rows;
  }

  function openModal(mode='add', data=null) {
    const modal = document.getElementById('students-modal');
    const title = document.getElementById('students-modal-title');
    const form = document.getElementById('students-form');
    const err = document.getElementById('students-error');
    const selCourse = document.getElementById('students-form-course');
    const selDept = document.getElementById('students-form-dept');
    const selYear = document.getElementById('students-form-year');
    err.hidden = true; err.textContent = '';
    title.textContent = mode === 'edit' ? 'Edit student' : 'Add student';
    editId = data?.id ?? null;
    form.reset();
    if (data) {
      form.first_name.value = data.first_name;
      form.middle_name.value = data.middle_name || '';
      form.last_name.value = data.last_name;
      form.suffix.value = data.suffix || '';
      form.gender.value = data.gender || '';
  form.email.value = data.email;
  form.birthday.value = data.birthday || '';
      setTimeout(() => {
        form.course_id.value = data.course_id;
        form.department_id.value = data.department_id;
        form.academic_year_id.value = data.academic_year_id || '';
      }, 0);
    }
    modal.hidden = false;
    loadCourses(selCourse); loadDepartments(selDept); loadYears(selYear);
  }

  function closeModal() { document.getElementById('students-modal').hidden = true; editId = null; }

  // Events
  search.addEventListener('input', () => loadTable());
  course.addEventListener('change', () => loadTable());
  dept.addEventListener('change', () => loadTable());
  year.addEventListener('change', () => loadTable());
  toggleArchived.addEventListener('change', () => loadTable());
  btnAdd.addEventListener('click', () => openModal('add'));

  document.body.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.matches('[data-stu-edit]')) {
      const id = t.getAttribute('data-stu-edit');
      const s = await fetch(`/api/students/${id}`).then(r=>r.json());
      openModal('edit', s);
    }
    if (t.matches('#students-cancel')) closeModal();
    if (t.matches('[data-stu-archive]')) {
      const id = t.getAttribute('data-stu-archive');
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      await loadTable();
    }
    if (t.matches('[data-stu-restore]')) {
      const id = t.getAttribute('data-stu-restore');
      await fetch(`/api/students/${id}/restore`, { method: 'POST' });
      await loadTable();
    }
  });

  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (form.id !== 'students-form') return;
    e.preventDefault();
    const err = document.getElementById('students-error');
    err.hidden = true; err.textContent = '';
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch(editId ? `/api/students/${editId}` : '/api/students', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
  await loadCourses(); await loadDepartments(); await loadYears();
  await loadTable();
}
