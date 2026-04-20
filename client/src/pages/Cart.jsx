import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCart } from '../api/cart';
import useToastStore from '../store/useToastStore';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  useEffect(() => {
    let isMounted = true;
    const load = () => {
      fetchCart()
        .then((latest) => {
          if (!isMounted) return;
          setCart(latest);
        })
        .catch((err) => {
          setCart({ items: [] });
          showToast(err?.response?.data?.message || 'Unable to load cart', 'error');
        })
        .finally(() => {
          if (!isMounted) return;
          setLoading(false);
        });
    };
    const handleCartUpdated = () => {
      if (!isMounted) return;
      setLoading(true);
      load();
    };
    load();
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      isMounted = false;
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, [showToast]);

  const totalAmount = useMemo(() => {
    if (!cart?.items?.length) {
      return 0;
    }
    return cart.items.reduce(
      (sum, item) => sum + (item.productId?.price || 0) * (item.qty || 1),
      0
    );
  }, [cart]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow space-y-4">
        <p className="text-sm text-muted">Loading cart…</p>
      </div>
    );
  }

  const hasItems = Boolean(cart?.items?.length);

  return (
    <div className="bg-white rounded-3xl p-6 shadow space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your cart</h1>
        {hasItems && (
          <span className="text-sm font-semibold text-slate-500">
            Total: Rs {totalAmount.toLocaleString()}
          </span>
        )}
      </div>
      {hasItems ? (
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.productId?._id || item.productId} className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{item.productId?.title || 'Product'}</p>
                <p className="text-sm text-muted">Qty: {item.qty}</p>
              </div>
              <span className="font-semibold text-accent">
                Rs {(item.productId?.price || 0).toLocaleString()}
              </span>
            </div>
          ))}
          <Link
            to="/checkout"
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:brightness-110"
          >
            Proceed to checkout
          </Link>
        </div>
      ) : (
        <p className="text-muted">
          No items in your cart yet. Start <Link to="/products" className="font-semibold text-indigo-600">shopping</Link>.
        </p>
      )}
    </div>
  );
};

export default Cart;
