import React, { useMemo, useState } from 'react';
import {
  BellAlertIcon,
  ShoppingCartIcon,
  ChatBubbleLeftEllipsisIcon,
  ChartBarIcon,
  PlusCircleIcon,
  FolderPlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import SellerSidebar from '../components/SellerSidebar';

const mockOrders = [];

const statusChips = ['Pending', 'Packed', 'Shipped', 'Delivered'];

const SellerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const stats = useMemo(
    () => [
      { label: 'Active Listings', value: '24', helper: 'Live products' },
      { label: 'Orders Today', value: '03', helper: 'Awaiting fulfillment' },
      { label: 'Revenue', value: 'Rs 48,200', helper: 'This week' }
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <SellerSidebar collapsed={false} active={activeSection} onChange={setActiveSection} />

      <main className="ml-72 flex min-h-screen flex-col gap-6 px-6 py-8">
        <header className="flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Seller Cockpit</p>
            <h1 className="text-3xl font-bold text-slate-900">Manage products, orders, and chats</h1>
          </div>
          <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold">Niraj | Revogue</div>
            <button className="rounded-2xl bg-white px-3 py-2 text-slate-500 shadow-sm transition hover:bg-slate-100">
              <BellAlertIcon className="h-5 w-5" />
            </button>
            <button className="rounded-2xl bg-white px-3 py-2 text-slate-500 shadow-sm transition hover:bg-slate-100">
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
            <button className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg">
              Live
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((card) => (
            <article key={card.label} className="rounded-[1.5rem] bg-white p-5 shadow-lg">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{card.label}</p>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500">{card.helper}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <article className="rounded-[1.5rem] bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-subtitle">Orders</p>
                <h2 className="text-2xl font-semibold text-slate-900">Latest orders</h2>
              </div>
              <div className="flex gap-2">
                {statusChips.map((status) => (
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
              {mockOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-slate-500">
                  <ArrowPathIcon className="mx-auto mb-3 h-6 w-6 animate-spin text-indigo-500" />
                  <p className="text-sm">
                    No orders yet—focus on launching your first listing. Once orders arrive, they will show up here with
                    fulfillment states.
                  </p>
                </div>
              ) : (
                mockOrders.map((order) => (
                  <article key={order.id} className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted">#{order.id}</p>
                        <p className="text-lg font-semibold">Rs {order.value}</p>
                      </div>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">Buyer: {order.customer}</p>
                  </article>
                ))
              )}
            </div>
          </article>

          <article className="rounded-[1.5rem] bg-white p-6 shadow-lg">
            <p className="section-subtitle">Action center</p>
            <h2 className="text-2xl font-semibold text-slate-900">Operational controls</h2>
            <div className="mt-6 flex flex-col gap-3">
                <button className="flex items-center justify-between rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg">
                  <span>Add New Product</span>
                  <PlusCircleIcon className="h-5 w-5" />
                </button>
                <button className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700">
                  <span>Add Category</span>
                  <FolderPlusIcon className="h-5 w-5" />
                </button>
                <button className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700">
                  <span>View Order Tracker</span>
                  <ChartBarIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Need help?</p>
              <p>Use the action center to publish new drops, categorize fresh arrivals, and keep order statuses transparent.</p>
            </div>
          </article>
        </section>

        <section className="rounded-[1.5rem] bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="section-subtitle">Chat overview</p>
            <button className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
              Go to chats <ChatBubbleLeftEllipsisIcon className="inline-block h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-500">Answer customer queries, coordinate pickups, and close deals in real time.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <p className="font-semibold text-slate-900">Conversation {index}</p>
                <p>Last message: Awaiting your reply.</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SellerDashboard;
