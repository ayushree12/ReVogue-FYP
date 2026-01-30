import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPassword } from '../api/auth';
import useToastStore from '../store/useToastStore';
import AuthLayout from '../components/AuthLayout';

const schema = z.object({
  email: z.string().email()
});

const highlightList = [
  { label: 'Encrypted', detail: 'We never store passwords in plain text. Reset tokens expire quickly.' },
  { label: 'Role aware', detail: 'Admins, vendors, and shoppers receive role-specific recovery links.' }
];

const ForgotPassword = () => {
  const { showToast } = useToastStore();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await forgotPassword(values.email);
      showToast('Recovery link sent if email exists');
    } catch (err) {
      showToast('Unable to send recovery email');
    }
  };

  return (
    <AuthLayout
      title="Reset your access"
      description="Tell us your email and we'll send a secure link that works for any role."
      highlightList={highlightList}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg hover:bg-gray-800 transition"
        >
          Send reset link
        </button>

        <p className="text-center text-xs uppercase tracking-[0.3em] text-slate-400">
          Back to{' '}
          <Link to="/login" className="text-slate-900 hover:underline">
            login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
