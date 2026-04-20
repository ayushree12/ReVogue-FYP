import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ORDER_SEQUENCE = ['pending', 'paid', 'shipped', 'delivered'];
const ORDER_LABELS = {
  pending: 'Order placed',
  paid: 'Payment confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

const buildOrderTimeline = (status) => {
  if (status === 'cancelled') {
    const cancelledSteps = ORDER_SEQUENCE.map((step) => ({
      key: step,
      label: ORDER_LABELS[step],
      completed: true
    }));
    return [...cancelledSteps, { key: 'cancelled', label: ORDER_LABELS.cancelled, completed: true }];
  }
  const activeIndex = Math.max(0, ORDER_SEQUENCE.indexOf(status));
  return ORDER_SEQUENCE.map((step, index) => ({
    key: step,
    label: ORDER_LABELS[step],
    completed: activeIndex >= index
  }));
};

const OrderTimeline = ({ status }) => {
  const timeline = useMemo(() => buildOrderTimeline(status), [status]);
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em]">
      {timeline.map((step) => (
        <span
          key={step.key}
          className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${
            step.completed
              ? 'border-indigo-500 bg-indigo-500 text-white'
              : 'border-slate-200 bg-white text-slate-500'
          }`}
        >
          {step.label}
        </span>
      ))}
    </div>
  );
};

const getTimeline = (status) => {
  return buildOrderTimeline(status).map((step) => ({
    key: step.key,
    label: step.label,
    active: step.completed
  }));
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/orders/me');
        setOrders(res.data.orders || []);
        setSelectedOrder(res.data.orders?.[0] || null);
      } catch (err) {
        setOrders([]);
      }
    };
    load();
  }, []);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="section-subtitle">Your orders</p>
        <h1 className="text-3xl font-semibold">Track everything in one place</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="section-card space-y-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Active orders</p>
              <h2 className="text-2xl font-semibold">Order history</h2>
            </div>
            <button className="text-xs uppercase tracking-[0.3em] text-indigo-600">Download</button>
          </div>
          <div className="space-y-4">
            {orders.length ? (
              orders.map((order) => (
                <article
                  key={order._id}
                  className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm transition hover:border-indigo-300 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-muted">#{order._id}</p>
                      <p className="text-base font-semibold">Rs {order.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                      <span className="rounded-full border border-slate-200 px-3 py-1 text-indigo-600">
                        {order.status || 'Pending'}
                      </span>
                      <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted">Vendor: {order.vendor?.name || '—'}</p>
                  <OrderTimeline status={order.status} />
                </article>
              ))
            ) : (
              <p className="text-muted">You have not placed any orders yet.</p>
            )}
          </div>
        </div>

        <aside className="section-card space-y-4 p-6">
          <p className="section-subtitle">Order details</p>
          {selectedOrder ? (
            <div className="space-y-3">
            <div>
              <p className="text-sm text-muted">#{selectedOrder._id}</p>
              <p className="text-xl font-semibold">Rs {selectedOrder.totalAmount?.toLocaleString()}</p>
              <p className="text-sm text-muted">Status: {selectedOrder.status}</p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Timeline</p>
              <div className="flex flex-wrap gap-2">
                {getTimeline(selectedOrder.status).map((step) => (
                  <span
                    key={step.key}
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
                      step.active ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-1 text-sm text-slate-500">
              <p>Tracking #: {selectedOrder.payment?.transactionId || '—'}</p>
              <p>Estimated delivery: {selectedOrder.deliveryDate || 'TBD'}</p>
              <p>Courier: {selectedOrder.courier || 'Revogue Logistics'}</p>
            </div>
            <div className="flex flex-col gap-3" ref={trackRef}>
              <button
                type="button"
                onClick={() => trackRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg hover:bg-indigo-700 transition"
              >
                Track this order
              </button>
              <button
                type="button"
                onClick={() => navigate('/messages')}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700"
              >
                Message vendor
              </button>
            </div>
            </div>
          ) : (
            <p className="text-muted">Select an order to see details.</p>
          )}
        </aside>
      </div>
    </section>
  );
};

export default Orders;
