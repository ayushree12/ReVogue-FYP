import React from 'react';
import { ListChecks } from 'lucide-react';

const OrdersTable = ({ orders, statusOptions, onStatusChange, onOpenDetails }) => (
  <div className="overflow-x-auto">
    <div className="min-w-full">
      <div className="grid grid-cols-12 gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500 md:text-[0.7rem]">
        {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map((label) => (
          <span key={label} className={label === 'Actions' ? 'col-span-2' : ''}>
            {label}
          </span>
        ))}
      </div>
      {orders.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-white/80 p-8 text-center text-sm text-slate-500">
          No orders match the selected filters.
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="mt-4 grid grid-cols-12 gap-4 rounded-3xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-sm"
          >
            <span className="col-span-2 font-semibold text-slate-900">{order.id}</span>
            <span className="col-span-2">{order.customer}</span>
            <span>{order.itemsCount}</span>
            <span>Rs {order.total.toLocaleString()}</span>
            <span className="text-slate-500">{order.payment}</span>
            <span className="col-span-2">
              <select
                className="w-full rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                value={order.status || statusOptions[0]?.value || ''}
                onChange={(e) => onStatusChange(order.id, e.target.value || statusOptions[0]?.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </span>
            <span>{order.date}</span>
            <span className="col-span-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenDetails(order)}
                className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
              >
                <ListChecks className="h-4 w-4" />
                Details
              </button>
            </span>
          </div>
        ))
      )}
    </div>
  </div>
);

export default OrdersTable;
