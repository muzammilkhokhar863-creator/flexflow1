import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Menu } from 'lucide-react';

function Topbar({ user, onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const initials = user.name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') setProfileOpen(false);
    }

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <header className="topbar">
      <button className="icon-button topbar__menu" type="button" onClick={onMenuClick} aria-label="Open menu"><Menu size={20} /></button>
      <div className="topbar__crumb"><span>Workspace</span><span className="crumb-divider">/</span><strong>Overview</strong></div>
      <div className="topbar__right">
        <button className="icon-button topbar__notification" type="button" aria-label="Notifications"><Bell size={19} /><i /></button>
        <div className="topbar__profile-wrap" ref={profileRef}>
          <button
            className="topbar__profile"
            type="button"
            aria-label={`Account details for ${user.name}`}
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span className="avatar">{initials}</span>
            <span className="topbar__name">{user.name}</span>
            <ChevronDown size={15} />
          </button>
          {profileOpen && (
            <div className="topbar__profile-menu" id="account-details" aria-label="Account details">
              <p className="topbar__profile-menu-label">Signed in as</p>
              <strong>{user.name}</strong>
              <span className="topbar__profile-email">{user.email}</span>
              <span className="topbar__profile-role">{user.role === 'manager' ? 'Manager' : 'Customer'}</span>
              <div className="topbar__profile-divider" />
              {user.role === 'manager' ? (
                <Link to="/manager/dashboard" onClick={() => setProfileOpen(false)}>Manager workspace</Link>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setProfileOpen(false)}>My profile</Link>
                  <Link to="/settings" onClick={() => setProfileOpen(false)}>Settings</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
