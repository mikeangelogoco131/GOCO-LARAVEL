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

  // Small helpers for formatting and value labels
  const numberFormat = (n) => {
    try { return new Intl.NumberFormat().format(n ?? 0); } catch { return String(n ?? 0); }
  };
  const valueLabelPlugin = {
    id: 'valueLabel',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const dataset = chart.data?.datasets?.[0];
      if (!dataset) return;
      const meta = chart.getDatasetMeta(0);
      ctx.save();
      ctx.fillStyle = '#111827';
      ctx.font = '600 10px Inter, system-ui, "Segoe UI", Arial, sans-serif';
      meta.data.forEach((bar, idx) => {
        const val = dataset.data[idx];
        if (val == null) return;
        const text = numberFormat(val);
        if (chart.options.indexAxis === 'y') {
          // Horizontal bars: label to the right of the bar end
          const x = bar.x + 12;
          const y = bar.y;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, x, y);
        } else {
          // Vertical bars: label above the bar
          const x = bar.x;
          const y = bar.y - 6;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(text, x, y);
        }
      });
      ctx.restore();
    }
  };

  // Prepare Students by Course (sorted desc)
  if (ctx1 && Array.isArray(stats.studentsPerCourse)) {
    const c1 = ctx1.getContext('2d');
    const grad1 = c1.createLinearGradient(0, 0, 0, ctx1.height || 300);
    grad1.addColorStop(0, '#60a5fa'); // light blue
    grad1.addColorStop(1, '#2563eb'); // deep blue
    const spc = [...stats.studentsPerCourse].sort((a, b) => (b.count || 0) - (a.count || 0));
    const labels1 = spc.map(i => i.course);
    const data1 = spc.map(i => i.count);

    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: labels1,
        datasets: [{
          label: 'Students',
          data: data1,
          backgroundColor: grad1,
          borderColor: '#2563eb',
          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 42,
          categoryPercentage: 0.7,
          barPercentage: 0.8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Students by Course',
            align: 'start',
            color: '#111827',
            font: { size: 14, weight: 700 }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            padding: 10,
            callbacks: { label: (ctx) => `${numberFormat(ctx.parsed.y ?? ctx.parsed)} students` }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.05)', borderDash: [3, 3] },
            ticks: { color: '#6b7280', maxRotation: 0, autoSkip: true, autoSkipPadding: 8 }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.08)' },
            ticks: { color: '#6b7280', callback: (v) => numberFormat(v) }
          }
        }
      },
      plugins: [valueLabelPlugin]
    });
  }

  // Prepare Faculty by Department (horizontal, sorted desc)
  if (ctx2 && Array.isArray(stats.facultyPerDepartment)) {
    const c2 = ctx2.getContext('2d');
    const grad2 = c2.createLinearGradient(0, 0, ctx2.width || 300, 0);
    grad2.addColorStop(0, '#34d399'); // light green
    grad2.addColorStop(1, '#059669'); // deep green
    const fpd = [...stats.facultyPerDepartment].sort((a, b) => (b.count || 0) - (a.count || 0));
    const labels2 = fpd.map(i => i.department);
    const data2 = fpd.map(i => i.count);

    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: labels2,
        datasets: [{
          label: 'Faculty',
          data: data2,
          backgroundColor: grad2,
          borderColor: '#059669',
          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 42,
          categoryPercentage: 0.7,
          barPercentage: 0.8,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Faculty by Department',
            align: 'start',
            color: '#111827',
            font: { size: 14, weight: 700 }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            padding: 10,
            callbacks: { label: (ctx) => `${numberFormat(ctx.parsed.x ?? ctx.parsed)} faculty` }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.08)' },
            ticks: { color: '#6b7280', callback: (v) => numberFormat(v) }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)', borderDash: [3, 3] },
            ticks: { color: '#6b7280' }
          }
        }
      },
      plugins: [valueLabelPlugin]
    });
  }
}
