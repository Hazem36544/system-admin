import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, ShieldCheck, LogOut, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';

const AdminAccount = () => {
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPageLoaded(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div 
            className={`p-4 md:p-8 w-full font-sans transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} 
            dir="rtl"
        >
            <div className="max-w-7xl mx-auto w-full">
                
                {/* --- بداية الهيدر --- */}
                <header className="relative w-full bg-[#1e3a8a] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl overflow-hidden flex items-center mb-8">
                    
                    {/* زخارف الخلفية */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute right-[-10%] top-[-50%] w-[400px] h-[400px] bg-white rounded-full blur-3xl"></div>
                        <div className="absolute left-[-10%] bottom-[-50%] w-[300px] h-[300px] bg-blue-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-5 relative z-10 w-full">
                        <div className="bg-white/10 p-3 md:p-4 rounded-2xl border border-white/20 backdrop-blur-sm shadow-inner shrink-0">
                            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-blue-100" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-3xl font-black mb-1 md:mb-2 tracking-tight">حساب المسؤول</h1>
                            <p className="text-blue-200 text-xs md:text-sm font-bold flex items-center gap-1.5 opacity-90">
                                <ShieldCheck size={14} className="shrink-0" />
                                إدارة بيانات مدير النظام وإعدادات الوصول
                            </p>
                        </div>
                    </div>
                </header>
                {/* --- نهاية الهيدر --- */}

                {/* المحتوى الداخلي للصفحة */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    
                    {/* Right Column (Profile Card) */}
                    <div className="lg:col-span-4 space-y-6 h-full">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden h-full">
                            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#1e3a8a]/5 to-transparent skew-y-3 transform -translate-y-12"></div>
                            
                            <div className="relative mb-6 mt-4">
                                <div className="w-32 h-32 rounded-full bg-[#F3F4F6] border-4 border-white shadow-xl flex items-center justify-center text-white relative z-10 group overflow-hidden">
                                    <div className="w-full h-full bg-[#1e3a8a] rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                        <ShieldCheck size={64} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white z-20"></div>
                            </div>

                            <h2 className="text-2xl font-extrabold text-[#1e3a8a] mb-2">مدير النظام العام</h2>
                            <p className="text-[#1e3a8a] font-medium mb-4 bg-blue-50 px-4 py-1 rounded-full text-sm">Super Admin</p>

                            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium mb-8 bg-gray-50 px-4 py-3 rounded-xl w-full">
                                <Lock size={16} className="shrink-0 text-amber-500" />
                                <span>صلاحيات مطلقة لإدارة النظام</span>
                            </div>

                            <div className="mt-auto w-full pt-6 border-t border-gray-100">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full py-4 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-bold flex items-center justify-center gap-2 group outline-none border-none cursor-pointer"
                                >
                                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                                    <span>تسجيل الخروج</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Left Column (Personal Info) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-8 relative h-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <h3 className="text-xl font-bold text-gray-800 border-r-4 border-[#1e3a8a] pr-3">المعلومات الأساسية</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <InfoRow icon={User} label="اسم المستخدم" value="admin_root" isMono />
                                <InfoRow icon={Lock} label="مستوى الصلاحية" value="مدير نظام (Super Admin)" />
                                <InfoRow icon={Mail} label="البريد الإلكتروني الرسمي" value="admin@wesal.gov.eg" isMono />
                                <InfoRow icon={Phone} label="هاتف التواصل" value="0100 000 0000" isMono isLtr />
                            </div>
                        </div>
                    </div>

                </div>

                {/* ✅ إضافة Security Banner هنا أسفل الـ Grid ليعطي توازن ممتاز */}
                <SecurityBanner />

            </div>
        </div>
    );
};

// ==========================================
// Component الصفوف للمعلومات
// ==========================================
const InfoRow = ({ icon: Icon, label, value, isMono, isLtr }) => (
    <div className="bg-[#F8F9FA] p-4 rounded-2xl flex items-center justify-between group hover:border-blue-100 border border-transparent transition-all overflow-hidden">
        <div className="flex items-center gap-4 w-full">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-[#1e3a8a] rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#1e3a8a] group-hover:text-white">
                <Icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-400 font-bold mb-1">{label}</p>
                <p className={`text-base md:text-lg font-bold text-gray-800 tracking-wider truncate max-w-[200px] md:max-w-full ${isMono ? 'font-mono' : ''}`} dir={isLtr ? 'ltr' : 'rtl'}>
                    {value}
                </p>
            </div>
        </div>
    </div>
);

// ==========================================
// Component رسالة الأمان
// ==========================================
const SecurityBanner = () => {
    return (
        <div className="mt-8 bg-blue-50 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 border border-blue-100/50 text-center md:text-right">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1e3a8a] shadow-sm shrink-0">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h4 className="font-bold text-[#1e3a8a] mb-1">بياناتك محمية</h4>
                <p className="text-xs text-blue-500 font-medium">جميع البيانات مشفرة ومحفوظة وفقاً لأعلى معايير الأمان بنظام وصال.</p>
            </div>
        </div>
    );
};

export default AdminAccount;