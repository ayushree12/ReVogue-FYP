import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageCircle,
  BarChart3,
  Plus,
  Settings,
  LogOut
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/seller/dashboard', icon: LayoutDashboard },
  { label: 'Products', to: '/seller/products', icon: Package },
  { label: 'Orders', to: '/seller/orders', icon: ShoppingCart },
  { label: 'Chats', to: '/seller/chats', icon: MessageCircle, badge: 4 },
  { label: 'Analytics', to: '/seller/analytics', icon: BarChart3 }
];

const SellerSidebar = () => (
  <aside className="hidden w-64 shrink-0 lg:flex min-h-[calc(100vh-76px)]">
    <div className="glass-panel flex h-full flex-col gap-4 rounded-[32px] border border-slate-200 bg-white/95 p-5 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-inner">
          R
        </div>
        <div className="space-y-1 text-xs uppercase tracking-[0.3em] text-slate-500">
          <p className="text-sm font-semibold text-slate-900">Revogue</p>
          <p>Seller</p>
        </div>
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
            {item.badge && (
              <span className="badge-pill">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3">
        <NavLink
          to="/seller/products/new"
          className="flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </NavLink>
        <NavLink
          to="/seller/settings"
          className="flex items-center justify-center gap-2 rounded-3xl border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-3xl border border-red-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-500"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  </aside>
);

export default SellerSidebar;
