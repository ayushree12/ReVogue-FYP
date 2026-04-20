import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '../api/auth';
import useToastStore from '../store/useToastStore';
import AuthLayout from '../components/AuthLayout';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const highlightList = [
  { label: 'Secure tokens', detail: 'The reset link expires in 15 minutes for every role.' },
  { label: 'Zero friction', detail: 'Admins, sellers, and customers share the same experience.' }
];

const ResetPassword = () => {
  const { showToast } = useToastStore();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await resetPassword(values);
      showToast('Password updated');
    } catch (err) {
      showToast('Unable to reset');
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      description="Confirm your email, set a new password, and return to your personalized dashboard."
      highlightList={highlightList}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">New password</label>
          <input
            type="password"
            autoComplete="new-password"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none"
            {...register('password')}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg hover:bg-indigo-700 transition"
        >
          Reset password
        </button>

        <p className="text-center text-xs uppercase tracking-[0.3em] text-slate-400">
          Back to{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
