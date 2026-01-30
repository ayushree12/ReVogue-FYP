import React, { useEffect, useState } from 'react';
import { MessageSquare, Circle, Users, Search } from 'lucide-react';
import { fetchSellerConversations } from '../../api/conversations';
import useToastStore from '../../store/useToastStore';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  Respond: 'bg-slate-100 text-slate-900',
  Resolved: 'bg-emerald-50 text-emerald-600'
};

const SellerChats = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetchSellerConversations()
      .then((data) => {
        if (isMounted) {
          setThreads(data.threads || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          showToast(err?.response?.data?.message || 'Unable to load conversations');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  return (
    <div className="section-card space-y-6 rounded-[32px] p-6 shadow-2xl">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Chats</p>
          <h1 className="text-3xl font-semibold text-slate-900">Customer conversation hub</h1>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg"
        >
          <MessageSquare className="h-4 w-4" />
          Start new chat
        </button>
      </header>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
          <Search className="h-4 w-4" />
          Search threads
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
          Sort by newest
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
          Filters: Open
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
            Loading conversations…
          </div>
        ) : threads.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
            No conversations have started yet.
          </div>
        ) : (
          threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => navigate(`/messages?conversationId=${thread.id}`)}
              className="flex flex-col gap-3 rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-slate-300 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  <Circle className="h-3 w-3 text-slate-900" />
                  {thread.orderRef}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                    statusColors[thread.status] || 'bg-slate-50 text-slate-500'
                  }`}
                >
                  {thread.status}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-slate-900">{thread.customer}</p>
                  <p className="text-sm text-slate-500">{thread.preview || 'Awaiting customer reply…'}</p>
                </div>
                <div className="flex flex-col items-end gap-1 text-right text-xs text-slate-500">
                  <p>Last seen</p>
                  <p className="text-slate-900">
                    {thread.time ? new Date(thread.time).toLocaleTimeString() : 'n/a'}
                  </p>
                  {thread.unreadCount > 0 && (
                    <span className="rounded-full bg-black px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white">
                      {thread.unreadCount} new
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <Users className="h-4 w-4" />
                Tap to open conversation
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerChats;
