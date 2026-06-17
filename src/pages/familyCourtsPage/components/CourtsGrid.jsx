import React from 'react';
import { Loader2, Scale, Plus, Search, X, Eye, MapPin, Phone, ChevronDown } from 'lucide-react';
import { translateGov } from './CourtsHelpers';

const CourtsGrid = ({
  pageLoading, courtsLength, filteredCourts, visibleCount, searchTerm, 
  setIsAddModalOpen, clearSearch, openDetails, handleLoadMore
}) => {
  
  if (pageLoading) {
    return (
      <div className="flex flex-col items-center py-32 text-[#1e3a8a]">
        <Loader2 className="w-16 h-16 animate-spin mb-4" />
        <span className="font-bold">جاري تحميل السجل...</span>
      </div>
    );
  }

  if (courtsLength === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-400">
         <Scale className="w-16 h-16 opacity-30 mb-4 text-[#1e3a8a]" />
         <p className="font-bold text-xl text-gray-800">لا توجد محاكم مسجلة</p>
         <p className="text-sm font-bold text-gray-500 mt-2 mb-8">قم بتسجيل أول محكمة أسرة في النظام الآن.</p>
         <button onClick={() => setIsAddModalOpen(true)} className="bg-[#1e3a8a] text-white hover:bg-blue-800 rounded-xl h-12 px-6 font-bold shadow-sm border-none outline-none cursor-pointer flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> تسجيل محكمة جديدة</button>
      </div>
    );
  }

  if (filteredCourts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-red-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in duration-300">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Search className="w-12 h-12 text-red-400" />
          </div>
          <p className="font-black text-2xl text-gray-800 mb-2">عذراً، لا توجد نتائج!</p>
          <p className="text-sm font-bold text-gray-500 mb-8 max-w-md text-center leading-relaxed">
            لم نتمكن من العثور على أي نتائج تطابق {searchTerm ? `"${searchTerm}"` : "الفلتر المحدد"}. يرجى المحاولة بكلمة أخرى أو إعادة الضبط.
          </p>
          <button onClick={clearSearch} className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-8 h-12 font-bold flex items-center gap-2 transition-all outline-none cursor-pointer shadow-sm active:scale-95">
             <X className="w-5 h-5 text-gray-400" /> مسح البحث وإعادة الضبط
          </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourts.slice(0, visibleCount).map(court => (
          <div 
            key={court.id} 
            onClick={() => openDetails(court)}
            className="group bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-br-full -translate-x-12 -translate-y-12 opacity-60 pointer-events-none transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-14 h-14 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-all shadow-inner shrink-0">
                <Scale className="w-7 h-7" />
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400 group-hover:text-[#1e3a8a]" />
                <span className="text-xs font-black text-gray-500 group-hover:text-[#1e3a8a]">التفاصيل</span>
              </div>
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-5 line-clamp-2 leading-tight h-14 group-hover:text-[#1e3a8a] transition-colors">{court.name}</h3>
            <div className="space-y-3 relative z-10 mt-auto">
              <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-50 group-hover:bg-white transition-all">
                <MapPin className="w-4 h-4 text-[#1e3a8a] shrink-0" />
                <span className="text-xs font-bold text-gray-600 line-clamp-1">{translateGov(court.governorate)} - {court.address}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-50 group-hover:bg-white transition-all">
                <Phone className="w-4 h-4 text-[#1e3a8a] shrink-0" />
                <span className="text-xs font-black text-gray-600 font-mono" dir="ltr">{court.contactInfo || '---'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredCourts.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3.5 bg-white border-2 border-blue-100 text-[#1e3a8a] rounded-2xl font-bold shadow-sm hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-2 outline-none active:scale-95"
          >
            <ChevronDown className="w-5 h-5" /> عرض المزيد
          </button>
        </div>
      )}
    </>
  );
};

export default CourtsGrid;