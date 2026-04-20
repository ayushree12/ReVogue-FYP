import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  BarChart3,
  ShieldCheck,
  Plus,
  LogOut
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: Layers },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Verifications', to: '/admin/verification', icon: ShieldCheck }
];

const AdminSidebar = () => {
  const { logout } = useAuthStore();

  return (
    <aside className="hidden w-64 shrink-0 lg:flex min-h-[calc(100vh-76px)]">
      <div className="glass-panel flex h-full flex-col gap-4 rounded-[32px] border border-slate-200 bg-white/95 p-5 shadow-2xl">
        <div className="space-y-1 text-xs uppercase tracking-[0.3em] text-slate-500">
          <p className="text-sm font-semibold text-slate-900">Revogue</p>
          <p>Admin</p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-600 shadow-inner'
                    : 'text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <NavLink
            to="/admin/reports"
            className="flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Generate report
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-3xl border border-red-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-500"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
