import React from 'react';
import { Scale } from 'lucide-react';

const CourtsHeader = () => {
  return (
    // ✅ شيلنا overflow-hidden وغيرنا الظل لـ shadow-lg (أخف وأشيك) وضفنا z-10
    <div className="relative z-10 w-full bg-[#1e3a8a] rounded-[2rem] p-6 md:p-10 text-white flex items-center justify-between shadow-lg mb-8 mt-6">
      
      {/* الزخارف الخلفية تبقى محصورة داخل الهيدر فقط */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="flex items-center gap-6 relative z-10">
        <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10 shadow-inner">
          <Scale className="w-10 h-10 text-blue-100" />
        </div>
        <div>
          <h1 className="text-2xl md:text-4xl font-black mb-2 tracking-tight">إدارة محاكم الأسرة</h1>
          <p className="text-blue-200 text-sm md:text-base font-bold opacity-90">التحكم في سجل المحاكم وحسابات مديريها</p>
        </div>
      </div>
    </div>
  );
};

export default CourtsHeader;