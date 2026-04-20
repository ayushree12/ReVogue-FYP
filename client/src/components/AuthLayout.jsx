import React from 'react';

const AuthLayout = ({ title, description, highlightList = [], footerCallout, children }) => (
  <div className="mx-auto w-full max-w-5xl space-y-10">
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-8 text-white shadow-[0_20px_80px_rgba(15,23,42,0.45)]">
        <p className="text-xs uppercase tracking-[0.4em] text-indigo-200/80">Revogue access</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">{title}</h1>
        <p className="mt-4 text-slate-200">{description}</p>
        <div className="mt-6 space-y-3">
          {highlightList.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-100 shadow-inner">
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-100/80">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
        {footerCallout && <div className="mt-6 rounded-2xl border border-white/30 bg-white/10 p-3 text-sm">{footerCallout}</div>}
      </div>

      <div className="rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-2xl shadow-slate-900/10">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
