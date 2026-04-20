import React from 'react';

const FilterSidebar = ({ filters, setFilters }) => (
  <div className="bg-white rounded-3xl p-4 shadow">
    <h3 className="font-semibold text-lg mb-3">Filters</h3>
    <label className="text-xs uppercase tracking-wide text-muted">Condition</label>
    <select
      className="w-full mb-3 border border-slate-200 rounded-xl px-3 py-2"
      value={filters.condition || ''}
      onChange={(e) => setFilters((prev) => ({ ...prev, condition: e.target.value || undefined }))}
    >
      <option value="">Any</option>
      <option value="new">New</option>
      <option value="like_new">Like New</option>
      <option value="good">Good</option>
    </select>
    <label className="text-xs uppercase tracking-wide text-muted">Price</label>
    <div className="flex gap-2">
      <input
        type="number"
        className="w-1/2 border border-slate-200 rounded-xl px-3 py-2"
        placeholder="Min"
        value={filters.minPrice || ''}
        onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value || undefined }))}
      />
      <input
        type="number"
        className="w-1/2 border border-slate-200 rounded-xl px-3 py-2"
        placeholder="Max"
        value={filters.maxPrice || ''}
        onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value || undefined }))}
      />
    </div>
    <label className="text-xs uppercase tracking-wide text-muted mt-3 block">Size</label>
    <input
      className="w-full border border-slate-200 rounded-xl px-3 py-2"
      placeholder="Size"
      value={filters.size || ''}
      onChange={(e) => setFilters((prev) => ({ ...prev, size: e.target.value || undefined }))}
    />
  </div>
);

export default FilterSidebar;
