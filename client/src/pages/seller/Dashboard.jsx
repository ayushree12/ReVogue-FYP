import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Package, ShoppingBag, PlusCircle, FolderPlus, BarChart4 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useToastStore from '../../store/useToastStore';
import useAuthStore from '../../store/useAuthStore';
import { fetchSellerOrders } from '../../api/orders';
import { fetchSellerProducts } from '../../api/products';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return undefined;
    let isMounted = true;
    setLoading(true);

    Promise.all([fetchSellerOrders({ limit: 24 }), fetchSellerProducts({ limit: 40 })])
      .then(([ordersRes, productsRes]) => {
        if (!isMounted) return;
        setOrders(ordersRes.orders || []);
        setProducts(productsRes.products || []);
      })
      .catch((err) => {
        if (!isMounted) return;
        showToast(err?.response?.data?.message || 'Unable to load your dashboard');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user, showToast]);

  const todayStats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const today = new Date();
    const ordersToday = orders.filter((order) => {
      const created = new Date(order.createdAt);
      return (
        created.getFullYear() === today.getFullYear() &&
        created.getMonth() === today.getMonth() &&
        created.getDate() === today.getDate()
      );
    }).length;

    return [
      {
        label: 'Active listings',
        value: loading ? '—' : products.length,
        helper: 'Live products',
        icon: Package
      },
      {
        label: 'Orders today',
        value: loading ? '—' : ordersToday,
        helper: 'Fresh sales',
        icon: ShoppingBag
      },
      {
        label: 'Revenue',
        value: loading ? '—' : `Rs ${revenue.toLocaleString()}`,
        helper: 'Total haul (USD approx.)',
        icon: Activity
      }
    ];
  }, [loading, orders, products]);

  const latestOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }, [orders]);

  return (
    <div className="space-y-6">
      <section className="section-card space-y-4 px-6 py-7">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Seller cockpit</p>
        <h1 className="text-3xl font-bold text-slate-900">Manage products, orders, and chats</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Keep every sale transparent with a premium control surface that mirrors your shopper experience.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {todayStats.map((card) => (
          <article
            key={card.label}
            className="section-card flex flex-col gap-2 border border-slate-100 p-5 shadow-lg"
          >
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              <card.icon className="h-5 w-5 text-indigo-500" />
              {card.label}
            </div>
            <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm text-slate-500">{card.helper}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <article className="section-card border border-slate-100 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Latest orders</p>
              <h2 className="text-2xl font-semibold text-slate-900">Live preview</h2>
            </div>
            <div className="flex gap-2">
              {['Pending', 'Paid', 'Shipped'].map((status) => (
                <span
                  key={status}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  {status}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">
                Loading recent orders…
              </div>
            ) : latestOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">
                No orders yet—launch your first drop to see them appear here.
              </div>
            ) : (
              latestOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {order.userId?.name || order.userId?.email || 'Guest shopper'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {(order.items || []).reduce((sum, item) => sum + (item.qty || 0), 0)} items • Rs{' '}
                      {(order.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="section-card border border-slate-100 p-6 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Action center</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Operational controls</h2>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/seller/products/new')}
              className="flex items-center justify-between rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:brightness-110"
            >
              <span>Add New Product</span>
              <PlusCircle className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-sm transition hover:border-indigo-300"
            >
              <span>Product library</span>
              <FolderPlus className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/orders')}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-sm transition hover:border-indigo-300"
            >
              <span>View Order Tracker</span>
              <BarChart4 className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Need inspiration?</p>
            <p>Keep high-performing listings live, respond to chats, and confirm every order before it ships.</p>
          </div>
        </article>
      </section>
    </div>
  );
};

export default SellerDashboard;
