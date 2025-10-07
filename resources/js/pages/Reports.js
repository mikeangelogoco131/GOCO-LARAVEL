export function renderReports() {
  return `
    <section>
      <div class="dashboard-hero">
        <div class="hero-title">Reports</div>
        <div class="hero-sub">FSUU - Generate CSV-ready insights for students and faculty</div>
      </div>
      <h1 class="page-title" style="display:none">Reports</h1>
      <div class="grid two" style="gap:16px; align-items:start;">
        <div class="card">
          <h2>Students by Course</h2>
          <div style="display:flex; gap:8px; align-items:center; margin:8px 0; flex-wrap:wrap;">
            <select class="input" id="rep-students-course" style="min-width:260px"></select>
            <button class="btn btn-primary" id="rep-students-generate">Generate</button>
            <button class="btn" id="rep-students-export" disabled>Export CSV</button>
          </div>
          <table class="table">
            <thead><tr><th>Student ID</th><th>Name</th><th>Email</th><th>Course</th><th>Department</th><th>Year</th><th>Status</th></tr></thead>
            <tbody id="rep-students-tbody"></tbody>
          </table>
        </div>

        <div class="card">
          <h2>Faculty by Department</h2>
          <div style="display:flex; gap:8px; align-items:center; margin:8px 0; flex-wrap:wrap;">
            <select class="input" id="rep-faculty-dept" style="min-width:260px"></select>
            <button class="btn btn-primary" id="rep-faculty-generate">Generate</button>
            <button class="btn" id="rep-faculty-export" disabled>Export CSV</button>
          </div>
          <table class="table">
            <thead><tr><th>Faculty ID</th><th>Name</th><th>Position</th><th>Email</th><th>Department</th><th>Status</th></tr></thead>
            <tbody id="rep-faculty-tbody"></tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

export function afterReportsMount() {
  const sCourse = document.getElementById('rep-students-course');
  const sGen = document.getElementById('rep-students-generate');
  const sExport = document.getElementById('rep-students-export');
  const sTbody = document.getElementById('rep-students-tbody');

  const fDept = document.getElementById('rep-faculty-dept');
  const fGen = document.getElementById('rep-faculty-generate');
  const fExport = document.getElementById('rep-faculty-export');
  const fTbody = document.getElementById('rep-faculty-tbody');

  function toCSV(rows) {
    const esc = (v) => '"' + String(v ?? '').replaceAll('"','""') + '"';
    return rows.map(r => r.map(esc).join(',')).join('\n');
  }

  async function loadCourses() {
    const list = await fetch('/api/courses?per_page=2000').then(r=>r.json()).then(j=>j.data||j).catch(()=>[]);
    sCourse.innerHTML = ['<option value="">Select course</option>'].concat(list.map(c=>`<option value="${c.id}">${c.title} (${c.code})</option>`)).join('');
  }
  async function loadDepartments() {
    const list = await fetch('/api/departments?per_page=2000').then(r=>r.json()).then(j=>j.data||j).catch(()=>[]);
    fDept.innerHTML = ['<option value="">Select department</option>'].concat(list.map(d=>`<option value="${d.id}">${d.name} (${d.code})</option>`)).join('');
  }

  async function genStudents() {
    const cid = sCourse.value;
    if (!cid) { sTbody.innerHTML = ''; sExport.disabled = true; return; }
    const res = await fetch(`/api/students?course_id=${cid}&per_page=2000`);
    const json = await res.json();
    const arr = (json.data || json);
    const rows = arr.map(s => `
      <tr>
        <td>${s.student_id ?? ''}</td>
        <td>${[s.first_name, s.middle_name, s.last_name, s.suffix].filter(Boolean).join(' ')}</td>
        <td>${s.email}</td>
        <td>${s.course?.title ?? ''}</td>
        <td>${s.department?.name ?? ''}</td>
        <td>${s.academic_year?.name ?? s.academicYear?.name ?? ''}</td>
        <td>${s.status}</td>
      </tr>`).join('');
    sTbody.innerHTML = rows;
    // enable export
    sExport.disabled = arr.length === 0;
    sExport.onclick = () => {
      const csv = toCSV([
        ['Student ID','Name','Email','Course','Department','Year','Status'],
        ...arr.map(s => [s.student_id ?? '', [s.first_name, s.middle_name, s.last_name, s.suffix].filter(Boolean).join(' '), s.email, s.course?.title ?? '', s.department?.name ?? '', s.academic_year?.name ?? s.academicYear?.name ?? '', s.status])
      ]);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `students_by_course_${cid}.csv`; a.click();
      URL.revokeObjectURL(url);
    }
  }

  async function genFaculty() {
    const did = fDept.value;
    if (!did) { fTbody.innerHTML = ''; fExport.disabled = true; return; }
    const res = await fetch(`/api/faculties?department_id=${did}&per_page=2000`);
    const json = await res.json();
    const arr = (json.data || json);
    const rows = arr.map(f => `
      <tr>
        <td>${f.faculty_id ?? ''}</td>
        <td>${[f.first_name, f.middle_name, f.last_name, f.suffix].filter(Boolean).join(' ')}</td>
        <td>${f.position ?? ''}</td>
        <td>${f.email}</td>
        <td>${f.department?.name ?? ''}</td>
        <td>${f.status}</td>
      </tr>`).join('');
    fTbody.innerHTML = rows;
    // enable export
    fExport.disabled = arr.length === 0;
    fExport.onclick = () => {
      const csv = toCSV([
        ['Faculty ID','Name','Position','Email','Department','Status'],
        ...arr.map(f => [f.faculty_id ?? '', [f.first_name, f.middle_name, f.last_name, f.suffix].filter(Boolean).join(' '), f.position ?? '', f.email, f.department?.name ?? '', f.status])
      ]);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `faculty_by_department_${did}.csv`; a.click();
      URL.revokeObjectURL(url);
    }
  }

  sGen.addEventListener('click', genStudents);
  fGen.addEventListener('click', genFaculty);
  loadCourses(); loadDepartments();
}
