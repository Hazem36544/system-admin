import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { authAPI, userAPI } from '/src/services/api'; 

// دالة فك تشفير التوكن مع معالجة الـ Padding لتجنب خطأ atob
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // إضافة علامات التكملة لتجنب خطأ InvalidCharacterError
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Token parsing error:", e);
    return null;
  }
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState('login');
  const [tempToken, setTempToken] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ التعديل هنا: تنظيف مخصص للإدارة فقط دون المساس بباقي الأنظمة
  useEffect(() => {
    if (localStorage.getItem('force_change_password') === 'true') {
      setStep('change_password');
      setError('يرجى تغيير كلمة المرور المؤقتة قبل الدخول للنظام');
    } else {
      // مسح مفاتيح الإدارة فقط، وترك مفاتيح الأنظمة الأخرى في حالها
      localStorage.removeItem('wesal_admin_token');
      localStorage.removeItem('wesal_admin_user_data');
      localStorage.removeItem('wesal_admin_user_role');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null); 
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    if (error) setError(null);
  };

  // 1. دالة تسجيل الدخول الأساسية
  const handleSubmit = async (e) => {
    e.preventDefault();
    await executeRealLogin(formData.email.trim(), formData.password);
  };

  const executeRealLogin = async (email, password) => {
    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    setError(null);

    // تنظيف المفاتيح الخاصة بنظام الإدارة فقط لضمان جلسة نظيفة
    localStorage.removeItem('wesal_admin_token');
    localStorage.removeItem('wesal_admin_user_data');
    localStorage.removeItem('wesal_admin_user_role');
    
    try {
      const response = await authAPI.loginSystemAdmin({ email, password });

      // التأكد من استخراج التوكن كنص (String) وليس ككائن (Object)
      if (response.data && response.data.token) {
        const token = response.data.token;
        const decodedToken = parseJwt(token);
        
        console.log("Decoded Admin Token:", decodedToken);

        // التحقق من حالة الباسورد المؤقت
        const isTemporary = decodedToken?.tmp_pwd === "True" || decodedToken?.tmp_pwd === true || decodedToken?.tmp_pwd === "true";

        if (isTemporary) {
          // حفظ التوكن المؤقت في مفتاح الإدارة
          localStorage.setItem('wesal_admin_token', token); 
          setTempToken(token);
          setPasswords({ ...passwords, currentPassword: password });
          setStep('change_password');
          toast('يجب تأمين حسابك بكلمة مرور جديدة قبل الدخول', { icon: '🔒', duration: 4000 });
          setLoading(false);
          return;
        }

        // استخراج بيانات الأدمن من التوكن
        const userDataToSave = {
          id: decodedToken?.nameid || decodedToken?.sub || decodedToken?.jti,
          email: decodedToken?.email || email,
          name: decodedToken?.unique_name || decodedToken?.name || 'مدير النظام',
          role: 'admin'
        };

        // حفظ البيانات النهائية والتوكن السليم بأسماء الإدارة المعزولة
        localStorage.setItem('wesal_admin_token', token);
        localStorage.setItem('wesal_admin_user_data', JSON.stringify(userDataToSave));
        localStorage.setItem('wesal_admin_user_role', 'admin'); 

        login(userDataToSave, token); 
        toast.success("تم تسجيل الدخول بنجاح");
        navigate('/admin-dashboard/courts'); 
      } else {
        setError("فشل تسجيل الدخول: لم يتم استلام رمز الوصول");
      }

    } catch (err) {
      console.error("Admin Login Error:", err);
      localStorage.removeItem('wesal_admin_token');

      if (err.response) {
        const errorMsg = err.response.data?.detail || err.response.data?.title || "";
        if (err.response.status === 403 && (errorMsg.toLowerCase().includes("temporary password") || errorMsg.includes("تغيير كلمة المرور"))) {
          setStep('change_password');
          toast('يجب تأمين حسابك بكلمة مرور جديدة قبل الدخول', { icon: '🔒', duration: 4000 });
        } else if (err.response.status === 401 || err.response.status === 400) {
          setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } else if (err.response.status === 404) {
          setError("هذا الحساب غير مسجل في النظام");
        } else {
          setError(`حدث خطأ: ${errorMsg || err.response.status}`);
        }
      } else if (err.code === 'ERR_NETWORK') {
        setError('فشل الاتصال بالخادم. تأكد من تشغيل النظام الخلفي');
      } else {
        setError("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. دالة تغيير الباسورد الإجباري
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('كلمة المرور الجديدة غير متطابقة');
      return;
    }
    if (passwords.newPassword.length < 6) {
       setError('يجب أن تتكون كلمة المرور من 6 خانات على الأقل');
       return;
    }

    setLoading(true);
    setError('');

    try {
      await userAPI.changePassword({
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      // مسح الداتا المؤقتة
      localStorage.removeItem('wesal_admin_token');
      localStorage.removeItem('force_change_password');

      toast.success("تم تأمين الحساب بنجاح! جاري توجيهك للوحة التحكم...");
      
      // إعادة الدخول تلقائياً لاستخراج التوكن الدائم
      await executeRealLogin(formData.email.trim(), passwords.newPassword);

    } catch (error) {
      console.error("Change Password Error:", error);
      const validationErrors = error.response?.data?.errors;
      let errorMsg = 'حدث خطأ أثناء تغيير كلمة المرور. تأكد من متطلبات الحماية.';
      
      if (validationErrors) {
          if (Array.isArray(validationErrors)) {
             errorMsg = validationErrors.map(errItem => errItem.description || "خطأ في الشروط").join(" - ");
          } else {
             errorMsg = Object.values(validationErrors).flat().join(" - ");
          }
      } else {
          errorMsg = error.response?.data?.detail || error.response?.data?.title || error.message || errorMsg;
      }
      setError(errorMsg);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#F3F4F6] flex flex-col justify-center items-center p-4 font-sans overflow-hidden" dir="rtl">
      
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="mb-4">
          <img 
            src={`${import.meta.env.BASE_URL}logo.svg`} 
            alt="شعار وصال" 
            className="w-32 h-auto mx-auto hover:scale-105 transition-transform duration-300 drop-shadow-sm"
            onError={(e) => { e.target.src = '/logo.svg'; }} 
          />
        </div>
        <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">نظام الإدارة العليا</h1>
        <p className="text-gray-500 font-medium text-lg">مشروع وصال - وزارة العدل</p>
      </div>

      {step === 'login' && (
        <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg p-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">تسجيل دخول المسؤول</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 flex items-start gap-2 text-sm border border-red-100 animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">البريد الإلكتروني للإدارة</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:border-transparent transition-all text-gray-800 placeholder-gray-400 outline-none text-left font-mono"
                placeholder="admin@wesal.gov.eg"
                dir="ltr"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pr-4 pl-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:border-transparent transition-all text-gray-800 placeholder-gray-400 outline-none text-left font-mono"
                  placeholder="أدخل كلمة المرور"
                  dir="ltr"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e3a8a] text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center hover:bg-[#172554] transition-all duration-200 mt-6 shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin ml-2" /> جاري التحقق...</>
              ) : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      )}

      {step === 'change_password' && (
        <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg p-10 border border-gray-100 relative overflow-hidden border-t-4" style={{ borderColor: '#1e3a8a' }}>
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1e3a8a]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">تأمين حساب الإدارة</h2>
            <p className="text-center text-gray-500 text-sm px-2">
              هذا هو تسجيل دخولك الأول، يرجى تغيير كلمة المرور المؤقتة بكلمة مرور خاصة بك للمتابعة.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 flex items-start gap-2 text-sm border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 flex items-start gap-2 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>يجب تغيير كلمة المرور المؤقتة قبل استخدام النظام.</span>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">كلمة المرور الحالية (المؤقتة)</label>
              <div className="relative">
                <input type={showCurrentPassword ? 'text' : 'password'} name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} className="block w-full pr-4 pl-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:border-transparent transition-all text-gray-800 placeholder-gray-400 outline-none text-left font-mono tracking-widest" dir="ltr" required disabled={loading} />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">{showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">كلمة المرور الجديدة</label>
              <div className="relative">
                <input type={showNewPassword ? 'text' : 'password'} name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} className="block w-full pr-4 pl-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:border-transparent transition-all text-gray-800 placeholder-gray-400 outline-none text-left font-mono tracking-widest" placeholder="أدخل كلمة المرور الجديدة" dir="ltr" required disabled={loading} />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">{showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">تأكيد كلمة المرور</label>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} className="block w-full pr-4 pl-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:border-transparent transition-all text-gray-800 placeholder-gray-400 outline-none text-left font-mono tracking-widest" placeholder="أعد إدخال كلمة المرور" dir="ltr" required disabled={loading} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mt-6 border border-gray-100">
              <p className="text-sm font-bold text-gray-700 mb-3">متطلبات كلمة المرور:</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500 ml-2" /> 6 أحرف على الأقل</li>
                <li className="flex items-center text-sm text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500 ml-2" /> أحرف كبيرة وصغيرة</li>
                <li className="flex items-center text-sm text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500 ml-2" /> رقم واحد على الأقل</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e3a8a] text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center hover:bg-[#172554] transition-all duration-200 mt-6 shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin ml-2" /> جاري التحديث...</> : 'تأكيد وحفظ'}
            </button>
          </form>
        </div>
      )}

      <div className="mt-10 text-center opacity-80">
        <div className="bg-white/50 backdrop-blur-sm py-2 px-6 rounded-full inline-block border border-white/60">
            <p className="text-gray-500 text-xs font-semibold">
            نظام آمن ومعتمد من وزارة العدل - مشروع وصال
            </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;