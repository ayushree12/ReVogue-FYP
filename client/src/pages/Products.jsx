import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import useDebounce from '../hooks/useDebounce';

const Products = () => {
  const [filters, setFilters] = useState({ search: '', sort: 'newest' });
  const debouncedSearch = useDebounce(filters.search, 600);
  const [data, setData] = useState({ products: [], meta: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      search: debouncedSearch,
      condition: filters.condition,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      size: filters.size,
      sort: filters.sort
    })
      .then((res) => setData({ products: res.products || [], meta: res.meta }))
      .finally(() => setLoading(false));
  }, [debouncedSearch, filters.condition, filters.minPrice, filters.maxPrice, filters.size, filters.sort]);

  return (
    <section className="grid lg:grid-cols-[280px,1fr] gap-6">
      <FilterSidebar filters={filters} setFilters={setFilters} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">All Products</h1>
          <select
            className="border border-slate-200 rounded-full px-4 py-2"
            value={filters.sort}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
        {loading ? (
          <p className="text-sm text-muted">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
