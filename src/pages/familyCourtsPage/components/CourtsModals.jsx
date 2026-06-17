import React from 'react';
import { Plus, X, ChevronDown, Smartphone, Phone, Save, Loader2, Building2, Trash2, MapPin, CheckCircle, Copy, AlertCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AddCourtModal = ({
  setIsAddModalOpen, handleAddCourt, formData, setFormData, formErrors, setFormErrors,
  dropdownRef, formSearchTerm, setFormSearchTerm, isDropdownOpen, setIsDropdownOpen,
  highlightedIndex, setHighlightedIndex, handleSelectGovernorate, filteredGovernorates,
  phoneType, setPhoneType, selectedGovCode, expectedLandlineLength, actionLoading, listRef
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-visible animate-in zoom-in-95 duration-300 flex flex-col" dir="rtl">
      <div className="bg-[#1e3a8a] p-5 md:p-6 flex justify-between items-center text-white shrink-0 rounded-t-[2.5rem] md:rounded-t-[3rem]">
        <div className="flex items-center gap-3">
          <Plus className="w-6 h-6 md:w-8 md:h-8" />
          <h2 className="text-lg md:text-2xl font-black">تسجيل محكمة جديدة</h2>
        </div>
        <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 border-none outline-none cursor-pointer transition-colors"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
      </div>
      
      <div className="p-6 md:p-8 bg-white rounded-b-[2.5rem] md:rounded-b-[3rem]">
        <form onSubmit={handleAddCourt} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="md:col-span-2">
              <label className="text-xs md:text-sm font-black text-gray-600 mb-1.5 block">اسم المحكمة بالكامل</label>
              <input type="text" value={formData.name} onChange={(e) => {setFormData({...formData, name: e.target.value}); setFormErrors({...formErrors, name: null});}} className={`w-full h-12 md:h-14 px-4 md:px-5 rounded-2xl bg-gray-50 border ${formErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:bg-white focus:ring-2 focus:ring-[#1e3a8a] outline-none font-bold transition-all shadow-sm text-sm`} placeholder="مثال: محكمة أسرة المعادي الجزئية" />
              {formErrors.name && <p className="text-red-500 text-xs font-bold mt-1">{formErrors.name}</p>}
            </div>
            
            <div className="relative w-full" ref={dropdownRef}>
              <div className="flex items-center justify-between mb-1.5 h-6">
                <label className="text-xs md:text-sm font-black text-gray-600 block">المحافظة</label>
              </div>
              <div className="relative w-full h-12 md:h-14">
                <input type="text" value={formSearchTerm} onChange={(e) => {setFormSearchTerm(e.target.value); setIsDropdownOpen(true); setHighlightedIndex(-1);}} onFocus={() => setIsDropdownOpen(true)} onKeyDown={(e) => {if(e.key==='Enter' && highlightedIndex>=0) {e.preventDefault(); handleSelectGovernorate(filteredGovernorates[highlightedIndex]);}}} placeholder="اختر المحافظة..." className={`w-full h-full px-4 md:px-5 pl-10 md:pl-12 rounded-2xl outline-none font-bold text-sm border ${formErrors.governorate && !isDropdownOpen ? 'border-red-400 bg-red-50' : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#1e3a8a]'}`} />
                <ChevronDown onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 cursor-pointer" />
              </div>
              {formErrors.governorate && <p className="text-red-500 text-xs font-bold mt-1">{formErrors.governorate}</p>}
              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  <ul ref={listRef} className="max-h-48 overflow-y-auto custom-scrollbar p-2 m-0 list-none">
                    {filteredGovernorates.map((gov, index) => (
                      <li key={gov.en} onClick={() => handleSelectGovernorate(gov)} onMouseEnter={() => setHighlightedIndex(index)} className={`px-4 py-2.5 text-xs md:text-sm font-bold cursor-pointer rounded-lg flex justify-between ${formData.governorate === gov.en ? 'bg-blue-50 text-[#1e3a8a]' : highlightedIndex === index ? 'bg-gray-50 text-[#1e3a8a]' : 'text-gray-600'}`}>
                        {gov.ar} <span className="text-[10px] md:text-xs text-gray-400 font-mono" dir="ltr">{gov.code}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="relative w-full">
              <div className="flex items-center justify-between mb-1.5 h-6">
                 <label className="text-xs md:text-sm font-black text-gray-600 block">رقم التواصل</label>
                 <div className="flex bg-gray-100 p-1 rounded-lg">
                   <button type="button" onClick={() => {setPhoneType('mobile'); setFormData({...formData, contactInfo: ''})}} className={`px-2 py-0.5 md:py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all border-none cursor-pointer ${phoneType === 'mobile' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><Smartphone className="w-3 h-3" /> موبايل</button>
                   <button type="button" onClick={() => {setPhoneType('landline'); setFormData({...formData, contactInfo: ''})}} className={`px-2 py-0.5 md:py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all border-none cursor-pointer ${phoneType === 'landline' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><Phone className="w-3 h-3" /> أرضي</button>
                 </div>
              </div>
              <div className="flex h-12 md:h-14" dir="ltr">
                {phoneType === 'landline' && (
                  <div className={`px-3 md:px-4 border border-r-0 rounded-l-2xl flex items-center justify-center font-black text-[#1e3a8a] text-sm shrink-0 ${formErrors.contactInfo ? 'bg-red-100 border-red-400 text-red-700' : 'bg-gray-200 border-gray-200'}`}>
                    {selectedGovCode || '---'}
                  </div>
                )}
                <input type="tel" value={formData.contactInfo} onChange={(e) => {setFormData({...formData, contactInfo: e.target.value.replace(/\D/g, '')}); setFormErrors({...formErrors, contactInfo: null})}} maxLength={phoneType === 'mobile' ? 11 : expectedLandlineLength} className={`flex-1 px-3 md:px-4 outline-none font-black text-left shadow-sm text-sm transition-all border ${phoneType === 'landline' ? 'rounded-r-2xl' : 'rounded-2xl'} ${formErrors.contactInfo ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400' : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#1e3a8a]'}`} placeholder={phoneType === 'mobile' ? '01xxxxxxxxx' : 'رقم التليفون'} />
              </div>
              {formErrors.contactInfo && <p className="text-red-500 text-xs font-bold mt-1 text-right">{formErrors.contactInfo}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="text-xs md:text-sm font-black text-gray-600 mb-1.5 block">البريد الإلكتروني للإدارة</label>
              <input type="email" value={formData.email} onChange={(e) => {setFormData({...formData, email: e.target.value}); setFormErrors({...formErrors, email: null});}} dir="ltr" className={`w-full h-12 md:h-14 px-4 md:px-5 rounded-2xl bg-gray-50 border ${formErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:bg-white focus:ring-2 focus:ring-[#1e3a8a] outline-none font-black text-right transition-all shadow-sm text-sm`} placeholder="court@wesal.gov.eg" />
              {formErrors.email && <p className="text-red-500 text-xs font-bold mt-1">{formErrors.email}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="text-xs md:text-sm font-black text-gray-600 mb-1.5 block">العنوان التفصيلي</label>
              <input type="text" value={formData.address} onChange={(e) => {setFormData({...formData, address: e.target.value}); setFormErrors({...formErrors, address: null});}} className={`w-full h-12 md:h-14 px-4 md:px-5 rounded-2xl bg-gray-50 border ${formErrors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:bg-white focus:ring-2 focus:ring-[#1e3a8a] outline-none font-bold transition-all shadow-sm text-sm`} placeholder="رقم المبنى، اسم الشارع، المعالم" />
              {formErrors.address && <p className="text-red-500 text-xs font-bold mt-1">{formErrors.address}</p>}
            </div>
          </div>
          
          <div className="pt-4 md:pt-6 border-t border-gray-100 flex gap-4">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 h-12 md:h-14 rounded-2xl bg-gray-100 text-gray-600 font-black border-none cursor-pointer hover:bg-gray-200 transition-all text-sm md:text-base">إلغاء</button>
            <button type="submit" disabled={actionLoading} className="flex-[2] h-12 md:h-14 rounded-2xl bg-[#1e3a8a] text-white font-black border-none cursor-pointer hover:bg-blue-900 shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 md:gap-3 transition-all text-sm md:text-base">
              {actionLoading ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4 md:w-5 md:h-5" />} حفظ المحكمة وإنشاء الحساب
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export const CourtDetailsModal = ({
  selectedCourt, setSelectedCourt, setIsDeleteConfirmOpen, translateGov
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] md:rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] animate-in slide-in-from-bottom-8 duration-500 overflow-hidden" dir="rtl">
      
      <div className="bg-[#1e3a8a] p-5 md:p-6 flex justify-between items-center text-white shrink-0 relative rounded-t-[2.5rem] md:rounded-t-[3rem]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
          <Building2 className="w-6 h-6 md:w-8 md:h-8 text-blue-100" />
          <h2 className="text-lg md:text-xl font-black">ملف المحكمة</h2>
        </div>
        <div className="flex gap-2 relative z-10">
          <button onClick={() => setIsDeleteConfirmOpen(true)} title="حذف" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-transparent flex items-center justify-center hover:bg-red-500/80 transition-all border-none cursor-pointer text-white"><Trash2 className="w-4 h-4 md:w-5 md:h-5" /></button>
          <button onClick={() => setSelectedCourt(null)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-transparent flex items-center justify-center hover:bg-white/20 border-none cursor-pointer transition-all text-white"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
        </div>
      </div>

      <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white relative rounded-b-[2.5rem] md:rounded-b-[3rem]">
        <div className="flex items-center gap-2 mb-4 md:mb-6 justify-end">
          <h3 className="font-bold text-[#1e3a8a] text-xs md:text-sm">بيانات المحكمة</h3>
          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#1e3a8a]" />
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="border border-gray-100 rounded-2xl p-4 text-center bg-gray-50/40 shadow-sm">
            <span className="text-[10px] text-gray-400 font-black block mb-1.5 uppercase tracking-widest">اسم المحكمة</span>
            <h3 className="font-black text-[#1e3a8a] text-lg md:text-xl leading-tight">{selectedCourt.name}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="border border-gray-100 rounded-2xl p-4 text-center bg-gray-50/40 shadow-sm">
              <span className="text-[10px] text-gray-400 font-black block mb-1.5">رقم التواصل</span>
              <p className="font-black text-gray-700 font-mono text-sm tracking-tighter" dir="ltr">{selectedCourt.contactInfo || '---'}</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-4 text-center bg-gray-50/40 shadow-sm">
              <span className="text-[10px] text-gray-400 font-black block mb-1.5">المحافظة</span>
              <p className="font-black text-gray-700 text-sm">{translateGov(selectedCourt.governorate)}</p>
            </div>
          </div>
          <div className="border border-gray-100 rounded-2xl p-4 text-center bg-gray-50/40 shadow-sm">
            <span className="text-[10px] text-gray-400 font-black block mb-1.5 uppercase tracking-widest">البريد الإلكتروني للإدارة</span>
            <p className="font-black text-gray-400 font-mono text-sm" dir="ltr">{selectedCourt.email}</p>
          </div>
          <div className="border border-gray-100 rounded-2xl p-4 text-center bg-gray-50/40 shadow-sm">
            <span className="text-[10px] text-gray-400 font-black block mb-1.5">العنوان التفصيلي</span>
            <p className="font-bold text-gray-700 text-sm leading-relaxed">{selectedCourt.address}</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3 rounded-b-[2.5rem]">
        <button onClick={() => setSelectedCourt(null)} className="w-full bg-white text-gray-700 border border-gray-200 h-12 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-sm outline-none active:scale-95 cursor-pointer">إغلاق النافذة</button>
      </div>
    </div>
  </div>
);

export const DeleteConfirmModal = ({ isDeleteConfirmOpen, setIsDeleteConfirmOpen, selectedCourt, handleDelete, isDeleting }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-200" dir="rtl">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <Trash2 className="w-10 h-10 text-[#dc2626]" />
      </div>
      <h3 className="text-xl font-black text-gray-800 mb-2">تأكيد الحذف</h3>
      <p className="text-gray-500 text-sm font-bold mb-8 leading-relaxed px-4">
        هل أنت متأكد من حذف محكمة <span className="text-gray-800 font-black">"{selectedCourt?.name}"</span>؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف بيانات حسابها.
      </p>
      <div className="flex gap-4">
        <button onClick={handleDelete} disabled={isDeleting} className="flex-[2] h-12 rounded-xl bg-[#dc2626] text-white font-black border-none cursor-pointer hover:bg-red-700 transition-colors flex items-center justify-center">
          {isDeleting ? <Loader2 className="animate-spin w-5 h-5" /> : 'نعم، احذف المحكمة'}
        </button>
        <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 h-12 rounded-xl bg-white border border-gray-200 text-gray-700 font-black cursor-pointer hover:bg-gray-50 transition-colors">تراجع</button>
      </div>
    </div>
  </div>
);

export const SuccessModal = ({ createdCredentials, setSuccessModalOpen }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[160] flex items-center justify-center p-4">
    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300" dir="rtl">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>
      <h2 className="text-2xl font-black text-gray-800 mb-3">تم التسجيل بنجاح!</h2>
      <p className="text-gray-500 text-sm font-bold mb-8">تم إنشاء حساب المحكمة وإصدار بيانات الدخول.</p>
      <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-8 space-y-4 text-right">
          <div className="bg-white p-4 rounded-xl border border-blue-50 flex justify-between items-center shadow-sm">
            <div className="overflow-hidden">
              <span className="text-[10px] font-black text-blue-400 block mb-1">بريد الدخول</span>
              <p className="font-black text-blue-900 font-mono text-sm truncate" dir="ltr">{createdCredentials.username}</p>
            </div>
            <button onClick={() => {navigator.clipboard.writeText(createdCredentials.username); toast.success("تم النسخ");}} className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border-none cursor-pointer hover:bg-blue-600 hover:text-white transition-all ml-2"><Copy className="w-4 h-4"/></button>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-50 flex justify-between items-center shadow-sm">
            <div className="overflow-hidden">
              <span className="text-[10px] font-black text-blue-400 block mb-1">كلمة المرور المؤقتة</span>
              <p className="font-black text-blue-900 font-mono text-sm truncate" dir="ltr">{createdCredentials.temporaryPassword}</p>
            </div>
            <button onClick={() => {navigator.clipboard.writeText(createdCredentials.temporaryPassword); toast.success("تم النسخ");}} className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border-none cursor-pointer hover:bg-blue-600 hover:text-white transition-all ml-2"><Copy className="w-4 h-4"/></button>
          </div>
      </div>
      <button onClick={() => setSuccessModalOpen(false)} className="w-full h-14 rounded-2xl bg-[#1e3a8a] text-white font-black border-none cursor-pointer hover:bg-blue-900 transition-all">حسناً، تم الحفظ</button>
    </div>
  </div>
);