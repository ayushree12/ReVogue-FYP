import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const primaryLinks = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/collections' },
  { label: 'Support', to: '/messages' }
];

const roleQuickLink = {
  admin: { label: 'Admin dashboard', to: '/admin/dashboard' },
  seller: { label: 'Vendor dashboard', to: '/seller/dashboard' }
};

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="glass-panel border border-slate-200 bg-white/70 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-lg tracking-tight shadow-lg">
              R
            </div>
            <div>
              <p className="font-bodoni font-semibold text-lg text-slate-900 tracking-tight leading-none">REVOGUE</p>
              <p className="text-xs text-muted uppercase tracking-[0.3em]">Sustainable Trade</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
            {primaryLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="font-medium hover:text-slate-900 transition"
              >
                {link.label}
              </Link>
            ))}
            {user && roleQuickLink[user.role] && (
              <Link
                to={roleQuickLink[user.role].to}
                className="font-semibold text-xs uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900"
              >
                {roleQuickLink[user.role].label}
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/cart"
              className="px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium hover:border-slate-400 transition"
            >
              Cart
            </Link>
            {user ? (
              <>
                <Link
                  to="/account"
                  className="px-3 py-1.5 font-medium text-sm text-slate-700 hover:text-slate-900"
                >
                  {user.name || user.email}
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-full bg-black text-white text-sm font-semibold shadow-md hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Login
                </Link>
                <Link
                  to="/seller/verification"
                  className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-lg hover:bg-indigo-700 transition"
                >
                  Vendor access
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-full border border-slate-200 w-11 h-11 text-slate-600 hover:text-slate-900"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Toggle navigation menu</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-100 px-4 py-3">
            <nav className="flex flex-col gap-2 text-sm text-slate-700">
              {primaryLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="py-2 px-2 rounded-lg hover:bg-slate-100 transition"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/cart"
                className="py-2 px-2 rounded-lg hover:bg-slate-100 transition"
                onClick={() => setOpen(false)}
              >
                Cart
              </Link>
              {user ? (
                <>
                  <span className="py-2 px-2 rounded-lg text-slate-600">Signed in as {user.name || user.email}</span>
                  <button
                    onClick={logout}
                    className="py-2 px-2 rounded-lg border border-slate-200 text-slate-700 font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="py-2 px-2 rounded-lg hover:bg-slate-100 transition"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/seller/verification"
                    className="py-2 px-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold transition text-center"
                    onClick={() => setOpen(false)}
                  >
                    Vendor access
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
