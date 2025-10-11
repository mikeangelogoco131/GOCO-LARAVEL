// Simple layout renderer for authenticated pages
export function renderLayout({ content, currentPath, user }) {
  const nav = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/faculty', label: 'Faculty', icon: '👨‍🏫' },
    { href: '/students', label: 'Students', icon: '🎓' },
    { href: '/reports', label: 'Reports', icon: '📊' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
    { href: '/profile', label: 'My Profile', icon: '👤' }
  ];

  const navLinks = nav.map(n => `
    <a class="nav-link ${currentPath === n.href ? 'active' : ''}" href="${n.href}" data-nav>
      <span class="icon">${n.icon}</span>
      <span>${n.label}</span>
    </a>
  `).join('');

  const headerActions = `
    <div style="margin-left:auto; display:flex; align-items:center; gap:10px;">
      ${currentPath === '/dashboard' ? '<a href="/contact-manager" data-nav class="btn btn-outline">✉️ Contact Manager</a>' : ''}
      <button class="btn btn-outline" id="btn-logout" type="button">Logout</button>
    </div>
  `;

  return `
    <div class="app-shell">
      <aside class="app-sidebar">
        <div class="sidebar">
          <div class="brand">FSUU - SFPMS</div>
          ${navLinks}
        </div>
      </aside>
      <header class="app-header">
        <div style="display:flex; align-items:center; gap:12px; width:100%">
          <div class="app-title brand-gradient">FSUU - Student &amp; Faculty Profile Management System</div>
          ${headerActions}
        </div>
      </header>
  <main class="app-main"><div class="page-enter">${content}</div></main>
    </div>
    <footer class="app-footer">
      <div class="container">© ${new Date().getFullYear()} Student & Faculty Management</div>
    </footer>
  `;
}

export function afterLayoutMount() {
  // Logout handling (header button)
  const logout = document.getElementById('btn-logout');
  if (logout) {
    logout.addEventListener('click', async () => {
      try {
        await fetch('/logout', { method: 'POST', headers: { 'X-CSRF-TOKEN': window.__CSRF__ || '' } });
      } finally {
        window.location.href = '/login';
      }
    });
  }
}
