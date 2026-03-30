import React, { useState } from 'react';
import { Building2, Loader2, AlertCircle, Save, Scale } from 'lucide-react';
import api from '../services/api'; // تأكد إن مسار ملف api.js صحيح حسب هيكل مشروعك
import CredentialsSuccessModal from '../components/CredentialsSuccessModal';
import { toast } from 'react-hot-toast';

const governoratesList = [
  "القاهرة", "الجيزة", "الإسكندرية","سوهاج", "الدقهلية", "البحر الأحمر", 
  "الشرقية", "الغربية", "المنوفية", "القليوبية", "البحيرة" 
];

const FamilyCourtsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const [formData, setFormData] = useState({
    name: '', 
    governorate: '', 
    address: '', 
    email: '', 
    contactInfo: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // إرسال البيانات للباك إند الحقيقي لإنشاء المحكمة
      const response = await api.post('/api/users/family-courts', formData);
      
      // ✅ تم التعديل هنا: استخدام formData.email بدلاً من response.data.username
      const credentials = {
        username: formData.email, 
        temporaryPassword: response.data.temporaryPassword 
      };
      
      setCreatedCredentials(credentials);
      setSuccessModalOpen(true);
      
      // تفريغ الفورم بعد النجاح
      setFormData({
        name: '', governorate: '', address: '', email: '', contactInfo: ''
      });
      toast.success('تم إنشاء حساب المحكمة بنجاح!');

    } catch (err) {
      console.error("Create Court Error:", err);
      // قراءة رسالة الخطأ من الـ ProblemDetails اللي بيرجعها الـ .NET
      const errorMsg = err.response?.data?.detail || err.response?.data?.title || 'حدث خطأ أثناء الإنشاء، يرجى التأكد من البيانات.';
      setError(errorMsg);
      toast.error('فشلت العملية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 w-full font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* الهيدر */}
        <div className="relative w-full bg-[#1e3a8a] rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-xl mb-8">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

            <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                <div>
                    <h1 className="text-2xl font-bold mb-1">إضافة محكمة أسرة جديدة</h1>
                    <p className="text-blue-200 text-sm opacity-90">تسجيل بيانات المحكمة لإنشاء حسابها على النظام</p>
                </div>
            </div>

            <div className="hidden md:flex bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 relative z-10">
                <Scale className="w-8 h-8 text-blue-100" />
            </div>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-xl flex items-center gap-2 text-sm border border-red-100 animate-in fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col space-y-8">
            
            {/* عنوان الفورم */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-[#1e3a8a]">
                <Building2 size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">البيانات الأساسية للمحكمة</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">اسم المحكمة</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all" placeholder="مثال: محكمة أسرة المعادي" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">المحافظة</label>
                  <select name="governorate" required value={formData.governorate} onChange={handleChange} className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all">
                    <option value="" disabled>اختر المحافظة...</option>
                    {governoratesList.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">رقم التواصل</label>
                  <input type="tel" name="contactInfo" required value={formData.contactInfo} onChange={handleChange} className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all text-left" dir="ltr" placeholder="02-xxxxxxx" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">العنوان التفصيلي</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all" placeholder="عنوان مبنى المحكمة بالكامل" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">البريد الإلكتروني</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all text-left" dir="ltr" placeholder="court@example.com" />
              </div>
            </div>

          </div>

          {/* زر الإرسال */}
          <div className="flex justify-center mt-10 mb-8">
              <button 
                type="submit" disabled={loading}
                className="w-full md:w-[60%] lg:w-[50%] bg-[#1e3a8a] text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-blue-900/20 text-lg border border-blue-800"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                <span>إضافة المحكمة وإنشاء الحساب</span>
              </button>
          </div>

        </form>
      </div>

       {/* Credentials Modal */}
      <CredentialsSuccessModal 
        isOpen={successModalOpen} 
        onClose={() => setSuccessModalOpen(false)}
        credentials={createdCredentials}
      />

    </div>
  );
};

export default FamilyCourtsPage;