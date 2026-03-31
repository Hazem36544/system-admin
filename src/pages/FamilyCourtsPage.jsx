import React, { useState, useRef, useEffect } from 'react';
import { Building2, Loader2, AlertCircle, Save, Scale, ChevronDown, Search } from 'lucide-react';
import api from '../services/api'; 
import CredentialsSuccessModal from '../components/CredentialsSuccessModal';
import { toast } from 'react-hot-toast';

const governoratesList = [
  { ar: "القاهرة", en: "Cairo" },
  { ar: "الجيزة", en: "Giza" },
  { ar: "الإسكندرية", en: "Alexandria" },
  { ar: "القليوبية", en: "Qalyubia" },
  { ar: "الدقهلية", en: "Dakahlia" },
  { ar: "الشرقية", en: "Sharqia" },
  { ar: "الغربية", en: "Gharbia" },
  { ar: "المنوفية", en: "Monufia" },
  { ar: "البحيرة", en: "Beheira" },
  { ar: "كفر الشيخ", en: "Kafr El Sheikh" },
  { ar: "دمياط", en: "Damietta" },
  { ar: "بورسعيد", en: "Port Said" },
  { ar: "الإسماعيلية", en: "Ismailia" },
  { ar: "السويس", en: "Suez" },
  { ar: "شمال سيناء", en: "North Sinai" },
  { ar: "جنوب سيناء", en: "South Sinai" },
  { ar: "البحر الأحمر", en: "Red Sea" },
  { ar: "مطروح", en: "Matrouh" },
  { ar: "الفيوم", en: "Fayoum" },
  { ar: "بني سويف", en: "Beni Suef" },
  { ar: "المنيا", en: "Minya" },
  { ar: "أسيوط", en: "Assiut" },
  { ar: "سوهاج", en: "Sohag" },
  { ar: "قنا", en: "Qena" },
  { ar: "الأقصر", en: "Luxor" },
  { ar: "أسوان", en: "Aswan" },
  { ar: "الوادي الجديد", en: "New Valley" }
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

  // Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // ✅ تتبع العنصر المظلل بالكيبورد
  
  const dropdownRef = useRef(null);
  const listRef = useRef(null); // ✅ ريفرنس للقائمة عشان نعمل سكرول أوتوماتيك

  const filteredGovernorates = governoratesList.filter(gov => 
    gov.ar.includes(searchTerm)
  );

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        if (!formData.governorate) {
          setSearchTerm('');
        } else {
          const selected = governoratesList.find(g => g.en === formData.governorate);
          if (selected) setSearchTerm(selected.ar);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [formData.governorate]);

  // ✅ سكرول أوتوماتيك للعنصر المظلل بالكيبورد
  useEffect(() => {
    if (isDropdownOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = document.getElementById(`gov-item-${highlightedIndex}`);
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isDropdownOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
    setHighlightedIndex(-1); // تصفير التظليل لما يكتب حرف جديد
    if (formData.governorate) {
       setFormData({ ...formData, governorate: '' });
    }
    if (error) setError(null);
  };

  const handleSelectGovernorate = (gov) => {
    setFormData({ ...formData, governorate: gov.en });
    setSearchTerm(gov.ar); 
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    if (error) setError(null);
  };

  // ✅ معالجة ضغطات الكيبورد (الأسهم والإنتر)
  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredGovernorates.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault(); // منع الإرسال التلقائي للفورم
      if (highlightedIndex >= 0 && highlightedIndex < filteredGovernorates.length) {
        handleSelectGovernorate(filteredGovernorates[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.governorate) {
        setError('يرجى اختيار المحافظة الصحيحة من القائمة');
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/users/family-courts', formData);
      
      const credentials = {
        username: formData.email, 
        temporaryPassword: response.data.temporaryPassword 
      };
      
      setCreatedCredentials(credentials);
      setSuccessModalOpen(true);
      
      setFormData({
        name: '', governorate: '', address: '', email: '', contactInfo: ''
      });
      setSearchTerm('');
      toast.success('تم إنشاء حساب المحكمة بنجاح!');

    } catch (err) {
      console.error("Create Court Error:", err);
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
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col space-y-8 relative z-20">
            
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                
                {/* حقل المحافظة - Searchable Combobox with Keyboard Navigation */}
                <div className="relative" ref={dropdownRef}>
                  <label className="text-sm font-semibold text-gray-700">المحافظة</label>
                  
                  <div className="relative w-full mt-2">
                    <input 
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown} // ✅ التقاط الكيبورد هنا
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="ابحث أو اختر المحافظة..."
                      className={`w-full px-4 py-3 pl-10 bg-gray-50 border rounded-xl outline-none transition-all
                        ${isDropdownOpen ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20' : 'border-gray-200 hover:border-gray-300'}
                      `}
                    />
                    <ChevronDown 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <ul ref={listRef} className="max-h-60 overflow-y-auto custom-scrollbar py-2">
                        {filteredGovernorates.length > 0 ? (
                          filteredGovernorates.map((gov, index) => (
                            <li 
                              key={gov.en} 
                              id={`gov-item-${index}`} // ✅ آي دي عشان السكرول
                              onClick={() => handleSelectGovernorate(gov)}
                              onMouseEnter={() => setHighlightedIndex(index)} // ✅ تظليل بالماوس كمان
                              className={`px-4 py-3 text-sm cursor-pointer transition-colors flex justify-between items-center
                                ${formData.governorate === gov.en ? 'bg-blue-50 text-[#1e3a8a] font-bold' : ''}
                                ${highlightedIndex === index && formData.governorate !== gov.en ? 'bg-gray-100 text-[#1e3a8a]' : 'text-gray-700'}
                              `}
                            >
                              {gov.ar}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-4 text-sm text-gray-500 text-center flex flex-col items-center gap-2">
                            <Search className="w-5 h-5 opacity-50" />
                            لا توجد محافظة بهذا الاسم
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
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

          <div className="flex justify-center mt-10 mb-8 relative z-10">
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

      <CredentialsSuccessModal 
        isOpen={successModalOpen} 
        onClose={() => setSuccessModalOpen(false)}
        credentials={createdCredentials}
      />

    </div>
  );
};

export default FamilyCourtsPage;