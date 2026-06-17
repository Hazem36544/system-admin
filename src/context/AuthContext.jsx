import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ التعديل هنا: فحص التوكن الخاص بالأدمن فقط عند تحميل التطبيق
    const token = sessionStorage.getItem('wesal_admin_token');
    
    // التأكد من أن التوكن موجود وصحيح
    if (token && token !== 'demo_token_123' && token !== '[object Object]') {
      setIsAuthenticated(true);
      // ✅ التعديل هنا: قراءة بيانات مستخدم الأدمن من المفتاح المخصص له
      const savedUser = sessionStorage.getItem('wesal_admin_user_data');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("خطأ في قراءة بيانات المستخدم");
        }
      }
    } else {
      setIsAuthenticated(false);
    }
    // إيقاف شاشة التحميل بعد انتهاء الفحص
    setIsLoading(false);
  }, []);

  // دالة تسجيل الدخول الخاصة بالأدمن
  const login = (userData, token) => {
    // ✅ التعديل هنا: حفظ التوكن في مفتاح فريد لنظام الإدارة
    if (token) {
      sessionStorage.setItem('wesal_admin_token', token);
    }
    
    // ✅ التعديل هنا: حفظ بيانات المستخدم وصلاحيته في مفاتيح فريدة للأدمن
    if (userData) {
      sessionStorage.setItem('wesal_admin_user_data', JSON.stringify(userData));
      if (userData.role) {
        sessionStorage.setItem('wesal_admin_user_role', userData.role);
      }
      setUser(userData);
    }
    
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    // ✅ التعديل هنا: تنظيف شامل للمفاتيح الخاصة بنظام الإدارة فقط عند تسجيل الخروج
    sessionStorage.removeItem('wesal_admin_token');
    sessionStorage.removeItem('wesal_admin_user_role');
    sessionStorage.removeItem('wesal_admin_user_data');
    sessionStorage.removeItem('force_change_password');
    
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};