import React, { useEffect, useRef, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';
import { initSocket, getSocket } from '../services/socket';
import { fetchConversationMessages } from '../api/conversations';

const MESSAGE_CACHE_PREFIX = 'revogue_cached_messages_';

const ChatPanel = ({ conversation }) => {
  const { token, user } = useAuthStore();
  const { showToast } = useToastStore();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const socket = initSocket(token);
    return () => {
      socket?.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!conversation) {
      setMessages([]);
      return;
    }

    const cacheKey = `${MESSAGE_CACHE_PREFIX}${conversation.id}`;
    const loadCachedMessages = () => {
      const cached = localStorage.getItem(cacheKey);
      setMessages(cached ? JSON.parse(cached) : []);
      setLoadingHistory(false);
    };

    if (!token) {
      loadCachedMessages();
      return;
    }

    const socket = getSocket();
    if (!socket) {
      return;
    }

    let canceled = false;
    setLoadingHistory(true);

    fetchConversationMessages(conversation.id)
      .then((payload) => {
        if (canceled) return;
        const history = payload.messages || [];
        setMessages(history);
        localStorage.setItem(cacheKey, JSON.stringify(history));
      })
      .catch(() => {
        showToast('Unable to load conversation history', 'error');
      })
      .finally(() => {
        if (!canceled) {
          setLoadingHistory(false);
        }
      });

    socket.emit('conversation:join', { conversationId: conversation.id });

    const handleIncomingMessage = (message) => {
      if (message.conversationId?.toString() !== conversation.id) return;
      setMessages((prev) => {
        const updated = [...prev, message];
        localStorage.setItem(cacheKey, JSON.stringify(updated));
        return updated;
      });
    };

    socket.on('message:new', handleIncomingMessage);

    return () => {
      canceled = true;
      socket.off('message:new', handleIncomingMessage);
    };
  }, [conversation, token, showToast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (event) => {
    event?.preventDefault();
    if (!token) {
      showToast('Log in to reply to this conversation', 'error');
      return;
    }
    const text = messageText.trim();
    if (!text || !conversation) {
      return;
    }
    const socket = getSocket();
    if (!socket) {
      showToast('Unable to connect to chat service', 'error');
      return;
    }
    socket.emit('message:send', { conversationId: conversation.id, text });
    setMessageText('');
  };

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        <p className="text-lg font-semibold text-slate-900">Select a chat</p>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Start by opening a conversation
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 space-y-1 border-b border-slate-100 pb-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Conversation</p>
        <h3 className="text-lg font-semibold text-slate-900">
          {conversation.counterpartRole}: {conversation.counterpartName}
        </h3>
        <p className="text-xs text-slate-500">{conversation.productTitle}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-1 pb-2 text-sm text-slate-600">
        {loadingHistory && (
          <p className="text-xs text-slate-400">Loading messages…</p>
        )}
        {!loadingHistory && !messages.length && (
          <p className="text-sm text-slate-500">
            No messages yet. Use the box below to say hello.
          </p>
        )}
        {messages.map((message) => {
          const senderId =
            typeof message.senderId === 'object'
              ? message.senderId._id
              : message.senderId;
          const isOwnMessage = senderId === user?.id;
          const senderName = message.senderId?.name || (isOwnMessage ? 'You' : conversation.counterpartName);
          return (
            <div
              key={message._id || message.id}
              className={`rounded-2xl px-4 py-3 shadow-sm ${
                isOwnMessage ? 'bg-indigo-50' : 'bg-slate-50'
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{senderName}</p>
              <p className="text-sm text-slate-900">{message.text}</p>
              <p className="text-[10px] text-slate-400">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="mt-4 flex gap-3" onSubmit={handleSendMessage}>
        <input
          className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-slate-400 focus:outline-none"
          placeholder={token ? 'Type a message…' : 'Log in to reply to this chat'}
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          disabled={!token}
        />
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={!token || !messageText.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
