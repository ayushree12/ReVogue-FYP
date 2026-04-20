import React, { useEffect, useState } from 'react';
import { LineChart, TrendingUp, Activity } from 'lucide-react';
import { fetchSellerAnalytics } from '../../api/analytics';
import useToastStore from '../../store/useToastStore';

const SellerAnalytics = () => {
  const [data, setData] = useState(null);
  const { showToast } = useToastStore();

  useEffect(() => {
    let isMounted = true;
    fetchSellerAnalytics()
      .then((res) => {
        if (isMounted) {
          setData(res);
        }
      })
      .catch((err) => {
        if (isMounted) {
          showToast(err?.response?.data?.message || 'Unable to load analytics');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const metrics = data?.metrics || [];
  const trendPoints = data?.trendPoints || [];
  const alerts = data?.alerts || [];

  return (
    <div className="section-card space-y-6 rounded-[32px] p-6 shadow-2xl">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Analytics</p>
        <h1 className="text-3xl font-semibold text-slate-900">Data-driven decisions</h1>
        <p className="text-sm text-slate-500">
          Visualize how products move through the marketplace and where you should focus your next drop.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.length === 0
          ? [1, 2, 3].map((index) => (
              <div
                key={index}
                className="rounded-[32px] border border-slate-100 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-lg"
              >
                <div className="h-6 w-28 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-3 h-8 w-40 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-2 h-4 w-32 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))
          : metrics.map((metric) => (
              <article
                key={metric.label}
                className="flex flex-col gap-2 rounded-[32px] border border-slate-100 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-lg"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  <Activity className="h-4 w-4 text-indigo-500" />
                  {metric.label}
                </div>
                <p className="text-3xl font-semibold text-slate-900">{metric.value}</p>
                <p className="text-sm text-slate-500">{metric.helper}</p>
              </article>
            ))}
      </section>

      <section className="rounded-[32px] border border-slate-100 bg-slate-50/80 p-6 shadow-inner">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Trendline</p>
            <h2 className="text-2xl font-semibold text-slate-900">Momentum view</h2>
          </div>
          <button className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Export report
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Chart</span>
              <LineChart className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="mt-6 h-32 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-transparent" />
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            {trendPoints.length === 0
              ? ['Loading', 'Loading', 'Loading'].map((label, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
                    <div className="h-3 w-16 animate-pulse rounded-full bg-slate-200" />
                  </div>
                ))
              : trendPoints.map((point) => (
                  <div key={point.label} className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{point.label}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{point.value}</p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-lg">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          <TrendingUp className="h-4 w-4 text-indigo-500" />
          Alerts
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(alerts.length === 0 ? ['All good', 'All good', 'All good'] : alerts).map((alert, index) => (
            <div
              key={`${alert}-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600"
            >
              {alert}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SellerAnalytics;
