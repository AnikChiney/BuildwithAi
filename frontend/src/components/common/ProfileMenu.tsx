import React, { useEffect, useRef, useState } from 'react';
import { LogOut, Mail, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProfileMenu.css';

export const ProfileMenu: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <button
        type="button"
        className="profile-menu__login"
        onClick={() => navigate('/login')}
      >
        Sign in
      </button>
    );
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('') || 'U';

  const handleLogout = async () => {
    if (busy) return;

    setBusy(true);

    try {
      await logout();
      setOpen(false);
      navigate('/login');
    } catch (error) {
      // Keep the user signed in if the backend logout request fails.
      console.error('Logout failed:', error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        type="button"
        className={`profile-menu__trigger ${open ? 'profile-menu__trigger--open' : ''}`}
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
      >
        <span className="profile-menu__avatar" aria-hidden="true">
          {initials}
        </span>

        <span className="profile-menu__trigger-name">
          {user.name}
        </span>

        <ChevronDown className="profile-menu__chevron" size={14} />
      </button>

      {open && (
        <div className="profile-menu__dropdown" role="menu">
          <div className="profile-menu__profile">
            <div className="profile-menu__large-avatar" aria-hidden="true">
              {initials}
            </div>

            <div className="profile-menu__identity">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <div className="profile-menu__divider" />

          <div className="profile-menu__details">
            <div className="profile-menu__detail">
              <User size={14} />
              <div>
                <small>Name</small>
                <span>{user.name}</span>
              </div>
            </div>

            <div className="profile-menu__detail">
              <Mail size={14} />
              <div>
                <small>Login email</small>
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <div className="profile-menu__divider" />

          <button
            type="button"
            className="profile-menu__logout"
            onClick={handleLogout}
            disabled={busy}
            role="menuitem"
          >
            <LogOut size={15} />
            <span>{busy ? 'Logging out…' : 'Logout'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
