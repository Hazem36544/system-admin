import React from 'react';
import { Building2, Plus, Filter, ChevronDown, Search, CheckCircle, X } from 'lucide-react';
import { govFilterOptions } from './CourtsHelpers';

const CourtsFilterBar = ({
  courtsCount, setIsAddModalOpen, filterRef, handleFilterKeyDown, isFilterOpen, setIsFilterOpen,
  govFilter, setGovFilter, govSearchTerm, setGovSearchTerm, highlightedFilterIndex, setHighlightedFilterIndex,
  activeGovOptions, searchTerm, setSearchTerm, clearSearch
}) => {
  return (
    <div className="bg-white p-5 md:p-7 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 w-full border-b border-gray-50 pb-5 gap-4">
        <div className="flex items-center gap-4 order-1">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-[11px] font-black uppercase tracking-widest mb-0.5">إجمالي المحاكم</p>
            <p className="text-2xl font-black text-gray-800 font-mono leading-none">{courtsCount}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="w-full sm:w-auto h-12 md:h-14 px-8 bg-green-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-md hover:bg-green-700 transition-all border-none cursor-pointer whitespace-nowrap order-2 active:scale-95 shrink-0 outline-none"
        >
          <Plus className="w-5 h-5" /> تسجيل محكمة جديدة
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-center w-full">
        <div className="w-full md:w-72 shrink-0 relative order-1" ref={filterRef} onKeyDown={handleFilterKeyDown}>
          <div 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            tabIndex={0}
            className={`h-12 md:h-14 px-5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all outline-none ${isFilterOpen ? 'bg-white ring-2 ring-[#1e3a8a] border-transparent shadow-sm' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300 focus:bg-white focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent shadow-sm'}`}
          >
            <div className="flex items-center gap-3">
              <Filter className={`w-5 h-5 ${isFilterOpen ? 'text-[#1e3a8a]' : 'text-gray-400 group-hover:text-gray-500'}`} />
              <span className="font-bold text-gray-700 text-sm md:text-base">{govFilterOptions.find(o => o.value === govFilter)?.label || 'الكل'}</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isFilterOpen ? 'rotate-180 text-[#1e3a8a]' : 'text-gray-400'}`} />
          </div>

          {isFilterOpen && (
            <div className="absolute top-[calc(100%+10px)] right-0 w-full bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl z-[80] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="ابحث عن محافظة..." 
                    className="w-full pr-9 pl-3 h-10 rounded-xl border-none bg-white text-sm font-bold shadow-inner focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                    value={govSearchTerm}
                    onChange={(e) => { setGovSearchTerm(e.target.value); setHighlightedFilterIndex(0); }}
                  />
                </div>
              </div>
              <ul className="max-h-64 overflow-y-auto py-2 custom-scrollbar m-0 list-none">
                {activeGovOptions.map((opt, idx) => (
                  <li 
                    key={opt.value}
                    onClick={() => { 
                      setGovFilter(opt.value); 
                      setIsFilterOpen(false); 
                      setGovSearchTerm(''); 
                    }}
                    onMouseEnter={() => setHighlightedFilterIndex(idx)}
                    className={`px-4 py-3 text-sm font-bold cursor-pointer transition-all flex justify-between items-center ${govFilter === opt.value ? 'bg-blue-50 text-[#1e3a8a]' : highlightedFilterIndex === idx ? 'bg-gray-50 text-[#1e3a8a]' : 'text-gray-600'}`}
                  >
                    {opt.label}
                    {govFilter === opt.value && <CheckCircle className="w-4 h-4 text-[#1e3a8a]" />}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1 relative w-full group order-2">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-[#1e3a8a] transition-colors pointer-events-none" />
          <input 
            type="text" 
            placeholder="البحث عن محكمة بالاسم أو المحافظة..." 
            className="w-full pr-12 pl-12 h-12 md:h-14 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-transparent focus:ring-2 focus:ring-[#1e3a8a] text-right font-bold text-sm md:text-base shadow-sm transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {(searchTerm || govFilter !== 'all') && (
            <button onClick={clearSearch} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 border-none cursor-pointer transition-transform hover:scale-110 active:scale-90 outline-none">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourtsFilterBar;