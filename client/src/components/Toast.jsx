import React from 'react';
import useToastStore from '../store/useToastStore';

const Toast = () => {
  const { toasts } = useToastStore();
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl px-4 py-2 bg-white border border-slate-200 shadow-lg text-sm"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
