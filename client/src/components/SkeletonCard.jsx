import React from 'react';

const SkeletonCard = () => (
  <div className="animate-pulse bg-white border border-slate-100 rounded-3xl p-4 space-y-3 shadow">
    <div className="h-40 bg-slate-200 rounded-2xl"></div>
    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
  </div>
);

export default SkeletonCard;
