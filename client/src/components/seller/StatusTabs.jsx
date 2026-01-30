import React from 'react';

const StatusTabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {tabs.map((tab) => (
      <button
        key={tab}
        type="button"
        onClick={() => onChange(tab)}
        className={`rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
          activeTab === tab
            ? 'bg-black text-white shadow-lg shadow-black/20'
            : 'border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default StatusTabs;
