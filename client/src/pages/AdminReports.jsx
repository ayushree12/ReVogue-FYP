import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import useToastStore from '../store/useToastStore';

const periods = [
  { label: 'Daily', value: 'daily' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
];

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [downloading, setDownloading] = useState(null);
  const { showToast } = useToastStore();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/reports');
        setReports(res.data.reports || []);
      } catch (err) {
        setReports([]);
      }
    };
    load();
  }, []);

  const downloadReport = async (period) => {
    setDownloading(period);
    try {
      const response = await api.get('/admin/reports/sales', {
        params: { period },
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `sales-${period}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
      showToast(`${period.charAt(0).toUpperCase() + period.slice(1)} report downloaded`, 'success');
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Unable to download the report right now';
      showToast(message, 'error');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="section-subtitle">Safety & compliance</p>
        <h1 className="text-3xl font-semibold">Flags, disputes & exports</h1>
      </header>

      <div className="section-card space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-500">Sales reports</p>
          <p className="text-sm text-muted">
            Download vendor-aware daily, monthly, or yearly Csv exports for Excel. Each row
            includes the vendor name, period, order count, and total sales.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {periods.map((period) => (
            <button
              key={period.value}
              type="button"
              onClick={() => downloadReport(period.value)}
              disabled={downloading === period.value}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-700 transition hover:border-black hover:text-black disabled:opacity-60"
            >
              {downloading === period.value ? 'Preparing…' : `Download ${period.label}`}
            </button>
          ))}
        </div>
      </div>

      <div className="section-card space-y-4 p-6">
        {reports.length ? (
          reports.map((report) => (
            <div
              key={report._id}
              className="rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">{report.title}</p>
                <span className="text-xs uppercase tracking-[0.3em] text-rose-500">
                  {report.status || 'Pending'}
                </span>
              </div>
              <p className="text-sm text-muted">{report.notes || 'No notes yet.'}</p>
            </div>
          ))
        ) : (
          <p className="text-muted px-4 py-6 text-center">No reports right now.</p>
        )}
      </div>
    </section>
  );
};

export default AdminReports;
