import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import useToastStore from '../store/useToastStore';

const CONDITION_OPTIONS = [
  { value: 'new', label: 'New – factory finishes, tags on' },
  { value: 'like_new', label: 'Like new – barely worn, pristine' },
  { value: 'good', label: 'Good – minor wear that tells a story' },
  { value: 'fair', label: 'Fair – repairable, shows age gracefully' }
];

const NewProduct = () => {
  const [statusMessage, setStatusMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors }
  } = useForm({
    defaultValues: {
      condition: 'good'
    }
  });
  const { showToast } = useToastStore();

  const buildClass = (hasError) =>
    `w-full rounded-2xl border px-3 py-2 transition focus:outline-none focus:border-indigo-500 ${
      hasError ? 'border-rose-300 bg-rose-50 placeholder:text-rose-400' : 'border-slate-200 bg-white'
    }`;

  useEffect(() => {
    if (!statusMessage) return undefined;
    const timer = setTimeout(() => setStatusMessage(null), 4500);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  useEffect(() => {
    let isMounted = true;
    setLoadingCategories(true);
    api
      .get('/categories')
      .then((res) => {
        if (isMounted) {
          setCategories(res.data.categories || []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingCategories(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (values) => {
    setStatusMessage(null);
    const form = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'images') {
        Array.from(value).forEach((file) => form.append('images', file));
        return;
      }
      form.append(key, value);
    });
    setSubmitting(true);
    try {
      await api.post('/products', form);
      showToast('Product created');
      reset({ condition: 'good' });
      resetField('images');
      setStatusMessage({ type: 'success', text: 'Product created and sent to the approval queue.' });
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to create product';
      showToast(message);
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl"
    >
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900">List a product</h1>
        {statusMessage && (
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              statusMessage.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-600'
            }`}
            role="status"
            aria-live="polite"
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p>{statusMessage.text}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">Title</label>
        <input
          className={buildClass(Boolean(errors.title))}
          placeholder="Title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="text-xs font-semibold text-rose-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">Description</label>
        <textarea
          className={buildClass(Boolean(errors.description))}
          placeholder="Description"
          rows={4}
          {...register('description', { required: 'Add a short description' })}
        />
        {errors.description && (
          <p className="text-xs font-semibold text-rose-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Price (Rs)</label>
          <input
            type="number"
            className={buildClass(Boolean(errors.price))}
            placeholder="Price"
            {...register('price', {
              required: 'Price is required',
              min: { value: 1, message: 'Price must be at least Rs 1' }
            })}
          />
          {errors.price && (
            <p className="text-xs font-semibold text-rose-500">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Size</label>
          <input
            className={buildClass(Boolean(errors.size))}
            placeholder="Size (e.g., M, 32, One size)"
            {...register('size', { required: 'Size or fit indicator is required' })}
          />
          {errors.size && (
            <p className="text-xs font-semibold text-rose-500">{errors.size.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">Category</label>
        <select
          className={buildClass(Boolean(errors.categoryId))}
          {...register('categoryId')}
          disabled={loadingCategories || !categories.length}
        >
          <option value="">{categories.length ? 'Select category' : 'No category yet'}</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {loadingCategories && (
          <p className="text-xs text-slate-400">Loading categories…</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">Condition</label>
        <select
          className={buildClass(Boolean(errors.condition))}
          {...register('condition', { required: 'Select the item condition' })}
        >
          {CONDITION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.condition && (
          <p className="text-xs font-semibold text-rose-500">{errors.condition.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">Photos</label>
        <input
          type="file"
          multiple
          className={buildClass(false)}
          {...register('images', { required: 'Upload at least one photo' })}
        />
        {errors.images && (
          <p className="text-xs font-semibold text-rose-500">{errors.images.message}</p>
        )}
      </div>

      <button
        type="submit"
        className={`w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:brightness-110 ${
          submitting ? 'cursor-not-allowed opacity-70' : ''
        }`}
        disabled={submitting}
        aria-busy={submitting}
      >
        Publish
      </button>
      {Object.keys(errors).length > 0 && (
        <p className="text-xs text-rose-500">
          Please resolve the highlighted errors to proceed.
        </p>
      )}
    </form>
  );
};

export default NewProduct;
