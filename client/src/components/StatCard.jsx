import React from 'react';

const StatCard = ({ label, value, helper, className = '' }) => (
  <div className={`section-card flex flex-col gap-3 p-5 ${className}`}>
    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    {helper && <p className="text-sm text-muted">{helper}</p>}
  </div>
);

export default StatCard;
