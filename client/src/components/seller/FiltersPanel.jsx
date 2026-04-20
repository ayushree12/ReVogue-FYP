import React from 'react';
import { Search } from 'lucide-react';

const FiltersPanel = ({
  searchTerm,
  paymentFilter,
  sortOrder,
  onSearchChange,
  onPaymentChange,
  onSortChange
}) => (
  <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm sm:grid-cols-[1.2fr_0.9fr_0.9fr]">
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        Search
      </label>
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          className="flex-1 text-sm text-slate-600 outline-none"
          placeholder="Order ID or customer"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        Payment
      </label>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
        value={paymentFilter}
        onChange={(e) => onPaymentChange(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Paid">Paid</option>
        <option value="Unpaid">Unpaid</option>
      </select>
    </div>
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        Date
      </label>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="Newest">Newest</option>
        <option value="Oldest">Oldest</option>
      </select>
    </div>
  </div>
);

export default FiltersPanel;
