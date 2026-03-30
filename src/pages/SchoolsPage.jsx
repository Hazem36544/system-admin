import React, { useState } from 'react';
import { Plus, Settings, CheckCircle, X } from 'lucide-react';

const SchoolsPage = () => {
  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    governorate: '',
    address: '',
    contactNumber: '',
  });

  // Dummy Data for the table
  const schools = [
    { id: 1, name: 'مدرسة الأمل الابتدائية', governorate: 'القاهرة', address: 'شارع التحرير، وسط البلد', contact: '01012345678' },
    { id: 2, name: 'مدرسة المستقبل الإعدادية', governorate: 'الجيزة', address: 'شارع الهرم، الجيزة', contact: '01123456789' },
    { id: 3, name: 'مدرسة النور الثانوية', governorate: 'الإسكندرية', address: 'محطة الرمل، الإسكندرية', contact: '01234567890' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to save school would go here
    setIsAddModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setFormData({ name: '', governorate: '', address: '', contactNumber: '' });
  };

  return (
    <div className="p-8 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a8a]">إدارة المدارس</h1>
          <p className="text-gray-500 mt-1">عرض وإضافة المدارس المعتمدة في النظام</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#1e3a8a] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-md"
        >
          <Plus size={20} />
          <span>إضافة مدرسة جديدة</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-sm font-semibold text-gray-600">اسم المدرسة</th>
                <th className="p-4 text-sm font-semibold text-gray-600">المحافظة</th>
                <th className="p-4 text-sm font-semibold text-gray-600">العنوان</th>
                <th className="p-4 text-sm font-semibold text-gray-600">رقم التواصل</th>
                <th className="p-4 text-sm font-semibold text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-gray-800 font-medium">{school.name}</td>
                  <td className="p-4 text-gray-600">{school.governorate}</td>
                  <td className="p-4 text-gray-600">{school.address}</td>
                  <td className="p-4 text-gray-600" dir="ltr" style={{ textAlign: 'right' }}>{school.contact}</td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 p-2 rounded-lg transition-colors">
                      <Settings size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add School Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">تسجيل مدرسة جديدة</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم المدرسة</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 w-full focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
                  <input
                    type="text"
                    id="governorate"
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 w-full focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 w-full focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">رقم التواصل</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 w-full focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all placeholder:text-right"
                    dir="rtl" // Force RTL for consistency
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#1e3a8a] text-white px-6 py-2 rounded-xl hover:bg-blue-900 transition-colors font-bold shadow-md"
                >
                  حفظ وتسجيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Credentials Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle size={48} className="text-green-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mt-2">تم تسجيل المدرسة بنجاح</h2>
            
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-6 mt-4 border border-yellow-200">
              يرجى نسخ بيانات الدخول التالية وتسليمها لإدارة المدرسة. لن يتم عرض كلمة المرور مرة أخرى.
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-right space-y-4 mb-2">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-gray-500 text-sm">اسم المستخدم:</span>
                <span className="font-bold text-[#1e3a8a] dir-ltr">school_admin_123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">كلمة المرور المؤقتة:</span>
                <span className="font-bold text-[#1e3a8a] dir-ltr">Temp@9876</span>
              </div>
            </div>

            <button
              onClick={closeSuccessModal}
              className="w-full bg-[#1e3a8a] text-white py-3 rounded-xl mt-6 hover:bg-blue-900 transition-colors font-bold shadow-md"
            >
              تم النسخ وإغلاق النافذة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolsPage;
