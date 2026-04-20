import React from 'react';
import { X, MapPin, User, CreditCard, CheckCircle2 } from 'lucide-react';

const OrderDrawer = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Order</p>
              <h2 className="text-2xl font-semibold text-slate-900">{order.id}</h2>
            </div>
            <span className="rounded-2xl bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
              {order.displayStatus || order.status}
            </span>
          </div>
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Customer</p>
              <p className="flex items-center gap-2 text-slate-900">
                <User className="h-4 w-4 text-indigo-500" />
                {order.customer}
              </p>
              <p className="text-xs text-slate-500">{order.customerEmail}</p>
              <p className="text-xs text-slate-500">{order.customerPhone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Address</p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-500" />
                {order.address}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Payment</p>
              <p className="flex items-center gap-2 text-slate-900">
                <CreditCard className="h-4 w-4 text-indigo-500" />
                {order.paymentStatus}
              </p>
              <p className="text-sm font-semibold text-slate-900">Rs {order.total.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Items</p>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      Qty {item.qty} × Rs {item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Rs {(item.qty * item.price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Timeline</p>
            <div className="space-y-2">
              {order.timeline.map((step) => (
                <div key={step} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDrawer;
