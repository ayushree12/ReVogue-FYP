import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerUser } from '../api/auth';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';
import AuthLayout from '../components/AuthLayout';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const highlightList = [
  { label: 'Shoppers', detail: 'Create wishlists, track orders, and message vendors directly.' },
  { label: 'Vendors', detail: 'Apply for approval, publish products, and monitor order health.' },
  { label: 'Admins', detail: 'Approve vendor registrations and keep the marketplace safe.' }
];

const Register = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToastStore();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const { user, token } = await registerUser(values);
      setAuth(user, token);
      showToast('Welcome to Revogue');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title="Create account"
      description="Pick a role, share your story, and join the marketplace that honors transparency."
      highlightList={highlightList}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Full name</label>
          <input
            type="text"
            autoComplete="name"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
            {...registerField('name')}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
            {...registerField('email')}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Password</label>
          <input
            type="password"
            autoComplete="new-password"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
            {...registerField('password')}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg hover:bg-gray-800 transition"
        >
          Get started
        </button>

        <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Are you a vendor?</p>
          <p>
            Vendor registrations are reviewed by admins. Submit your application and we will notify you once approved.
          </p>
          <Link to="/seller/verification" className="font-semibold text-slate-900 hover:underline">
            Begin vendor registration
          </Link>
        </div>

        <p className="text-center text-xs uppercase tracking-[0.3em] text-slate-400">
          Have an account?{' '}
          <Link to="/login" className="text-slate-900 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
