import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../api/auth';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';
import AuthLayout from '../components/AuthLayout';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const Login = () => {
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
      const { user, token } = await login(values);
      setAuth(user, token);
      showToast('Welcome back!');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthLayout
      title="Sign in to Revogue"
      description="Enter your email and password to open your dashboard—access is determined by the role stored in your profile."
      footerCallout={
        <p>
          Vendor not verified yet? Submit an application{' '}
          <Link to="/seller/verification" className="font-semibold text-white underline">
            here
          </Link>
          .
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            autoComplete="current-password"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-900 focus:outline-none"
            {...registerField('password')}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg hover:bg-gray-800 transition"
        >
          Continue
        </button>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link to="/forgot-password" className="font-semibold text-slate-900 hover:text-slate-700">
            Forgot password?
          </Link>
          <Link to="/register" className="font-semibold text-slate-900 hover:text-slate-700">
            Create account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
