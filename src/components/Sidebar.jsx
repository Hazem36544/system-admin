import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// تم تحديث الاستيرادات: حذفنا الأيقونات غير المستخدمة وأضفنا أيقونة User للحساب
import { LayoutDashboard, Scale, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  // دالة تحديد ستايل الرابط النشط وغير النشط
  const getLinkClass = (path) => {
    // استخدمنا التوافق التام للرئيسية، والتوافق الجزئي لباقي الصفحات الفرعية
    const isActive = location.pathname === path || (path !== '/admin-dashboard' && location.pathname.startsWith(path));
    return `w-full py-3 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-300 group ${
      isActive
        ? 'bg-white text-[#1e3a8a] shadow-lg scale-105'
        : 'text-blue-200 hover:bg-white/10 hover:text-white'
    }`;
  };

  // روابط الإدارة العليا (تم التعديل هنا)
  const navItems = [
    { name: 'القيادة', icon: LayoutDashboard, path: '/admin-dashboard' },
    { name: 'محاكم الأسرة', icon: Scale, path: '/admin-dashboard/courts' },
    // تم حذف مراكز الرؤية والمدارس
    // تم استبدال العنصر الأخير بالحساب وأيقونة البروفايل
    // ملحوظة: تأكد من أن مسار '/admin-dashboard/account' موجود في إعدادات الـ Router لديك
    { name: 'الحساب', icon: User, path: '/admin-dashboard/account' },
  ];

  return (
    <div
      className="fixed top-0 right-0 h-screen w-28 bg-[#1e3a8a] flex flex-col items-center py-6 z-50 rounded-l-[2rem] shadow-2xl font-sans border-l border-white/5 transition-all duration-300"
      dir="rtl"
    >

      {/* --- 1. الشعار --- */}
      <div className="mb-8 flex-shrink-0 w-full flex justify-center">
        <img
          src="/logo.svg"
          alt="شعار وصال"
          className="w-20 h-20 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-xl"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Admin'; }}
        />
      </div>

      {/* --- 2. روابط التنقل --- */}
      <nav className="flex flex-col items-center gap-3 w-full px-2 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
            <item.icon className="w-6 h-6 mb-0.5 transition-colors duration-300" />
            <span className="text-[10px] font-bold tracking-wide text-center leading-tight px-1">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* --- 3. زر تسجيل الخروج --- */}
      <div className="mt-auto pt-4 w-full px-2 pb-2">
        <button
          onClick={logout}
          className="w-full py-3 flex flex-col items-center justify-center gap-1 rounded-2xl text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-all duration-300 border border-transparent hover:border-red-500/20 outline-none"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-bold">خروج</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;