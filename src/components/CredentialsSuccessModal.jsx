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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2rem] p-8 text-center shadow-2xl relative animate-in zoom-in-95 duration-200" dir="rtl">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full shadow-sm">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">تم إنشاء الحساب بنجاح</h2>
        
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm mb-6 border border-yellow-200 flex items-start gap-2">
            <span className="text-lg">⚠️</span>
           <p className="leading-relaxed">يرجى نسخ بيانات الدخول وتسليمها للمستخدم، لن تظهر هذه البيانات مرة أخرى.</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4 shadow-inner">
          {userId && (
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
             <span className="text-gray-500 text-sm">معرف المستخدم:</span>
             <span className="font-mono font-bold text-gray-700 dir-ltr">{userId}</span>
            </div>
           )}

          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex flex-col items-start gap-1">
                <span className="text-xs text-gray-400">اسم المستخدم</span>
                <span className="font-bold text-[#1e3a8a] dir-ltr text-lg tracking-wide">{username}</span>
            </div>
            <button 
              onClick={() => handleCopy(username, 'اسم المستخدم')}
              className="text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              title="نسخ اسم المستخدم"
            >
              <Copy size={18} />
            </button>
          </div>

          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
             <div className="flex flex-col items-start gap-1">
                <span className="text-xs text-gray-400">كلمة المرور المؤقتة</span>
                <span className="font-bold text-[#1e3a8a] dir-ltr text-lg tracking-wide">{temporaryPassword}</span>
            </div>
            <button 
              onClick={() => handleCopy(temporaryPassword, 'كلمة المرور')}
              className="text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              title="نسخ كلمة المرور"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

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
