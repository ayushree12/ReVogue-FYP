import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import useToastStore from '../store/useToastStore';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [approving, setApproving] = useState(null);
  const { showToast } = useToastStore();

  const loadProducts = async () => {
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data.products || []);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const approve = async (id) => {
    setApproving(id);
    try {
      await api.patch(`/admin/products/${id}/approve`);
      showToast('Product approved and now live', 'success');
      await loadProducts();
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to approve the listing';
      showToast(message, 'error');
    } finally {
      setApproving(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="section-subtitle">Product catalogue</p>
        <h1 className="text-3xl font-semibold">Review pending listings</h1>
        <p className="text-sm text-muted max-w-3xl">
          Approve each listing before it appears on the storefront. Sellers must wait for admin sign-off.
        </p>
      </header>

      <div className="section-card space-y-4">
        {products.length ? (
          products.map((product) => (
            <div
              key={product._id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-slate-900">{product.title}</p>
                <p className="text-sm text-muted">
                  Seller: {product.sellerId?.name || 'Unknown'} · Condition: {product.condition || 'Unknown'}
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 text-sm sm:flex-row sm:items-center sm:gap-6">
                <span className="text-lg font-semibold text-slate-900">
                  Rs {product.price?.toLocaleString() || '—'}
                </span>
                <button
                  type="button"
                  onClick={() => approve(product._id)}
                  disabled={approving === product._id}
                  className="rounded-full border border-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white disabled:opacity-60"
                >
                  {approving === product._id ? 'Approving…' : 'Approve listing'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted px-4 py-6 text-center">No pending listings at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default AdminProducts;
