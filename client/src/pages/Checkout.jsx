import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchCart } from '../api/cart';
import { createOrder } from '../api/orders';
import { initiateKhalti, verifyKhalti } from '../api/payment';
import useToastStore from '../store/useToastStore';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [khaltiMessage, setKhaltiMessage] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    district: '',
    postalCode: '',
    country: 'Nepal'
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToastStore();
  const isMounted = useRef(true);

  const totalAmount = useMemo(() => {
    if (!cart?.items?.length) {
      return 0;
    }
    return cart.items.reduce(
      (sum, item) => sum + (item.productId?.price || 0) * (item.qty || 1),
      0
    );
  }, [cart]);

  const khaltiAmount = Math.max(0, Math.round(totalAmount * 100));
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const khaltiPidx = searchParams.get('pidx');
  const handledPidx = useRef(null);

  const safeSetProcessing = useCallback((value) => {
    if (isMounted.current) {
      setProcessing(value);
    }
  }, []);

  const safeSetMessage = useCallback((message) => {
    if (isMounted.current) {
      setKhaltiMessage(message);
    }
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    fetchCart()
      .then((latestCart) => {
        if (!isActive) return;
        setCart(latestCart);
      })
      .catch((err) => {
        if (!isActive) return;
        showToast(err?.response?.data?.message || 'Unable to load cart', 'error');
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [showToast]);

  const dispatchCartUpdate = () => {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleOrderSuccess = useCallback(
    (toastMessage = 'Order placed') => {
      if (isMounted.current) {
        setCart({ items: [] });
        setShippingAddress({
          street: '',
          city: '',
          district: '',
          postalCode: '',
          country: 'Nepal'
        });
      }
      dispatchCartUpdate();
      showToast(toastMessage, 'success');
      navigate('/orders');
    },
    [navigate, showToast]
  );

  useEffect(() => {
    if (!khaltiPidx || handledPidx.current === khaltiPidx) return;
    handledPidx.current = khaltiPidx;
    safeSetMessage('Verifying Khalti payment…');
    (async () => {
      safeSetProcessing(true);
      try {
        const verifyResponse = await verifyKhalti(khaltiPidx);
        if (!verifyResponse?.success) {
          showToast('Khalti payment was not completed', 'error');
          safeSetMessage('Khalti payment failed');
          navigate('/checkout', { replace: true });
          return;
        }
        const transactionId =
          verifyResponse.data?.idx || verifyResponse.data?.pidx || `khalti-${Date.now()}`;
        await createOrder(
          buildOrderPayload({
            payment: {
              provider: 'khalti',
              transactionId,
              paymentStatus: 'paid',
              verified: true
            }
          })
        );
        safeSetMessage('Payment verified. Redirecting to your orders…');
        handleOrderSuccess('Khalti payment confirmed');
      } catch (error) {
        showToast(error?.response?.data?.message || 'Unable to verify Khalti payment', 'error');
        safeSetMessage('Verification failed. Please try again.');
        navigate('/checkout', { replace: true });
      } finally {
        safeSetProcessing(false);
      }
    })();
  }, [khaltiPidx, navigate, safeSetMessage, safeSetProcessing, showToast, handleOrderSuccess, createOrder]);

  const shippingValid = useMemo(() => {
    return (
      shippingAddress.street.trim() &&
      shippingAddress.city.trim() &&
      shippingAddress.district.trim() &&
      shippingAddress.postalCode.trim()
    );
  }, [shippingAddress]);

  const buildOrderPayload = (payment) => ({
    payment,
    shippingAddress
  });

  const placeCodOrder = async () => {
    if (!cart?.items?.length) {
      showToast('Add items to your cart before checkout', 'error');
      return;
    }
    if (!shippingValid) {
      showToast('Fill in your shipping address before placing the order', 'error');
      return;
    }
    safeSetProcessing(true);
    try {
      await createOrder(
        buildOrderPayload({
        payment: {
          provider: 'cod',
          paymentStatus: 'pending'
        }
      })
    );
      handleOrderSuccess();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Unable to place COD order', 'error');
    } finally {
      safeSetProcessing(false);
    }
  };

  const startKhaltiCheckout = async () => {
    if (!cart?.items?.length) {
      showToast('Add items to your cart before checkout', 'error');
      return;
    }
    if (!khaltiAmount) {
      showToast('Your cart is empty', 'error');
      return;
    }
    if (!shippingValid) {
      showToast('Fill in your shipping address before starting Khalti', 'error');
      return;
    }
    safeSetProcessing(true);
    try {
        const payload = {
          amount: khaltiAmount,
          productId: cart.items[0]?.productId?._id || `order-${Date.now()}`,
          productName: cart.items[0]?.productId?.title || 'Revogue order',
          returnUrl: `${window.location.origin}/checkout`,
          websiteUrl: window.location.origin
        };
      const response = await initiateKhalti(payload);
      if (!response?.paymentUrl) {
        throw new Error('Khalti did not return a payment URL');
      }
      window.location.href = response.paymentUrl;
    } catch (err) {
      showToast(err?.response?.data?.message || 'Unable to initiate Khalti payment', 'error');
    } finally {
      safeSetProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
        <p className="text-sm text-muted">Loading checkout…</p>
      </div>
    );
  }

  const hasItems = Boolean(cart?.items?.length);

  return (
    <section className="space-y-6">
      {khaltiMessage && (
        <div className="rounded-[32px] border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
          {khaltiMessage}
        </div>
      )}
      <div className="space-y-3 rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Checkout</p>
          <h1 className="text-3xl font-semibold text-slate-900">Review & payment</h1>
        </div>
        {hasItems ? (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId?._id || item.productId}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{item.productId?.title || 'Product'}</p>
                  <p className="text-xs text-muted">
                    Qty: {item.qty} × Rs {item.productId?.price?.toLocaleString()}
                  </p>
                </div>
                <span className="font-semibold text-accent">
                  Rs {(item.qty * (item.productId?.price || 0)).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
              <span>Subtotal</span>
              <span>Rs {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <p className="text-muted">
            Your cart is empty. <Link to="/products" className="font-semibold text-indigo-600">Browse products</Link>
          </p>
        )}
      </div>

      <div className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Shipping address</p>
          <h2 className="text-2xl font-semibold text-slate-900">Delivery details</h2>
          <p className="text-sm text-muted">
            Tell us where to deliver so the rider can reach you without calling.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">
            Street / landmark
            <input
              value={shippingAddress.street}
              onChange={(event) =>
                setShippingAddress((prev) => ({ ...prev, street: event.target.value }))
              }
              placeholder="House / flat number, street, landmark"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-600">
              City
              <input
                value={shippingAddress.city}
                onChange={(event) =>
                  setShippingAddress((prev) => ({ ...prev, city: event.target.value }))
                }
                placeholder="City"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-slate-600">
              District
              <input
                value={shippingAddress.district}
                onChange={(event) =>
                  setShippingAddress((prev) => ({ ...prev, district: event.target.value }))
                }
                placeholder="District"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-600">
              Postal code
              <input
                value={shippingAddress.postalCode}
                onChange={(event) =>
                  setShippingAddress((prev) => ({ ...prev, postalCode: event.target.value }))
                }
                placeholder="Postal / area code"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-slate-600">
              Country
              <input
                value={shippingAddress.country}
                onChange={(event) =>
                  setShippingAddress((prev) => ({ ...prev, country: event.target.value }))
                }
                placeholder="Country"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Payment</p>
            <h2 className="text-2xl font-semibold text-slate-900">Choose a method</h2>
          </div>
          <span className="text-xs uppercase text-slate-400">Total Rs {totalAmount.toLocaleString()}</span>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
            />
            <div>
              <p className="font-semibold">Cash on delivery</p>
              <p className="text-xs text-muted">Pay in cash when the rider delivers your order.</p>
            </div>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input
              type="radio"
              value="khalti"
              checked={paymentMethod === 'khalti'}
              onChange={() => setPaymentMethod('khalti')}
            />
            <div>
              <p className="font-semibold">Khalti (online)</p>
              <p className="text-xs text-muted">
                Pay via Khalti sandbox. You will be redirected to Khalti to finish payment.
              </p>
            </div>
          </label>
        </div>

        <div className="space-y-3">
          {paymentMethod === 'cod' && (
            <button
              type="button"
              onClick={placeCodOrder}
              disabled={processing || !hasItems}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? 'Placing order…' : 'Place order (Cash on delivery)'}
            </button>
          )}
          {paymentMethod === 'khalti' && (
            <button
              type="button"
              onClick={startKhaltiCheckout}
              disabled={processing || !hasItems}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? 'Redirecting to Khalti…' : 'Pay with Khalti (sandbox)'}
            </button>
          )}
        </div>

        <p className="text-xs text-muted">
          After placing an order we will send a confirmation message and email. Pay safely or choose COD.
        </p>
      </div>
    </section>
  );
};

export default Checkout;
