import React from 'react';
import { LayoutDashboard, Scale, MapPin } from 'lucide-react'; // تم حذف أيقونة School

const DashboardPage = () => {
  return (
    <div className="animate-in fade-in duration-300 w-full" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* --- الهيدر الترحيبي --- */}
        <div className="relative w-full bg-[#1e3a8a] rounded-[2rem] p-8 text-white flex flex-col items-start overflow-hidden shadow-xl mb-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">مرحباً بك في الإدارة العليا</h1>
          </div>
          <p className="text-blue-100 mt-2 text-lg relative z-10 opacity-90">
            من هنا يمكنك إدارة المحافظات، المحاكم، ومراكز الرؤية الخاصة بنظام وصال.
          </p>
        </div>

        {/* --- كروت إحصائيات أو وصول سريع --- */}
        {/* تم تعديل الشبكة لتكون كارتين فقط بدلاً من 3 ليتناسق الشكل */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard icon={Scale} title="محاكم الأسرة" desc="إدارة بيانات المحاكم والدوائر" color="bg-blue-50" textColor="text-blue-700" />
          <DashboardCard icon={MapPin} title="مراكز الرؤية" desc="تتبع وإدارة مراكز الرؤية" color="bg-green-50" textColor="text-green-700" />
        </div>

      </div>
    </div>
  );
};

// مكون مساعد للكروت
const DashboardCard = ({ icon: Icon, title, desc, color, textColor }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-start gap-4 group cursor-pointer">
    <div className={`p-4 rounded-2xl ${color} ${textColor} group-hover:scale-110 transition-transform`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default DashboardPage;