import React from 'react';
import { Settings, ShieldCheck, CreditCard, Zap } from 'lucide-react';

const toggleOptions = ['Order alerts', 'Chat notifications', 'Weekly reports'];

const SellerSettings = () => (
  <div className="section-card space-y-6 rounded-[32px] p-6 shadow-2xl">
    <header>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Settings</p>
      <h1 className="text-3xl font-semibold text-slate-900">Control panel</h1>
      <p className="text-sm text-slate-500">Update contact info, billing, and notification preferences.</p>
    </header>

    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-2">
      <div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          <Settings className="h-4 w-4 text-slate-900" />
          Profile
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="text-slate-900">Mobile</p>
          <p>+977 9801234567</p>
          <p className="text-slate-900">Address</p>
          <p>Butwal, Lumbini Province</p>
        </div>
      </div>
      <div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-slate-900" />
          Security
        </div>
        <div className="text-sm text-slate-600">
          <p className="text-slate-900">Two-factor authentication</p>
          <p>Enabled · Email & SMS verification</p>
        </div>
      </div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Billing</p>
        <CreditCard className="h-5 w-5 text-slate-900" />
      </div>
      <p className="mt-2 text-sm text-slate-600">Payment method on file. Update to switch payout account.</p>
      <button className="mt-4 rounded-2xl bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg">
        Manage payout
      </button>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Notifications</p>
      <div className="mt-4 space-y-3">
        {toggleOptions.map((option) => (
          <div
            key={option}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
          >
            <span>{option}</span>
            <button className="rounded-full border border-slate-300 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-slate-900">
              ON
            </button>
          </div>
        ))}
      </div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Preferences</p>
          <p className="text-slate-900">Personalize Revogue to suit your rhythm.</p>
        </div>
        <button className="flex items-center gap-2 rounded-full border border-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black">
          <Zap className="h-4 w-4" />
          Customize
        </button>
      </div>
    </section>
  </div>
);

export default SellerSettings;
