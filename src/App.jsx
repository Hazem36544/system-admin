import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// استيراد الصفحات والـ Layout
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/DashboardPage'; // تم إضافة استيراد الصفحة الرئيسية هنا
import SchoolsPage from './pages/SchoolsPage';
import FamilyCourtsPage from './pages/FamilyCourtsPage';
import AdminAccount from './pages/AccountScreen';

// استيراد مكون إصلاح السكرول
import ScrollToTop from './components/ScrollToTop';

// مكون لحماية المسارات 
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// (تم حذف المكون المؤقت DashboardHome من هنا لنظافة الكود)

// دالة المسارات 
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // هذا هو "الحارس": يوقف الـ Router تماماً عن اتخاذ أي قرار توجيه 
  // حتى ينتهي AuthContext من فحص الـ localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e3a8a]"></div>
      </div>
    );
  }

  // بمجرد انتهاء التحميل، يتم تقييم المسارات بناءً على حالة الدخول الحقيقية
  return (
    <Routes>
      {/* مسار تسجيل الدخول */}
      <Route path="/login" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin-dashboard" />} />
      
      {/* مسارات لوحة التحكم */}
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* تم التعديل هنا لاستخدام DashboardPage المنفصلة */}
        <Route index element={<DashboardPage />} />
        <Route path="courts" element={<FamilyCourtsPage />} />
        <Route path="schools" element={<SchoolsPage />} />
        <Route path="account" element={<AdminAccount />} />
      </Route>

      {/* توجيه افتراضي */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/admin-dashboard" : "/login"} />} />
    </Routes>
  );
};

// المكون الرئيسي
function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-center" />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;