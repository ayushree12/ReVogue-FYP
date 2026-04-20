import React, { useEffect, useMemo, useState } from 'react';
import { Search, Pencil, Trash, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useToastStore from '../../store/useToastStore';
import { fetchSellerProducts, updateProduct, deleteProductById } from '../../api/products';

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Active' },
  { value: 'sold', label: 'Sold' },
  { value: 'hidden', label: 'Hidden' }
];

const normalizeProduct = (product) => ({
  ...product,
  id: product._id,
  image: product.images?.[0]?.url || 'https://via.placeholder.com/200',
  status: product.status || 'available',
  condition: product.condition || '—'
});

const SellerProducts = () => {
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [formValues, setFormValues] = useState({ title: '', price: '', condition: '' });
  const [loading, setLoading] = useState(true);
  const [savingProductId, setSavingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const isSaving = Boolean(editProduct && savingProductId === editProduct.id);
  const isDeleting = Boolean(deleteProduct && deletingProductId === deleteProduct.id);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchSellerProducts({ limit: 40 })
      .then((res) => {
        if (!isMounted) return;
        setProducts((res.products || []).map(normalizeProduct));
      })
      .catch((err) => {
        if (!isMounted) return;
        showToast(err?.response?.data?.message || 'Unable to load products');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return products.filter((product) => {
      if (statusFilter !== 'all' && product.status !== statusFilter) return false;
      if (!normalizedSearch) return true;
      return (
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.id.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [products, searchTerm, statusFilter]);

  const openEdit = (product) => {
    setEditProduct(product);
    setFormValues({ title: product.title, price: product.price, condition: product.condition });
  };

  const handleSave = async () => {
    if (!editProduct) return;
    if (!window.confirm('Really want to save these changes? Click OK to continue.')) return;
    const trimmedTitle = formValues.title?.trim();
    const priceValue = Number(formValues.price);

    if (!trimmedTitle) {
      showToast('Title cannot be empty');
      return;
    }
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      showToast('Set a valid price before saving');
      return;
    }

    setSavingProductId(editProduct.id);
    try {
      const payload = {
        title: trimmedTitle,
        price: priceValue,
        condition: formValues.condition
      };
      const response = await updateProduct(editProduct.id, payload);
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editProduct.id ? normalizeProduct(response.product) : product
        )
      );
      showToast('Product updated');
      setEditProduct(null);
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to update product';
      showToast(message);
    } finally {
      setSavingProductId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    if (!window.confirm('Delete this product for good? Click OK only if you really want to remove it.')) {
      return;
    }
    setDeletingProductId(deleteProduct.id);
    try {
      await deleteProductById(deleteProduct.id);
      setProducts((prev) => prev.filter((product) => product.id !== deleteProduct.id));
      showToast('Product removed');
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to delete product';
      showToast(message);
    } finally {
      setDeleteProduct(null);
      setDeletingProductId(null);
    }
  };

  return (
    <div className="section-card space-y-6 rounded-[32px] p-6 shadow-2xl">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Inventory</p>
          <h1 className="text-3xl font-semibold text-slate-900">Product library</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/seller/products/new')}
          className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </header>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="flex-1 text-sm text-slate-600 outline-none"
            placeholder="Search by title or SKU"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_FILTERS.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="col-span-2 rounded-[32px] border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
            Loading products…
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-2 rounded-[32px] border border-dashed border-slate-200 bg-white/60 p-6 text-center text-sm text-slate-500">
            No products match the filters.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <article
              key={product.id}
              className="flex flex-col gap-3 rounded-[32px] border border-slate-100 bg-white p-4 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.title} className="h-20 w-20 rounded-2xl object-cover" />
                <div className="flex-1 space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{product.id}</p>
                  <h2 className="text-lg font-semibold text-slate-900">{product.title}</h2>
                  <p className="text-sm text-slate-500">Rs {product.price?.toLocaleString()}</p>
                </div>
                <span
                  className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <p>Condition: {product.condition}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteProduct(product)}
                    className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-red-500"
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Edit listing</h2>
              <button type="button" onClick={() => setEditProduct(null)} className="text-slate-400">
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em]">Title</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none"
                  value={formValues.title}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em]">Price</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none"
                  value={formValues.price}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em]">Condition</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none"
                  value={formValues.condition}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, condition: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={`rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg ${
                  isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                disabled={isSaving}
              >
                {isSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete product?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete this product? The action is permanent once confirmed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className={`rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white ${
                  isDeleting ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
