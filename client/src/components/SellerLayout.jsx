import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import SellerSidebar from './SellerSidebar';

const SellerLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <div className="flex w-full min-h-[calc(100vh-76px)] gap-6 px-4 py-8 lg:px-0">
      <SellerSidebar />
      <main className="flex-1 rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-2xl">
        <div className="flex h-full w-full flex-col gap-6">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);

export default SellerLayout;
