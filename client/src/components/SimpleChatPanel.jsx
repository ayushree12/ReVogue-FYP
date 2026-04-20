import React from 'react';

const SimpleChatPanel = ({ conversation }) => {
  if (!conversation) {
    return (
      <div className= flex h-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500>
        <p className=text-lg font-semibold text-slate-900>Select a chat</p>
        <p className=text-xs uppercase tracking-[0.3em] text-slate-500>Start by opening a conversation</p>
      </div>
    );
  }

  return (
    <div className=flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5>
      <div className=mb-4 space-y-1 border-b border-slate-100 pb-3>
        <p className=text-xs uppercase tracking-[0.3em] text-slate-500>Conversation</p>
        <h3 className=text-lg font-semibold text-slate-900>
          {conversation.counterpartRole}: {conversation.counterpartName}
        </h3>
        <p className=text-xs text-slate-500>{conversation.productTitle}</p>
      </div>
      <div className=flex-1 overflow-y-auto space-y-3 text-sm text-slate-600>
        <p className=text-xs uppercase tracking-[0.3em] text-slate-400>Latest activity</p>
        <p className=text-base font-semibold text-slate-900>
          {conversation.preview || 'Tap conversation to read the messages.'}
        </p>
        <p className=text-xs text-slate-400>Updated {new Date(conversation.updatedAt).toLocaleString()}</p>
      </div>
      <div className=mt-4 flex gap-2>
        <input
          placeholder=Tap to chat…
          className=flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-500 focus:border-slate-400 focus:outline-none
          readOnly
        />
        <button className=rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white type=button disabled>
          Send
        </button>
      </div>
    </div>
  );
};

export default SimpleChatPanel;
