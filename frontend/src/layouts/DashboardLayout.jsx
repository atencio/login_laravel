import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { confirmAction } from '../utils/alerts';

const NAV = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
];

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('nodo_collapsed') === '1');
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = () => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      setMobileOpen((o) => !o);
      return;
    }
    setCollapsed((c) => {
      localStorage.setItem('nodo_collapsed', c ? '0' : '1');
      return !c;
    });
  };

  async function handleLogout() {
    const ok = await confirmAction({
      title: '¿Cerrar sesión?',
      text: 'Tendrás que volver a ingresar tus credenciales.',
      confirmText: 'Cerrar sesión',
    });
    if (!ok) return;
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className={`shell ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-open' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Nodo</span>
        </div>

        <nav className="nav" aria-label="Principal">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} title={label} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={20} />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="me" title={user?.email}>
            <span className="avatar">{initials(user?.name)}</span>
            <span className="me-text">
              <strong>{user?.name}</strong>
              <small>{user?.email}</small>
            </span>
          </div>
          <button className="nav-link logout" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={20} />
            <span className="nav-label">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={toggle} aria-label="Mostrar u ocultar menú">
            <Menu size={20} className="only-mobile" />
            {collapsed ? <PanelLeftOpen size={20} className="only-desktop" /> : <PanelLeftClose size={20} className="only-desktop" />}
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
