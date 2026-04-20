import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Stack, LifeBuoy, LogOut } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Collections', to: '/collections', icon: Stack },
  { label: 'Support', to: '/support', icon: LifeBuoy }
];

const TopNavbar = () => (
  <header className="sticky top-0 z-30 w-full bg-slate-950/95 shadow-lg backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
      <div className="flex items-center gap-6">
        <span className="text-lg font-bold text-white">Revogue</span>
        <nav className="flex items-center gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-slate-300">Seller Cockpit</span>
        <button className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:border-slate-500 hover:bg-slate-800">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  </header>
);

export default TopNavbar;
