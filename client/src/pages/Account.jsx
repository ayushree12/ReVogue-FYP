import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';

const Account = () => {
  const { user, token, setAuth, logout } = useAuthStore();
  const { showToast } = useToastStore();
  const [orders, setOrders] = useState([]);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    location: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get('/orders/me');
        setOrders(res.data.orders || []);
      } catch (err) {
        setOrders([]);
      }
    };
    loadOrders();
  }, []);
  useEffect(() => {
    if (!user) return;
    setProfile({
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || '',
      location: user.sellerProfile?.address || ''
    });
  }, [user]);

  const latestOrder = orders[0];

  const submitVerificationRequest = async () => {
    if (!verificationMessage.trim()) {
      showToast('Share more about your collection');
      return;
    }
    try {
      await api.post('/users/seller/verification-request', {
        message: verificationMessage,
        documents: []
      });
      showToast('Verification request submitted');
      setVerificationMessage('');
    } catch (err) {
      showToast('Unable to submit request');
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await api.patch('/users/me', {
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        location: profile.location
      });
      if (token) {
        setAuth(res.data.user, token);
      }
      showToast('Profile saved');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Unable to save profile');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <p className="section-subtitle">Profile</p>
        <h1 className="text-3xl font-semibold">Welcome back, {user?.name?.split(' ')[0] || 'Revogue member'}</h1>
        <p className="max-w-3xl text-sm text-muted">
          Manage personal info, track orders, message vendors, and request vendor approval in one place.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="section-card space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Account</p>
              <h2 className="text-2xl font-semibold text-slate-900">{user?.email}</h2>
            </div>
            <button
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              onClick={logout}
            >
              Logout
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
              <p className="text-lg font-semibold text-slate-900">{user?.role}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Verified</p>
              <p className="text-lg font-semibold text-slate-900">{user?.verified ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Orders</p>
              <p className="text-lg font-semibold text-slate-900">{orders.length}</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted">Use this space to keep your contact info current.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Full name</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-slate-900 focus:outline-none"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Email</label>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-slate-900 focus:outline-none"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Avatar URL</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-slate-900 focus:outline-none"
                  value={profile.avatar}
                  onChange={(e) => handleProfileChange('avatar', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Delivery location</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-slate-900 focus:outline-none"
                  value={profile.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  placeholder="City, street, landmark"
                />
              </div>
            </div>
            <button
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={saveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </article>

        <article className="section-card space-y-4 p-6">
          <p className="section-subtitle">Quick actions</p>
          <div className="space-y-3">
            <button className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition">
              Chat with vendors
            </button>
            <button className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              View saved carts
            </button>
            {user?.role === 'user' && (
              <button
                className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-inner"
                onClick={() => showToast('Vendor request added to queue')}
              >
                Request vendor status
              </button>
            )}
          </div>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="section-card space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-subtitle">Latest order</p>
              <h2 className="text-2xl font-semibold">Order tracking</h2>
            </div>
            <button className="text-xs uppercase tracking-[0.3em] text-slate-900">Track</button>
          </div>
          {latestOrder ? (
            <div className="space-y-3">
              <p className="text-sm text-muted">#{latestOrder._id}</p>
              <p className="text-lg font-semibold">Rs {latestOrder.totalAmount?.toLocaleString()}</p>
              <p className="text-sm text-muted">Status: {latestOrder.status}</p>
              <p className="text-xs text-slate-500">Updated {new Date(latestOrder.updatedAt || latestOrder.createdAt).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-muted">No recent orders.</p>
          )}
        </article>

        <article className="section-card space-y-4 p-6">
          <p className="section-subtitle">Verification</p>
          <h2 className="text-xl font-semibold">Vendor registration</h2>
          <p className="text-sm text-muted">
            Submit a short note about your inventory and we will notify you once admins approve the vendor profile.
          </p>
          <textarea
            rows={4}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
            value={verificationMessage}
            onChange={(e) => setVerificationMessage(e.target.value)}
            placeholder="Why should Revogue approve your vendor account?"
          />
          <button
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition"
            onClick={submitVerificationRequest}
          >
            Submit for review
          </button>
        </article>
      </div>
    </section>
  );
};

export default Account;
