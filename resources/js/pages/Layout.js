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

  return `
    <div class="app-shell">
      <aside class="app-sidebar">
        <div class="sidebar">
          <div class="brand">FSUU - SFPMS</div>
          ${navLinks}
          <div style="margin-top:auto; padding-top:12px; border-top: 1px dashed rgba(0,0,0,.08)">
            <button class="nav-link" id="btn-logout" type="button">
              <span class="icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      <main class="app-main">${content}</main>
    </div>
    <footer class="app-footer">
      <div class="container">© ${new Date().getFullYear()} Student & Faculty Management</div>
    </footer>
  `;
}

export function afterLayoutMount() {
  // Logout handling
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
