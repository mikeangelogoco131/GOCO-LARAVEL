export function renderDashboard() {
  return `
    <section>
      <div class="dashboard-hero">
        <div class="hero-title">Welcome Back, ${window.__USER__?.name ?? ''}</div>
        <div class="hero-sub">FSUU - Student and Faculty Profile Management System Dashboard</div>
        <div class="hero-pill">Here's the Total Students - Faculties - Courses - Departments</div>
      </div>
      <h1 class="page-title" style="display:none">Dashboard</h1>
      <div class="stats-grid">
        <a href="/students" data-nav class="stat-card">
          <div class="stat-top">
            <div class="stat-label">Total Students</div>
            <div class="stat-value" id="stat-students">0</div>
            <div class="stat-sub" id="stat-students-sub">Click to view students</div>
          </div>
        </a>
        <a href="/faculty" data-nav class="stat-card">
          <div class="stat-top">
            <div class="stat-label">Total Faculty</div>
            <div class="stat-value" id="stat-faculty">0</div>
            <div class="stat-sub" id="stat-faculty-sub">Click to view faculty</div>
          </div>
        </a>
        <a href="/settings?tab=courses" data-nav class="stat-card">
          <div class="stat-top">
            <div class="stat-label">Active Courses</div>
            <div class="stat-value" id="stat-courses">0</div>
            <div class="stat-sub" id="stat-courses-sub">Manage courses</div>
          </div>
        </a>
        <a href="/settings?tab=departments" data-nav class="stat-card">
          <div class="stat-top">
            <div class="stat-label">Programs</div>
            <div class="stat-value" id="stat-departments">0</div>
            <div class="stat-sub" id="stat-dept-sub">Manage departments</div>
          </div>
        </a>

        <div class="stat-card wide">
          <div class="stat-top">
            <div class="stat-label">Current Semester</div>
            <div class="stat-value highlight" id="stat-semester">—</div>
            <div class="stat-sub" id="stat-acadyear">Academic Year —</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-top">
            <div class="stat-label">Faculty per Department</div>
            <div class="stat-value" id="stat-faculty-per-dept">Avg —</div>
            <div class="stat-sub">Faculty members per program</div>
          </div>
        </div>
      </div>

      <div class="grid two">
        <div class="card" style="height:320px"><canvas id="chart-students-per-course"></canvas></div>
        <div class="card" style="height:320px"><canvas id="chart-faculty-per-dept"></canvas></div>
      </div>
    </section>
  `;
}

export async function afterDashboardMount() {
  // Fetch stats
  const stats = await fetch('/api/summary').then(r => r.json()).catch(() => ({
    totals: { students: 0, faculty: 0, courses: 0, departments: 0 },
    studentsPerCourse: [],
    facultyPerDepartment: []
  }));
  const el = id => document.getElementById(id);
  if (stats.totals) {
    el('stat-students').textContent = stats.totals.students ?? 0;
    el('stat-faculty').textContent = stats.totals.faculty ?? 0;
    el('stat-courses').textContent = stats.totals.courses ?? 0;
    el('stat-departments').textContent = stats.totals.departments ?? 0;
    // Compute simple average for faculty per department
    const deptCount = Math.max(1, stats.totals.departments || 1);
    const facPerDept = Math.round(((stats.totals.faculty || 0) / deptCount) * 10) / 10;
    const fpd = el('stat-faculty-per-dept'); if (fpd) fpd.textContent = `Avg ${facPerDept}`;
  }

  // Fetch current academic year to display
  try {
    const yrs = await fetch('/api/academic-years?per_page=2000').then(r=>r.json()).then(j=>j.data||j);
    const current = Array.isArray(yrs) ? yrs.find(y=>y.current) : null;
    const month = new Date().getMonth(); // 0-based
    const semester = (month >= 7 && month <= 11) ? 'Fall' : (month >= 0 && month <= 4) ? 'Spring' : 'Summer';
    if (el('stat-semester')) el('stat-semester').textContent = `${semester} ${new Date().getFullYear()}`;
    if (el('stat-acadyear')) el('stat-acadyear').textContent = `Academic Year ${current?.name ?? '—'}`;
  } catch {}

  const { Chart } = await import('chart.js/auto');
  const ctx1 = document.getElementById('chart-students-per-course');
  const ctx2 = document.getElementById('chart-faculty-per-dept');
  if (ctx1) new Chart(ctx1, {
    type: 'bar',
    data: { labels: stats.studentsPerCourse.map(i => i.course), datasets: [{ label: 'Students', data: stats.studentsPerCourse.map(i => i.count), backgroundColor: '#3b82f6' }] },
    options: { responsive: true, maintainAspectRatio: false }
  });
  if (ctx2) new Chart(ctx2, {
    type: 'bar',
    data: { labels: stats.facultyPerDepartment.map(i => i.department), datasets: [{ label: 'Faculty', data: stats.facultyPerDepartment.map(i => i.count), backgroundColor: '#10b981' }] },
    options: { responsive: true, maintainAspectRatio: false }
  });
}
