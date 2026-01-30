import { useEffect, useState } from 'react';
import api from '../api/axios';
import useToastStore from '../store/useToastStore';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', parent: '' });
  const [creating, setCreating] = useState(false);
  const { showToast } = useToastStore();

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    setCreating(true);
    try {
      await api.post('/categories', {
        name: form.name.trim(),
        parent: form.parent || null
      });
      showToast(`Category "${form.name.trim()}" created`, 'success');
      setForm({ name: '', parent: '' });
      loadCategories();
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to create category';
      showToast(message, 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="section-subtitle">Category board</p>
        <h1 className="text-3xl font-semibold">Guide vendor curation</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="section-card space-y-4 border border-slate-200 p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-slate-500">
            Category name
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Ex: Menswear"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-500">
            Parent (optional)
            <select
              className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
              value={form.parent}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, parent: event.target.value }))
              }
            >
              <option value="">No parent</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded-2xl bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-60"
          disabled={creating}
        >
          {creating ? 'Adding category…' : 'Add category'}
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.length ? (
          categories.map((category) => (
            <article
              key={category._id}
              className="section-card border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">{category.name}</p>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {category.slug}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                {category.parent ? 'Child category' : 'Root category'}
              </p>
            </article>
          ))
        ) : (
          <p className="text-muted px-4 py-6 text-center">No categories defined yet.</p>
        )}
      </div>
    </section>
  );
};

export default AdminCategories;
