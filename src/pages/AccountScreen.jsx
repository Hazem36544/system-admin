import React, { useState } from 'react';
import { User, Phone, Mail, ShieldCheck, LogOut, X, Edit, Save, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
// تم استيراد AuthContext لضمان تسجيل الخروج الفعلي من النظام
import { useAuth } from '../context/AuthContext';

const AdminAccount = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // جلب دالة تسجيل الخروج
    const { logout } = useAuth();

    return (
        <div className="w-full w-full animate-in fade-in duration-300" dir="rtl">
            <div className="max-w-7xl mx-auto w-full">
                
                {/* --- بداية الهيدر --- */}
                <div className="relative w-full bg-[#1e3a8a] rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-xl mb-8">
                    
                    {/* زخارف الخلفية */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                    {/* المحتوى النصي */}
                    <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">حساب المسؤول</h1>
                            <p className="text-blue-200 text-sm opacity-90">إدارة بيانات مدير النظام وإعدادات الوصول</p>
                        </div>
                    </div>

                    {/* الأيقونة التعبيرية على اليسار */}
                    <div className="hidden md:flex bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 relative z-10">
                        <ShieldCheck className="w-8 h-8 text-blue-100" />
                    </div>
                </div>
                {/* --- نهاية الهيدر --- */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Right Column (Profile Card) - 4 Cols */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm text-center relative overflow-hidden">
                            {/* خلفية خفيفة للكارت */}
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-white z-0"></div>
                            
                            <div className="relative z-10 w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-blue-50 shadow-xl">
                                <div className="w-full h-full bg-[#1e3a8a] rounded-full flex items-center justify-center">
                                    <ShieldCheck className="h-16 w-16 text-white" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">مدير النظام العام</h2>
                                <span className="bg-amber-100 text-amber-700 px-6 py-1.5 rounded-full font-bold text-sm inline-block border border-amber-200">
                                    Admin
                                </span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-3 text-gray-800 font-bold">
                                <Lock className="h-5 w-5 text-amber-600" />
                                صلاحيات مطلقة
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                أنت تمتلك صلاحيات إدارية كاملة لإدارة محاكم الأسرة، مراكز الرؤية، والمدارس. يرجى التأكد من تأمين حسابك وعدم مشاركة بيانات الدخول مع أي شخص.
                            </p>
                        </div>

                        {/* تم التعديل هنا: توجيه لصفحة /login مع تفعيل دالة logout */}
                        <Link 
                            to="/login" 
                            onClick={logout}
                            className="block w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold text-center hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center gap-2"
                        >
                            <LogOut className="h-5 w-5 rotate-180" />
                            تسجيل الخروج
                        </Link> 
                    </div>

                    {/* Left Column (Personal Info) - 8 Cols */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm h-full">
                            <h2 className="text-xl font-bold text-gray-800 mb-8 border-b pb-4 border-gray-100">المعلومات الأساسية</h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">اسم المستخدم</p>
                                            <p className="font-bold text-gray-800 text-lg font-mono">admin_root</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                            <Lock className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">مستوى الصلاحية</p>
                                            <p className="font-bold text-gray-800 text-lg">مدير نظام (Super Admin)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">البريد الإلكتروني</p>
                                            <p className="font-bold text-gray-800 text-lg font-mono">admin@wesal.gov.eg</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">رقم التواصل للإدارة</p>
                                            <p className="font-bold text-gray-800 text-lg" dir="ltr">0100 000 0000</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full mt-8 border-2 border-[#1e3a8a] text-[#1e3a8a] py-4 rounded-2xl font-bold hover:bg-[#1e3a8a] hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Edit className="h-5 w-5" />
                                تعديل بيانات الحساب
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Edit Data Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden transform scale-100 transition-all">
                        {/* Header */}
                        <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold">تحديث بيانات المسؤول</h2>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الاسم المرئي</label>
                                    <input 
                                        type="text" 
                                        defaultValue="مدير النظام العام"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none transition-all"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                                    <input 
                                        type="email" 
                                        defaultValue="admin@wesal.gov.eg"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                                    <input 
                                        type="tel" 
                                        defaultValue="0100 000 0000"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none transition-all text-right"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-xl mt-6 border border-blue-100">
                                <p className="text-xs text-blue-700 font-medium text-center flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    سيتم تطبيق التعديلات على النظام فور حفظها.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50">
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 bg-[#1e3a8a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#172554] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
                            >
                                <Save className="h-4 w-4" />
                                حفظ التعديلات
                            </button>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAccount;