require('./bootstrap');

import { renderLayout, afterLayoutMount } from './pages/Layout';
import { renderDashboard, afterDashboardMount } from './pages/Dashboard';
import { renderFaculty, afterFacultyMount } from './pages/Faculty';
import { renderStudents, afterStudentsMount } from './pages/Students';
import { renderSettings, afterSettingsMount } from './pages/Settings';
import { renderReports, afterReportsMount } from './pages/Reports';
import { renderProfile, afterProfileMount } from './pages/Profile';
import { renderLogin, afterLoginMount } from './pages/Login';
import { renderRegister, afterRegisterMount } from './pages/Register';
import { renderContactManager, afterContactManagerMount } from './pages/ContactManager';

const App = (() => {
	const elApp = () => document.getElementById('app');
	const user = () => window.__USER__ || null;
	const isAuthed = () => !!user();

	const routes = {
		'/dashboard': { auth: true, render: renderDashboard, after: afterDashboardMount },
		'/faculty': { auth: true, render: renderFaculty, after: afterFacultyMount },
		'/students': { auth: true, render: renderStudents, after: afterStudentsMount },
		'/reports': { auth: true, render: renderReports, after: afterReportsMount },
		'/settings': { auth: true, render: renderSettings, after: afterSettingsMount },
		'/profile': { auth: true, render: renderProfile, after: afterProfileMount },
		'/login': { auth: false, render: renderLogin, after: afterLoginMount },
		'/register': { auth: false, render: renderRegister, after: afterRegisterMount },
		'/contact-manager': { auth: true, render: renderContactManager, after: afterContactManagerMount },
	};

	function mountAuthPage(path) {
		const def = routes[path];
		if (!def) return navigate('/login', true);
		if (isAuthed()) return navigate('/dashboard', true);
		elApp().innerHTML = def.render();
		def.after && def.after();
	}

	function mountProtectedPage(path) {
		const def = routes[path];
		if (!def) return navigate('/dashboard', true);
		if (!isAuthed()) return navigate('/login', true);
		const content = def.render();
		elApp().innerHTML = renderLayout({ content, currentPath: path, user: user() });
		afterLayoutMount();
		def.after && def.after();
	}

	function renderRoute(url, replace = false) {
		const u = new URL(url, window.location.origin);
		let path = u.pathname;
		// Normalize root
		if (path === '/') path = isAuthed() ? '/dashboard' : '/login';

		const def = routes[path];
		if (!def) {
			// Unknown route
			path = isAuthed() ? '/dashboard' : '/login';
		}

		const finalUrl = path + u.search;
		if (replace) history.replaceState({}, '', finalUrl); else history.pushState({}, '', finalUrl);
		const meta = routes[path];
		if (meta.auth) mountProtectedPage(path); else mountAuthPage(path);
	}

	function onLinkClick(e) {
		const a = e.target.closest('a[data-nav]');
		if (!a) return;
		const href = a.getAttribute('href');
		if (href.startsWith('http')) return; // external
		e.preventDefault();
		renderRoute(href);
	}

	function start() {
		document.addEventListener('click', onLinkClick);
		window.addEventListener('popstate', () => renderRoute(window.location.pathname + window.location.search, true));
		renderRoute(window.location.pathname + window.location.search, true);
	}

	return { start, navigate: renderRoute };
})();

document.addEventListener('DOMContentLoaded', () => App.start());
