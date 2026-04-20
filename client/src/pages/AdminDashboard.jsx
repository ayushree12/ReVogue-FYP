import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import useToastStore from '../store/useToastStore';

const badgeColors = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  paid: 'bg-slate-100 text-slate-800'
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const { showToast } = useToastStore();

  useEffect(() => {
    let isMounted = true;
    const requests = [
      api.get('/admin/stats'),
      api.get('/admin/orders/recent'),
      api.get('/admin/verification-requests')
    ];

    Promise.all(requests)
      .then(([statsRes, ordersRes, requestsRes]) => {
        if (!isMounted) return;
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.orders || []);
        setPendingRequests(requestsRes.data.requests || []);
      })
      .catch(() => {
        if (isMounted) {
          showToast('Unable to load admin overview');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const statusBreakdown = useMemo(() => {
    return recentOrders.reduce((acc, order) => {
      const key = (order.status || 'pending').toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [recentOrders]);

  const handleVendorAction = async (requestId, status) => {
    try {
      await api.patch(`/admin/verification-requests/${requestId}`, { status });
      const updatedRequests = pendingRequests.map((req) =>
        req._id === requestId ? { ...req, status } : req
      );
      setPendingRequests(updatedRequests);
      showToast(`Vendor marked as ${status}`);
    } catch {
      showToast('Unable to update vendor status');
    }
  };

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="section-subtitle">Admin overview</p>
        <h1 className="text-3xl font-semibold">Marketplace health</h1>
        <p className="text-sm text-muted max-w-2xl">
          Track user growth, approve vendors, and keep every dashboard transparent.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Total users"
          value={stats.totalUsers ?? '—'}
          helper="All shoppers and partners"
        />
        <StatCard
          label="Vendors approved"
          value={stats.sellers ?? '—'}
          helper="Admin-reviewed studios"
        />
        <StatCard
          label="Products live"
          value={stats.products ?? '—'}
          helper="Curated listings"
        />
        <StatCard
          label="Orders total"
          value={stats.orders ?? '—'}
          helper="Captured across vendors"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="section-card space-y-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-subtitle">Recent orders</p>
              <h2 className="text-2xl font-semibold">Live activity snapshot</h2>
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Right now</span>
          </div>
          <div className="grid gap-4">
            {recentOrders.length ? (
              recentOrders.map((order) => (
                <article
                  key={order._id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm text-muted">#{order._id}</p>
                    <p className="text-lg font-semibold">Rs {order.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        badgeColors[order.status?.toLowerCase()] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.status || 'Pending'}
                    </span>
                    <p className="text-slate-500">{order.userId?.name || 'Customer'}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-muted">No recent orders yet.</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusBreakdown).map(([key, value]) => (
              <span key={key} className="badge-pill bg-slate-100 text-slate-700">
                {key}: {value}
              </span>
            ))}
          </div>
        </section>

        <section className="section-card space-y-3 p-6">
          <div>
            <p className="section-subtitle">Verification queue</p>
            <h2 className="text-2xl font-semibold">Pending vendor approvals</h2>
          </div>
          <div className="space-y-3">
            {pendingRequests.length ? (
              pendingRequests.map((request) => (
                <article key={request._id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {request.storeName || request.sellerId?.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        {request.contactNumber || request.sellerId?.email}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      {request.vendorId?.status || request.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{request.message || 'No message provided yet.'}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <button
                      className="rounded-full bg-emerald-500/90 px-3 py-1 font-semibold text-white transition hover:bg-emerald-600"
                      onClick={() => handleVendorAction(request._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-full border border-slate-300 px-3 py-1 font-semibold text-slate-700 transition hover:border-slate-400"
                      onClick={() => handleVendorAction(request._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-muted">No pending requests.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
