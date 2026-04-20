import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ limit: 50 })
      .then((res) => setProducts(res.products || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-muted">Collections</p>
        <h1 className="text-3xl font-semibold">Dive into curated wardrobes</h1>
      </header>
      {loading ? (
        <p className="text-sm text-muted">Loading products...</p>
      ) : products.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No products available yet.</p>
      )}
    </section>
  );
};

export default Collections;
