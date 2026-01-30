import React, { useEffect, useMemo, useState } from 'react';
import StatusTabs from '../../components/seller/StatusTabs';
import FiltersPanel from '../../components/seller/FiltersPanel';
import OrdersTable from '../../components/seller/OrdersTable';
import OrderDrawer from '../../components/seller/OrderDrawer';
import { fetchSellerOrders, updateOrderStatus } from '../../api/orders';
import useToastStore from '../../store/useToastStore';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

const PAYMENT_FILTERS = ['All', 'Paid', 'Unpaid'];

const statusLabels = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

const buildTimeline = (status) => {
  const steps = ['Order placed'];
  if (['paid', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    steps.push('Payment confirmed');
  }
  if (['shipped', 'delivered'].includes(status)) {
    steps.push('Shipped');
  }
  if (status === 'delivered') {
    steps.push('Delivered');
  }
  if (status === 'cancelled') {
    steps.push('Cancelled');
  }
  return steps;
};

const normalizeOrder = (order) => {
  const items = (order.items || []).map((item) => ({
    name: item.productId?.title || 'Item',
    qty: item.qty || 0,
    price: item.priceSnapshot || 0
  }));
  const dateText = new Date(order.createdAt).toLocaleDateString();
  return {
    ...order,
    id: order._id,
    customer: order.userId?.name || order.userId?.email || 'Guest shopper',
    customerEmail: order.userId?.email || '',
    customerPhone: order.userId?.phone || '',
    items,
    itemsCount: items.reduce((sum, item) => sum + item.qty, 0),
    total: order.totalAmount || 0,
    payment: order.payment?.provider || order.payment?.transactionId || 'Manual',
    paymentStatus: order.payment?.paymentStatus || 'pending',
    displayStatus: statusLabels[order.status] || order.status,
    timeline: buildTimeline(order.status),
    address: order.address || order.shippingAddress || '—',
    date: dateText
  };
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchSellerOrders({ limit: 50 })
      .then((data) => {
        if (!isMounted) return;
        setOrders((data.orders || []).map(normalizeOrder));
      })
      .catch((err) => {
        if (!isMounted) return;
        showToast(err?.response?.data?.message || 'Unable to load orders');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return orders
      .filter((order) => {
        if (activeStatus !== 'all' && order.status !== activeStatus) return false;
        if (paymentFilter !== 'All') {
          const isPaid = order.paymentStatus.toLowerCase() === 'paid';
          if (paymentFilter === 'Paid' && !isPaid) return false;
          if (paymentFilter === 'Unpaid' && isPaid) return false;
        }
        if (!normalizedSearch) return true;
        return (
          order.id.toLowerCase().includes(normalizedSearch) ||
          order.customer.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) =>
        sortOrder === 'Newest'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
  }, [orders, activeStatus, paymentFilter, searchTerm, sortOrder]);

  const visibleOrders = filteredOrders.slice(0, visibleCount);

  const handleStatusChange = async (orderId, value) => {
    try {
      const { order } = await updateOrderStatus(orderId, value);
      setOrders((prev) =>
        prev.map((current) => (current.id === order._id ? normalizeOrder(order) : current))
      );
      showToast('Order status updated');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Unable to update status');
    }
  };

  return (
    <div className="section-card space-y-6 rounded-[32px] p-6 shadow-2xl">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Order cockpit</p>
        <h1 className="text-3xl font-semibold text-slate-900">Manage every shipment</h1>
        <p className="text-sm text-slate-500">
          Filter by status, payment method, or customer to keep every order on track.
        </p>
      </header>

      <StatusTabs
        tabs={STATUS_TABS.map((tab) => tab.label)}
        activeTab={STATUS_TABS.find((tab) => tab.value === activeStatus)?.label || 'All'}
        onChange={(label) => {
          const match = STATUS_TABS.find((tab) => tab.label === label);
          setActiveStatus(match?.value || 'all');
        }}
      />

      <FiltersPanel
        searchTerm={searchTerm}
        paymentFilter={paymentFilter}
        sortOrder={sortOrder}
        onSearchChange={setSearchTerm}
        onPaymentChange={setPaymentFilter}
        onSortChange={setSortOrder}
      />

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-16 text-center text-sm text-slate-500">
          Loading your orders…
        </div>
      ) : (
        <>
          <OrdersTable
            orders={visibleOrders}
            statusOptions={STATUS_TABS.filter((tab) => tab.value !== 'all')}
            onStatusChange={handleStatusChange}
            onOpenDetails={setSelectedOrder}
          />

          {visibleOrders.length < filteredOrders.length && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:border-slate-400"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default Orders;
