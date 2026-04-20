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
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
            : 'border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-slate-900'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default StatusTabs;
