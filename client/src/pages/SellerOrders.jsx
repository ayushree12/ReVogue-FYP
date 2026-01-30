import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const steps = ['Pending', 'Packed', 'Shipped', 'Delivered'];

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/orders/seller');
        setOrders(res.data.orders || []);
      } catch (err) {
        setOrders([]);
      }
    };
    load();
  }, []);

  const statusCounts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        const status = (order.status || 'pending').toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { pending: 0, packed: 0, shipped: 0, delivered: 0 }
    );
  }, [orders]);

  const latestOrder = orders[0];
  const activeStepIndex = latestOrder
    ? Math.max(
        steps.findIndex(
          (step) => step.toLowerCase() === ((latestOrder.status || 'Pending').toLowerCase())
        ),
        0
      )
    : -1;

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <p className="section-subtitle">Vendor orders</p>
        <h1 className="text-3xl font-semibold">Track shipping and communicate</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="section-card space-y-1 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{status}</p>
            <p className="text-2xl font-semibold text-slate-900">{count}</p>
          </div>
        ))}
      </div>

      <div className="section-card space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-subtitle">Order tracking</p>
            <h2 className="text-2xl font-semibold">Latest order timeline</h2>
          </div>
          <button className="text-xs uppercase tracking-[0.3em] text-slate-900">Export</button>
        </div>
        {latestOrder ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted">Order #{latestOrder._id}</p>
              <p className="text-lg font-semibold">Rs {latestOrder.totalAmount?.toLocaleString()}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 text-xs font-semibold ${
                      index <= activeStepIndex ? 'bg-slate-100 text-slate-900' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-xs text-slate-500">{step}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted">Last update: {new Date(latestOrder.updatedAt || latestOrder.createdAt).toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-muted">No orders yet.</p>
        )}
      </div>

      <section className="section-card space-y-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-subtitle">All orders</p>
            <h2 className="text-2xl font-semibold">Details & statuses</h2>
          </div>
          <button className="text-xs uppercase tracking-[0.3em] text-slate-900">Refresh</button>
        </div>
        <div className="grid gap-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-muted">#{order._id}</p>
                  <p className="text-base font-semibold">Rs {order.totalAmount?.toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{order.status}</span>
                  <p className="text-sm text-muted">Buyer: {order.customer?.name || '—'}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default SellerOrders;
