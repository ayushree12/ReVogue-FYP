import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';

const SellerVerification = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const [form, setForm] = useState({
    contactNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () =>
      form.contactNumber.trim().length >= 8 && form.address.trim().length >= 10,
    [form]
  );

  const submit = async () => {
    if (!user) {
      showToast('Please log in to submit a vendor request');
      return;
    }
    if (!canSubmit) {
      showToast('Please complete all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/users/seller/verification-request', {
        contactNumber: form.contactNumber,
        address: form.address,
        documents: [{ name: 'Identity proof', status: 'pending' }]
      });
      showToast('Verification request submitted');
    setForm({
      contactNumber: '',
      address: ''
    });
    } catch (err) {
      showToast('Unable to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="section-card space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl">
        <p className="section-subtitle">Member required</p>
        <h1 className="headline text-slate-900">Vendor verification</h1>
        <p className="text-muted">
          Log in to link your account to the verification queue and get notified once admins review your profile.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg"
        >
          Login to apply
        </Link>
      </div>
    );
  }

  if (user.role === 'seller' && user.sellerProfile?.verificationStatus === 'approved') {
    return (
      <div className="section-card space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl">
        <p className="section-subtitle">Verified vendor</p>
        <h1 className="headline text-slate-900">You are already approved</h1>
        <p className="text-muted">Head to your seller dashboard to manage catalogues and orders.</p>
        <Link
          to="/seller/dashboard"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg"
        >
          Open seller dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="section-card rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
        <p className="section-subtitle">Vendor setup</p>
        <h1 className="headline text-slate-900">Become a vendor, stay anonymous</h1>
        <p className="text-sm text-muted">
          No store name required—just share your mobile number and address. We auto-create a seller account and you can
          rename yourself later from Settings once approved.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-slate-500">
            Contact number
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none"
              value={form.contactNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, contactNumber: e.target.value }))}
              placeholder="+977 98xx xxxx"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-500">
            Address
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none"
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Enter your pickup/delivery area"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-600">Documents we accept: ID, vendor license, inventory checklist.</p>
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {loading ? 'Submitting...' : 'Submit for approval'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerVerification;
