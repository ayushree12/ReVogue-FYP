import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addCartItem } from '../api/cart';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';

const ProductCard = ({ product }) => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const availability = product.status || 'available';
  const imageUrl =
    product.images?.[0]?.url ||
    product.image ||
    'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=640&q=80';

  return (
    <article className="bg-white shadow-sm rounded-3xl overflow-hidden border border-slate-100">
      <Link to={`/product/${product._id}`} className="block h-[260px] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center text-xs uppercase tracking-wide text-muted">
          <span>{product.condition || 'Condition: good'}</span>
          <span className="rounded-full border px-2 py-1">{product.size || 'One Size'}</span>
        </div>
        <Link to={`/product/${product._id}`} className="block font-semibold text-lg text-primary">
          {product.title}
        </Link>
        <p className="text-sm text-muted line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-accent">Rs {product.price?.toLocaleString()}</span>
          <button
            type="button"
            onClick={async () => {
              if (!user) {
                showToast('Please sign in to add items to your cart', 'error');
                navigate('/login');
                return;
              }
              if (availability !== 'available') {
                showToast('This item is currently unavailable', 'error');
                return;
              }
              setAdding(true);
              try {
                await addCartItem(product._id);
                showToast('Added to cart', 'success');
              } catch (err) {
                const message = err?.response?.data?.message || 'Unable to add to cart';
                showToast(message, 'error');
              } finally {
                setAdding(false);
              }
            }}
            className={`text-xs uppercase border rounded-full px-3 py-1 transition ${
              adding
                ? 'cursor-not-allowed border-slate-200/70 text-slate-400'
                : 'border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
            disabled={adding}
          >
            {adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
