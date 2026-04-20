import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';
import { fetchBuyerConversations, fetchSellerConversations } from '../api/conversations';

const CONVERSATIONS_CACHE_KEY = 'revogue_conversations_cache';

const Messages = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const queryConversationId = useMemo(
    () => new URLSearchParams(location.search).get('conversationId'),
    [location.search]
  );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadCachedConversations = () => {
      const cached = localStorage.getItem(CONVERSATIONS_CACHE_KEY);
      const list = cached ? JSON.parse(cached) : [];
      if (!isMounted) return;
      setConversations(list);
      if (queryConversationId && list.some((conv) => conv.id === queryConversationId)) {
        setActiveId(queryConversationId);
      } else if (list.length) {
        setActiveId(list[0].id);
      } else {
        setActiveId(null);
      }
      setLoading(false);
    };

    if (!user) {
      loadCachedConversations();
      return () => {
        isMounted = false;
      };
    }

    const fetchConversations = user.role === 'seller' ? fetchSellerConversations : fetchBuyerConversations;

    fetchConversations()
      .then((res) => {
        if (!isMounted) return;
        const list = res.threads || [];
        setConversations(list);
        localStorage.setItem(CONVERSATIONS_CACHE_KEY, JSON.stringify(list));
        if (queryConversationId && list.some((conv) => conv.id === queryConversationId)) {
          setActiveId(queryConversationId);
        } else if (list.length) {
          setActiveId(list[0].id);
        } else {
          setActiveId(null);
        }
      })
      .catch(() => showToast('Unable to load conversations', 'error'))
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [queryConversationId, showToast, user]);

  const activeConversation = useMemo(
    () => conversations.find((conv) => conv.id === activeId) || null,
    [conversations, activeId]
  );

  const handleSelectConversation = (conversationId) => {
    setActiveId(conversationId);
    navigate(`/messages?conversationId=${conversationId}`, { replace: true });
  };

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="section-subtitle">Support</p>
        <h1 className="text-3xl font-semibold">Messages</h1>
        <p className="text-sm text-muted max-w-2xl">
          Chat with vendors, customers, or admins in one unified inbox. Each conversation is tagged by role.
        </p>
        {!user && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            You are logged out. Showing cached chat history only. To reply or load the latest chats, please <Link to="/login" className="font-semibold text-rose-700 underline">log in</Link> again.
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
        <section className="section-card p-6">
          <ChatPanel conversation={activeConversation} />
        </section>

        <section className="section-card space-y-3 p-6">
          <p className="section-subtitle">Active conversations</p>
          {loading && <p className="text-xs text-slate-400">Loading conversations…</p>}
          {!loading && !conversations.length && (
            <p className="text-sm text-muted">Start by messaging a vendor from a product page.</p>
          )}
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => handleSelectConversation(conversation.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  activeConversation?.id === conversation.id
                    ? 'border-indigo-300 bg-indigo-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span>{conversation.counterpartName}</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                    {conversation.counterpartRole}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{conversation.productTitle}</p>
                <p className="text-xs text-indigo-600">
                  {conversation.preview || 'Tap to continue the conversation'}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Messages;
