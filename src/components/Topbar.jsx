import { Bell, ChevronDown, Menu } from 'lucide-react';

function Topbar({ user, onMenuClick }) {
  const initials = user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="topbar">
      <button className="icon-button topbar__menu" type="button" onClick={onMenuClick} aria-label="Open menu"><Menu size={20} /></button>
      <div className="topbar__crumb"><span>Workspace</span><span className="crumb-divider">/</span><strong>Overview</strong></div>
      <div className="topbar__right">
        <button className="icon-button topbar__notification" type="button" aria-label="Notifications"><Bell size={19} /><i /></button>
        <div className="topbar__profile"><span className="avatar">{initials}</span><span className="topbar__name">{user.name}</span><ChevronDown size={15} /></div>
      </div>
    </header>
  );
}

export default Topbar;
