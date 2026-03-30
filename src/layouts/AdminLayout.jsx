import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans" dir="rtl">
      <Sidebar />
      {/* أضفنا pr-28 لكي نترك مساحة للـ Sidebar الثابت على اليمين */}
      <main className="pr-28 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;