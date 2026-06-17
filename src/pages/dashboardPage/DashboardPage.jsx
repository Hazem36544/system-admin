import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Scale } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 

const DashboardPage = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [courtsCount, setCourtsCount] = useState("..."); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourtsCount = async () => {
      try {
        const res = await api.get('/api/courts', { params: { PageNumber: 1, PageSize: 1 } });
        if (res.data && res.data.totalCount !== undefined) {
          setCourtsCount(res.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching courts count:", error);
        setCourtsCount(0);
      }
    };
    fetchCourtsCount();
  }, []);

  useEffect(() => {
      const timer = setTimeout(() => {
          setIsPageLoaded(true);
      }, 50);
      return () => clearTimeout(timer);
  }, []);

  return (
    <div 
        className={`p-4 pb-20 md:p-8 w-full font-sans transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} 
        dir="rtl"
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* --- الهيدر الترحيبي (متطابق مع تصميم صفحة الحساب وباقي النظام) --- */}
        <header className="relative w-full bg-[#1e3a8a] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl overflow-hidden flex items-center mb-8">
            
            {/* زخارف الخلفية */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute right-[-10%] top-[-50%] w-[400px] h-[400px] bg-white rounded-full blur-3xl"></div>
                <div className="absolute left-[-10%] bottom-[-50%] w-[300px] h-[300px] bg-blue-400 rounded-full blur-3xl"></div>
            </div>

            {/* الأيقونة والنص */}
            <div className="flex items-center gap-4 md:gap-5 relative z-10 w-full">
                <div className="bg-white/10 p-3 md:p-4 rounded-2xl border border-white/20 backdrop-blur-sm shadow-inner shrink-0">
                    <LayoutDashboard className="w-8 h-8 md:w-10 md:h-10 text-blue-100" strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-xl md:text-3xl font-black mb-1 md:mb-2 tracking-tight">مرحباً بك في الإدارة العليا</h1>
                    <p className="text-blue-200 text-xs md:text-sm font-bold flex items-center gap-1.5 opacity-90">
                        <LayoutDashboard size={14} className="shrink-0" />
                        من هنا يمكنك إدارة بيانات محاكم الأسرة والدوائر الخاصة بنظام وصال.
                    </p>
                </div>
            </div>
        </header>
        {/* --- نهاية الهيدر --- */}

        {/* --- حاوية المحتوى --- */}
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard 
                icon={Scale} 
                title="محاكم الأسرة" 
                value={courtsCount} 
                onClick={() => navigate('/admin-dashboard/courts')} 
              />
            </div>
        </div>

      </div>
    </div>
  );
};

// تصميم الكارت
const DashboardCard = ({ icon: Icon, title, value, onClick }) => (
  <div
    onClick={onClick}
    className="group p-6 md:p-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 rounded-[2rem] overflow-hidden relative transition-all duration-500 ease-out transform transform-gpu hover:-translate-y-1.5 h-full w-full outline-none cursor-pointer" 
    dir="rtl"
  >
    <div className="relative z-10 flex flex-col items-center text-center justify-center h-full w-full">
      <div className="w-16 h-16 mx-auto bg-[#1e3a8a] rounded-[1.25rem] flex items-center justify-center mb-5 shadow-sm transition-all duration-500 ease-out transform transform-gpu group-hover:scale-110 group-hover:-translate-y-1 shrink-0 will-change-transform">
        <Icon className="w-8 h-8 text-white transition-transform duration-500 ease-out group-hover:scale-110" />
      </div>
      
      <div className="w-full text-4xl font-black mb-2 text-gray-800 font-mono flex items-center justify-center min-h-[40px]">
        {value}
      </div>
      
      <p className="w-full text-sm md:text-base text-gray-500 font-bold mt-auto pt-1">{title}</p>
    </div>
    
    {/* تأثير الإضاءة الخلفية */}
    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#1e3a8a] opacity-[0.03] rounded-full blur-2xl transition-all duration-500 ease-out transform-gpu group-hover:opacity-15 group-hover:scale-150 pointer-events-none will-change-transform"></div>
  </div>
);

export default DashboardPage;