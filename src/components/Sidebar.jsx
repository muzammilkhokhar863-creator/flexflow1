import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, Clock3, LayoutDashboard, LifeBuoy, LogOut, Settings, Smartphone, UserRound, Wrench } from 'lucide-react';
import { apiRequest } from '../lib/api.js';

const customerLinks = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'New repair', to: '/new-repair', icon: Wrench },
  { label: 'Track request', to: '/track', icon: Activity },
  { label: 'Repair history', to: '/history', icon: Clock3 },
  { label: 'My devices', to: '/devices', icon: Smartphone },
  { label: 'Profile', to: '/profile', icon: UserRound },
  { label: 'Settings', to: '/settings', icon: Settings },
];

const managerLinks = [
  { label: 'Dashboard', to: '/manager/dashboard', icon: LayoutDashboard },
  { label: 'Requests', to: '/manager/requests', icon: Wrench },
];

function Sidebar({ manager = false }) {
  const navigate = useNavigate();
  const links = manager ? managerLinks : customerLinks;
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  async function logout() {
    setIsSigningOut(true);
    setLogoutError('');
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
      navigate('/login', { replace: true });
    } catch (error) {
      setLogoutError(error.message || 'Could not sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <aside className="sidebar">
      <NavLink className="brand brand--sidebar" to={manager ? '/manager/dashboard' : '/dashboard'}>
        <span className="brand__mark"><Wrench size={18} strokeWidth={2.5} /></span>
        <span>fix<span>flow</span></span>
      </NavLink>
      <p className="sidebar__caption">{manager ? 'WORKSPACE' : 'MENU'}</p>
      <nav className="sidebar__nav" aria-label={manager ? 'Manager navigation' : 'Customer navigation'}>
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}>
            <Icon size={18} strokeWidth={1.8} /> <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      {!manager && <div className="sidebar__help">
        <span className="sidebar__help-icon"><LifeBuoy size={18} /></span>
        <p>Need a hand?</p>
        <span>We’re here to help.</span>
        <NavLink to="/help">Visit help center <span aria-hidden="true">↗</span></NavLink>
      </div>}
      {logoutError && <p className="sidebar__error" role="alert">{logoutError}</p>}
      <button className="sidebar__logout" onClick={logout} type="button" disabled={isSigningOut}>
        <LogOut size={18} /> {isSigningOut ? 'Signing out…' : 'Sign out'}
      </button>
    </aside>
  );
}

export default Sidebar;
