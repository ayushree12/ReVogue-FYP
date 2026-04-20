import React, { useEffect, useState } from 'react';
import useToastStore from '../store/useToastStore';
import { fetchVerificationRequests, reviewVerificationRequest } from '../api/admin';

const statusStyles = {
  pending: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  rejected: 'bg-red-50 text-red-600 border-red-200'
};

const AdminVerification = () => {
  const [requests, setRequests] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  const loadRequests = () => {
    setLoading(true);
    fetchVerificationRequests()
      .then((res) => {
        setRequests(res.requests || []);
      })
      .catch(() => {
        setRequests([]);
        showToast('Unable to load verification queue');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleReview = async (requestId, status) => {
    const note = notes[requestId] || '';
    try {
      const res = await reviewVerificationRequest(requestId, { status, adminNote: note });
      setRequests((prev) =>
        prev.map((item) => (item._id === requestId ? res.request : item))
      );
      showToast(`Request ${status === 'approved' ? 'approved' : 'updated'}`);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Unable to update request');
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="section-subtitle">Verification queue</p>
        <h1 className="text-3xl font-semibold">Seller stories awaiting approval</h1>
      </header>

      <div className="section-card space-y-4 p-6">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-slate-500">
            Loading requests…
          </div>
        ) : requests.length ? (
          requests.map((request) => (
            <article
              key={request._id}
              className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {request.vendorId?.name || request.sellerId?.name || 'Vendor'}
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {request.sellerId?.email || '—'}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                    statusStyles[request.status] || statusStyles.pending
                  }`}
                >
                  {request.status}
                </span>
              </div>
              <p className="text-sm text-muted mt-2">{request.message || request.story || 'No notes provided.'}</p>
              <textarea
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                placeholder="Add an admin note (optional)"
                value={notes[request._id] || ''}
                onChange={(e) => setNotes((prev) => ({ ...prev, [request._id]: e.target.value }))}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow transition hover:bg-emerald-600"
                  onClick={() => handleReview(request._id, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 hover:border-slate-400 transition"
                  onClick={() => handleReview(request._id, 'rejected')}
                >
                  Reject
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="text-muted px-4 py-6 text-center">No pending verification requests.</p>
        )}
      </div>
    </section>
  );
};

export default AdminVerification;
