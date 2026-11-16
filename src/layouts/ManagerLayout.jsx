import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import { apiRequest } from '../lib/api.js';

function ManagerLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    apiRequest('/api/auth/me')
      .then(({ user: signedInUser }) => {
        if (!isMounted) return;
        if (signedInUser.role !== 'manager') {
          navigate('/dashboard', { replace: true });
          return;
        }
        setUser(signedInUser);
        setCheckingSession(false);
      })
      .catch((error) => {
        if (!isMounted) return;
        if (error.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        setSessionError(error.message);
        setCheckingSession(false);
      });

    return () => { isMounted = false; };
  }, [navigate]);

  if (checkingSession) return <main className="session-screen">Checking your sign-in…</main>;
  if (sessionError) {
    return (
      <main className="session-screen">
        <h1>Can’t connect to FixFlow</h1>
        <p>Start the backend server, then try again. {sessionError}</p>
        <button className="button" onClick={() => window.location.reload()} type="button">Try again</button>
      </main>
    );
  }
  if (!user) return null;

  return (
    <div className="app-shell">
      <div className={`sidebar-wrap${menuOpen ? ' sidebar-wrap--open' : ''}`}><Sidebar manager /></div>
      <div className="app-shell__main"><Topbar user={user} onMenuClick={() => setMenuOpen(!menuOpen)} /><main className="workspace"><Outlet /></main></div>
      {menuOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    </div>
  );
}

export default ManagerLayout;
