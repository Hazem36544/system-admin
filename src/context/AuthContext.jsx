import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // إضافة حالة المستخدم لتسهيل الوصول لبياناته في النظام

  useEffect(() => {
    // فحص التوكن بمجرد تحميل التطبيق
    const token = localStorage.getItem('wesal_token') || localStorage.getItem('wesal_parent_token');
    
    // التأكد من أن التوكن موجود وأنه ليس التوكن الوهمي القديم أو كائن مضروب
    if (token && token !== 'demo_token_123' && token !== '[object Object]') {
      setIsAuthenticated(true);
      const savedUser = localStorage.getItem('wesal_user_data');
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

  // تم التعديل هنا: استقبال بيانات المستخدم والتوكن الحقيقي بشكل صحيح
  const login = (userData, token) => {
    // حفظ التوكن في المتصفح إذا تم تمريره
    if (token) {
      localStorage.setItem('wesal_token', token);
    }
    
    // حفظ بيانات المستخدم وصلاحيته إذا تم تمريرها
    if (userData) {
      localStorage.setItem('wesal_user_data', JSON.stringify(userData));
      if (userData.role) {
        localStorage.setItem('wesal_user_role', userData.role);
      }
      setUser(userData);
    }
    
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    // تنظيف شامل لجميع المفاتيح عند تسجيل الخروج
    localStorage.removeItem('wesal_token');
    localStorage.removeItem('wesal_parent_token');
    localStorage.removeItem('token');
    localStorage.removeItem('wesal_user_role');
    localStorage.removeItem('wesal_user_data');
    localStorage.removeItem('force_change_password');
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