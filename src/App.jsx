import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react'; // ✅ استيراد أيقونة التحميل الموحدة
import { AuthProvider, useAuth } from './context/AuthContext';

// استيراد مكون إصلاح السكرول (يُترك كما هو لأنه أساسي للراوتر)
import ScrollToTop from './components/ScrollToTop';

// ✅ تطبيق التحميل الديناميكي (Lazy Loading) للصفحات لتقسيم الكود
const AdminLogin = lazy(() => import('./pages/adminLogin/AdminLogin'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const DashboardPage = lazy(() => import('./pages/dashboardPage/DashboardPage')); 
const FamilyCourtsPage = lazy(() => import('./pages/familyCourtsPage/FamilyCourtsPage'));
const AdminAccount = lazy(() => import('./pages/accountScreen/AccountScreen'));

// مكون لحماية المسارات 
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// دالة المسارات 
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // ✅ توحيد شاشة التحميل لتكون متناسقة مع باقي الأنظمة
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  return (
    // ✅ تغليف الـ Routes بـ Suspense لعرض Loader أثناء تحميل الشاشات
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل الشاشة...</span>
      </div>
    }>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin-dashboard" />} />
        
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="courts" element={<FamilyCourtsPage />} />
          <Route path="account" element={<AdminAccount />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/admin-dashboard" : "/login"} />} />
      </Routes>
    </Suspense>
  );
};

// المكون الرئيسي
function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        {/* ✅ تم تطبيق تصميم "الكبسولة" الجميل بناءً على الصورة */}
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: '"Times New Roman", "Traditional Arabic", serif',
              fontWeight: 'bold',
              borderRadius: '9999px', // شكل الكبسولة الناعم
              padding: '12px 24px',
              direction: 'rtl',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            },
            success: {
              style: {
                background: '#ECFDF5', // الخلفية الخضراء الفاتحة المريحة
                color: '#065F46',      // لون النص الأخضر الغامق
                border: '1px solid #A7F3D0',
              },
              iconTheme: {
                primary: '#10B981',    // لون الأيقونة
                secondary: '#FFFFFF',
              },
            },
            error: {
              style: {
                background: '#FEF2F2', // خلفية حمراء فاتحة للخطأ
                color: '#991B1B',
                border: '1px solid #FECACA',
              },
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;