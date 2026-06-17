import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { authAPI, userAPI } from '../../services/api'; 
import { getErrorMessage } from '../../utils/errorHandler';

import { parseJwt } from './components/AdminLoginHelpers';
import { AdminHeader, AdminFooter } from './components/AdminLayout';
import LoginForm from './components/LoginForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import SuccessTransition from './components/SuccessTransition';

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
  const [formErrors, setFormErrors] = useState({});

  const [emailFieldName] = useState(() => 'eml_' + Math.random().toString(36).substring(2, 9));
  const [pwdFieldName] = useState(() => 'pwd_' + Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    if (sessionStorage.getItem('force_change_password') === 'true') {
      setStep('change_password');
      setError('يرجى تغيير كلمة المرور المؤقتة قبل الدخول للنظام');
    } else {
      sessionStorage.removeItem('wesal_admin_token');
      sessionStorage.removeItem('wesal_admin_user_data');
      sessionStorage.removeItem('wesal_admin_user_role');
    }
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: null }));
    if (error) setError(null);
  };

  const handlePassChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: null }));
    if (error) setError(null);
  };

  const validateLoginForm = () => {
    let errors = {};
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = "يرجى إدخال بريد إلكتروني صحيح للإدارة";
      isValid = false;
    }
    if (!formData.password.trim()) {
      errors.password = "يرجى إدخال كلمة المرور";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateLoginForm()) return;
    await executeRealLogin(formData.email.trim(), formData.password);
  };

  const executeRealLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    setFormErrors({});
    sessionStorage.removeItem('wesal_admin_token');
    sessionStorage.removeItem('wesal_admin_user_data');
    sessionStorage.removeItem('wesal_admin_user_role');
    
    try {
      const response = await authAPI.loginSystemAdmin({ email, password });
      if (response.data && response.data.token) {
        const token = response.data.token;
        const decodedToken = parseJwt(token);
        const isTemporary = decodedToken?.tmp_pwd === "True" || decodedToken?.tmp_pwd === true || decodedToken?.tmp_pwd === "true";

        if (isTemporary) {
          sessionStorage.setItem('wesal_admin_token', token); 
          sessionStorage.setItem('force_change_password', 'true');
          setTempToken(token);
          setPasswords({ ...passwords, currentPassword: password });
          setStep('change_password');
          toast('يجب تأمين حسابك بكلمة مرور جديدة قبل الدخول', { icon: '🔒', duration: 4000 });
          setLoading(false);
          return;
        }

        const userDataToSave = {
          id: decodedToken?.nameid || decodedToken?.sub || decodedToken?.jti,
          email: decodedToken?.email || email,
          name: decodedToken?.unique_name || decodedToken?.name || 'مدير النظام',
          role: 'admin'
        };

        sessionStorage.setItem('wesal_admin_token', token);
        sessionStorage.setItem('wesal_admin_user_data', JSON.stringify(userDataToSave));
        sessionStorage.setItem('wesal_admin_user_role', 'admin'); 
        login(userDataToSave, token); 
        toast.success("تم تسجيل الدخول بنجاح");
        navigate('/admin-dashboard/courts'); 
      } else {
        throw new Error("لم يتم استلام رمز الوصول");
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      sessionStorage.removeItem('wesal_admin_token');
      if (err.response) {
        const errorMsg = err.response.data?.detail || err.response.data?.title || "";
        if (err.response.status === 403 && (errorMsg.toLowerCase().includes("temporary password") || errorMsg.includes("تغيير كلمة المرور"))) {
          setStep('change_password');
          toast('يجب تأمين حسابك بكلمة مرور جديدة قبل الدخول', { icon: '🔒', duration: 4000 });
        } else {
          setError(getErrorMessage(err));
        }
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordChange = () => {
    let errors = {};
    let isValid = true;
    if (!passwords.currentPassword.trim()) { errors.currentPassword = "يرجى إدخال كلمة المرور الحالية"; isValid = false; }
    if (!passwords.newPassword.trim() || passwords.newPassword.length < 6) { errors.newPassword = "يجب أن تتكون كلمة المرور من 6 خانات على الأقل"; isValid = false; }
    if (!passwords.confirmPassword.trim() || passwords.newPassword !== passwords.confirmPassword) { errors.confirmPassword = "كلمتا المرور غير متطابقتين"; isValid = false; }
    setFormErrors(errors);
    return isValid;
  };

  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();
    if (!validatePasswordChange()) return;
    setLoading(true);
    setError('');

    try {
      await userAPI.changePassword({ oldPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      sessionStorage.removeItem('wesal_admin_token');
      sessionStorage.removeItem('force_change_password');
      setStep('success_transition');
      setTimeout(async () => {
        toast.success("جاري توجيهك للوحة التحكم...");
        await executeRealLogin(formData.email.trim(), passwords.newPassword);
      }, 2000);
    } catch (error) {
      console.error("Change Password Error:", error);
      setError(getErrorMessage(error));
      setLoading(false);
    } 
  };

  const handleKeyPress = (e, currentStep) => {
    if (e.key === 'Enter') {
      currentStep === 'login' ? handleLoginSubmit(e) : handleUpdatePassword(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" dir="rtl" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif', background: '#F5F5F5' }}>
      <div className="w-full max-w-[460px]">
        
        <AdminHeader />

        {step === 'login' && (
          <LoginForm 
            formData={formData} handleFormChange={handleFormChange} formErrors={formErrors} error={error} loading={loading}
            showPassword={showPassword} setShowPassword={setShowPassword} handleKeyPress={handleKeyPress} 
            handleLoginSubmit={handleLoginSubmit} emailFieldName={emailFieldName} pwdFieldName={pwdFieldName}
          />
        )}

        {step === 'change_password' && (
          <ChangePasswordForm 
            passwords={passwords} handlePassChange={handlePassChange} formErrors={formErrors} error={error} loading={loading}
            showCurrentPassword={showCurrentPassword} setShowCurrentPassword={setShowCurrentPassword}
            showNewPassword={showNewPassword} setShowNewPassword={setShowNewPassword}
            showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword}
            handleKeyPress={handleKeyPress} handleUpdatePassword={handleUpdatePassword}
          />
        )}

        {step === 'success_transition' && <SuccessTransition />}

        <AdminFooter />
        
      </div>
    </div>
  );
};

export default AdminLogin;