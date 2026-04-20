import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
    <Navbar />
    <main className="flex-1 px-4 py-10 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <Outlet />
      </div>
    </main>
    <Footer />
  </div>
);

export default Layout;
