import React from 'react';
import { Copy, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CredentialsSuccessModal = ({ isOpen, onClose, credentials }) => {
  if (!isOpen || !credentials) return null;

  const { username, temporaryPassword, userId } = credentials;

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label} بنجاح`);
  };

  return (
    // ✅ z-[100] لضمان تغطية الـ Sidebar وكل عناصر الشاشة
    // ✅ الأنيميشن الأساسي: fade-in خفيف
    <div className="fixed inset-0 bg-slate-900/40 z-[100] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* ✅ الحجم والمقاسات القديمة (max-w-md و p-8) مع أنيميشن zoom خفيف جداً */}
      <div className="bg-white w-full max-w-md rounded-[2rem] p-8 text-center shadow-2xl relative animate-in zoom-in-95 duration-200" dir="rtl">
        
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-6">
          {/* ✅ أيقونة نجاح بلون Emerald فخم */}
          <div className="bg-emerald-50 p-4 rounded-full shadow-sm border border-emerald-100">
            <CheckCircle size={48} className="text-emerald-600" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">تم إنشاء الحساب بنجاح</h2>
        
        {/* ✅ رسالة تنبيه بلون Amber ناعم وشيك */}
        <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm mb-6 border border-amber-200/60 flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <p className="leading-relaxed">يرجى نسخ بيانات الدخول وتسليمها للمستخدم، لن تظهر هذه البيانات مرة أخرى.</p>
        </div>

        {/* ✅ حاوية البيانات بلون Slate فاتح */}
        <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100 space-y-4 shadow-inner">
          {userId && (
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
             <span className="text-slate-500 text-sm font-bold">معرف المستخدم:</span>
             <span className="font-mono font-bold text-slate-700 dir-ltr">{userId}</span>
            </div>
           )}

          {/* كارت اسم المستخدم */}
          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col items-start gap-1">
                <span className="text-xs font-bold text-slate-400">اسم المستخدم</span>
                <span className="font-bold text-[#1e3a8a] dir-ltr text-lg tracking-wide">{username}</span>
            </div>
            <button 
              onClick={() => handleCopy(username, 'اسم المستخدم')}
              className="text-slate-400 hover:text-[#1e3a8a] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              title="نسخ اسم المستخدم"
            >
              <Copy size={18} />
            </button>
          </div>

          {/* كارت كلمة المرور */}
          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm transition-all hover:shadow-md">
             <div className="flex flex-col items-start gap-1">
                <span className="text-xs font-bold text-slate-400">كلمة المرور المؤقتة</span>
                <span className="font-bold text-[#1e3a8a] dir-ltr text-lg tracking-wide">{temporaryPassword}</span>
            </div>
            <button 
              onClick={() => handleCopy(temporaryPassword, 'كلمة المرور')}
              className="text-slate-400 hover:text-[#1e3a8a] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              title="نسخ كلمة المرور"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="w-full bg-[#1e3a8a] text-white py-3.5 rounded-xl mt-8 hover:bg-blue-900 transition-colors font-bold shadow-lg shadow-blue-900/10 active:scale-[0.98]"
        >
          إغلاق وتم التسليم
        </button>
      </div>
    </div>
  );
};

export default CredentialsSuccessModal;