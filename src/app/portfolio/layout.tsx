'use client';

import React from 'react';
import Sidebar from './components/Sidebar';

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f9fd]">
      {/* 📱 Mobile/Tablet View Message */}
      <div className="flex md:hidden items-center justify-center h-screen text-center px-6">
        <p className="text-lg font-semibold text-gray-600">
          This page is only available on <span className="text-primary">Desktop view</span>.
        </p>
      </div>

      {/* 💻 Desktop View */}
      <div className="hidden md:flex">
        <Sidebar />
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
