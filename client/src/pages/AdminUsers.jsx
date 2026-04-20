import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data.users || []);
      } catch (err) {
        setUsers([]);
      }
    };
    load();
  }, []);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="section-subtitle">User management</p>
        <h1 className="text-3xl font-semibold">All registered members</h1>
        <p className="text-sm text-muted max-w-2xl">
          Filter by role or search to take actions such as blocking or reinstating community members.
        </p>
      </header>

      <div className="section-card space-y-4">
        {users.length ? (
          users.map((user) => (
            <div
              key={user._id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{user.role}</span>
                <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  View profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted px-4 py-6 text-center">No users to show yet.</p>
        )}
      </div>
    </section>
  );
};

export default AdminUsers;
