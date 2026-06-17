import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api'; 
import { toast } from 'react-hot-toast';

import { safeGetError, governoratesList, govFilterOptions, translateGov } from './components/CourtsHelpers';
import CourtsHeader from './components/CourtsHeader';
import CourtsFilterBar from './components/CourtsFilterBar';
import CourtsGrid from './components/CourtsGrid';
import { AddCourtModal, CourtDetailsModal, DeleteConfirmModal, SuccessModal } from './components/CourtsModals';

const FamilyCourtsPage = () => {
  const [courts, setCourts] = useState([]);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ================= STATES Client-Side Pagination =================
  const [visibleCount, setVisibleCount] = useState(9); 

  // ================= STATES الفلتر والبحث =================
  const [searchTerm, setSearchTerm] = useState('');
  const [govFilter, setGovFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [govSearchTerm, setGovSearchTerm] = useState('');
  const [highlightedFilterIndex, setHighlightedFilterIndex] = useState(-1);
  const filterRef = useRef(null);

  // ================= STATES الإضافة =================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', governorate: '', address: '', email: '', contactInfo: '' });
  const [phoneType, setPhoneType] = useState('mobile'); 
  const [formErrors, setFormErrors] = useState({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formSearchTerm, setFormSearchTerm] = useState(''); 
  const [highlightedIndex, setHighlightedIndex] = useState(-1); 
  const dropdownRef = useRef(null);
  const listRef = useRef(null); 

  // ================= STATES التفاصيل والتعديل والحذف =================
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [editPhoneType, setEditPhoneType] = useState('mobile'); 
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // States الخاص بدروب داون التعديل
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const [editFormSearchTerm, setEditFormSearchTerm] = useState('');
  const editDropdownRef = useRef(null);

  const filteredGovernorates = governoratesList.filter(gov => gov.ar.includes(formSearchTerm));
  const filteredEditGovernorates = governoratesList.filter(gov => gov.ar.includes(editFormSearchTerm));
  
  const selectedGovCode = governoratesList.find(g => g.en === formData.governorate)?.code || '';
  const expectedLandlineLength = selectedGovCode.length === 2 ? 8 : 7;

  // ================= EFFECTS =================
  useEffect(() => {
    fetchCourts();
    const timer = setTimeout(() => setIsPageLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const fetchCourts = async () => {
    setPageLoading(true);
    try {
      const res = await api.get('/api/courts', { params: { PageNumber: 1, PageSize: 1000 } });
      setCourts(res.data?.items || []);
    } catch (err) {
      toast.error(safeGetError(err));
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterOpen(false);
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        if (!formData.governorate) {
          setFormSearchTerm('');
        } else {
          const selected = governoratesList.find(g => g.en === formData.governorate);
          if (selected) setFormSearchTerm(selected.ar);
        }
      }

      if (editDropdownRef.current && !editDropdownRef.current.contains(event.target)) {
        setIsEditDropdownOpen(false);
        if (!editFormData.governorate) {
          setEditFormSearchTerm('');
        } else {
          const selected = governoratesList.find(g => g.en === editFormData.governorate);
          if (selected) setEditFormSearchTerm(selected.ar);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [formData.governorate, editFormData.governorate]);

  useEffect(() => {
    let result = courts;
    if (govFilter !== 'all') {
      result = result.filter(c => c.governorate?.toLowerCase() === govFilter.toLowerCase());
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(c => 
        (c.name && c.name.toLowerCase().includes(term)) || 
        (c.governorate && translateGov(c.governorate).includes(term))
      );
    }
    setFilteredCourts(result);
    setVisibleCount(9); 
  }, [searchTerm, govFilter, courts]);

  const clearSearch = () => { 
    setSearchTerm(''); setGovFilter('all'); setGovSearchTerm(''); setVisibleCount(9); 
  };
  const handleLoadMore = () => setVisibleCount(prev => prev + 9);

  const activeGovOptions = [
    { value: 'all', label: 'جميع المحافظات' },
    ...governoratesList.filter(g => g.ar.includes(govSearchTerm)).map(g => ({ value: g.en, label: g.ar }))
  ];

  const handleFilterKeyDown = (e) => {
    if (!isFilterOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedFilterIndex(prev => (prev < activeGovOptions.length - 1 ? prev + 1 : prev)); } 
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedFilterIndex(prev => (prev > 0 ? prev - 1 : prev)); } 
    else if (e.key === 'Enter' && highlightedFilterIndex >= 0) { setGovFilter(activeGovOptions[highlightedFilterIndex].value); setIsFilterOpen(false); } 
    else if (e.key === 'Escape') { setIsFilterOpen(false); }
  };

  const validateAddForm = () => {
    let errs = {};
    if (!formData.name.trim()) errs.name = "مطلوب";
    if (!formData.governorate) errs.governorate = "مطلوب";
    if (!formData.address.trim()) errs.address = "مطلوب";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "بريد غير صحيح";
    
    if (phoneType === 'mobile') {
      if (!/^01[0125]\d{8}$/.test(formData.contactInfo)) errs.contactInfo = "11 رقم (01)";
    } else {
      if (!selectedGovCode) errs.contactInfo = "اختر محافظة";
      else if (formData.contactInfo.length !== expectedLandlineLength) errs.contactInfo = `مطلوب ${expectedLandlineLength} أرقام`;
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddCourt = async (e) => {
    e.preventDefault();
    if (!validateAddForm()) return;
    setActionLoading(true);
    try {
      const finalPhone = phoneType === 'landline' ? `${selectedGovCode}${formData.contactInfo}` : formData.contactInfo;
      const res = await api.post('/api/users/courts', { ...formData, contactInfo: finalPhone });
      setCreatedCredentials({ username: formData.email, temporaryPassword: res.data.temporaryPassword });
      setIsAddModalOpen(false);
      setSuccessModalOpen(true);
      
      setFormData({ name: '', governorate: '', address: '', email: '', contactInfo: '' });
      setFormSearchTerm('');
      setPhoneType('mobile');
      setFormErrors({});
      fetchCourts(); 
    } catch (err) { toast.error(safeGetError(err)); }
    finally { setActionLoading(false); }
  };

  const handleSelectGovernorate = (gov) => {
    setFormData({ ...formData, governorate: gov.en });
    setFormSearchTerm(gov.ar); 
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    if (formErrors.governorate) setFormErrors({ ...formErrors, governorate: null });
  };

  const openDetails = (court) => {
    let initialPhoneType = 'mobile';
    let initialContactInfo = court.contactInfo || '';
    const govCode = governoratesList.find(g => g.en === court.governorate)?.code || '';

    if (initialContactInfo && !initialContactInfo.startsWith('01') && govCode && initialContactInfo.startsWith(govCode)) {
      initialPhoneType = 'landline';
      initialContactInfo = initialContactInfo.substring(govCode.length);
    } else if (initialContactInfo && initialContactInfo.startsWith('01') && initialContactInfo.length === 11) {
      initialPhoneType = 'mobile';
    }

    setSelectedCourt(court);
    setIsEditing(false);
    setEditPhoneType(initialPhoneType);
    setEditFormData({
      name: court.name || '', governorate: court.governorate || '', address: court.address || '',
      email: court.email || '', contactInfo: initialContactInfo
    });
    setEditFormSearchTerm(translateGov(court.governorate));
  };

  const handleEditSelectGovernorate = (gov) => {
    setEditFormData({ ...editFormData, governorate: gov.en });
    setEditFormSearchTerm(gov.ar); 
    setIsEditDropdownOpen(false);
  };

  const handleUpdate = async () => {
    if (!editFormData.name.trim() || !editFormData.address.trim() || !editFormData.contactInfo.trim() || !editFormData.email.trim()) return toast.error("يرجى إكمال جميع الحقول الإجبارية");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) return toast.error("البريد الإلكتروني غير صحيح");

    const editGovCode = governoratesList.find(g => g.en === editFormData.governorate)?.code || '';
    const expectedEditLandlineLength = editGovCode.length === 2 ? 8 : 7;

    if (editPhoneType === 'mobile') {
      if (!/^01[0125]\d{8}$/.test(editFormData.contactInfo)) return toast.error("رقم الموبايل غير صحيح (11 رقم)");
    } else {
      if (!editGovCode) return toast.error("اختر المحافظة أولاً");
      if (editFormData.contactInfo.length !== expectedEditLandlineLength) return toast.error(`الرقم الأرضي يجب أن يكون ${expectedEditLandlineLength} أرقام`);
    }

    setIsUpdating(true);
    try {
      const finalPhone = editPhoneType === 'landline' ? `${editGovCode}${editFormData.contactInfo}` : editFormData.contactInfo;
      const payload = { ...editFormData, contactInfo: finalPhone };

      await api.put(`/api/courts/${selectedCourt.id}`, payload);
      toast.success("تم تحديث بيانات المحكمة بنجاح");
      setIsEditing(false);
      setSelectedCourt({ ...selectedCourt, ...payload });
      fetchCourts(); 
    } catch (err) { toast.error(safeGetError(err)); }
    finally { setIsUpdating(false); }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/courts/${selectedCourt.id}`);
      toast.success("تم حذف المحكمة بنجاح");
      setIsDeleteConfirmOpen(false);
      setSelectedCourt(null);
      fetchCourts(); 
    } catch (err) { toast.error(safeGetError(err)); }
    finally { setIsDeleting(false); }
  };

  return (
    <div className="w-full font-sans bg-[#f8fafc] min-h-screen pb-20" dir="rtl">
      <div className={`max-w-7xl mx-auto px-4 md:px-6 transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        
        <CourtsHeader />
        
        <CourtsFilterBar 
          courtsCount={courts.length} setIsAddModalOpen={setIsAddModalOpen} filterRef={filterRef} 
          handleFilterKeyDown={handleFilterKeyDown} isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} 
          govFilter={govFilter} setGovFilter={setGovFilter} govSearchTerm={govSearchTerm} 
          setGovSearchTerm={setGovSearchTerm} highlightedFilterIndex={highlightedFilterIndex} 
          setHighlightedFilterIndex={setHighlightedFilterIndex} activeGovOptions={activeGovOptions} 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm} clearSearch={clearSearch} 
        />

        <CourtsGrid 
          pageLoading={pageLoading} courtsLength={courts.length} filteredCourts={filteredCourts} 
          visibleCount={visibleCount} searchTerm={searchTerm} setIsAddModalOpen={setIsAddModalOpen} 
          clearSearch={clearSearch} openDetails={openDetails} handleLoadMore={handleLoadMore} 
        />

      </div>

      {isAddModalOpen && (
        <AddCourtModal 
          setIsAddModalOpen={setIsAddModalOpen} handleAddCourt={handleAddCourt} formData={formData} 
          setFormData={setFormData} formErrors={formErrors} setFormErrors={setFormErrors} 
          dropdownRef={dropdownRef} formSearchTerm={formSearchTerm} setFormSearchTerm={setFormSearchTerm} 
          isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} highlightedIndex={highlightedIndex} 
          setHighlightedIndex={setHighlightedIndex} handleSelectGovernorate={handleSelectGovernorate} 
          filteredGovernorates={filteredGovernorates} phoneType={phoneType} setPhoneType={setPhoneType} 
          selectedGovCode={selectedGovCode} expectedLandlineLength={expectedLandlineLength} 
          actionLoading={actionLoading} listRef={listRef} 
        />
      )}

      {selectedCourt && (
        <CourtDetailsModal 
          selectedCourt={selectedCourt} setSelectedCourt={setSelectedCourt} isEditing={isEditing} 
          setIsEditing={setIsEditing} setIsDeleteConfirmOpen={setIsDeleteConfirmOpen} editFormData={editFormData} 
          setEditFormData={setEditFormData} editDropdownRef={editDropdownRef} editFormSearchTerm={editFormSearchTerm} 
          setEditFormSearchTerm={setEditFormSearchTerm} isEditDropdownOpen={isEditDropdownOpen} 
          setIsEditDropdownOpen={setIsEditDropdownOpen} filteredEditGovernorates={filteredEditGovernorates} 
          handleEditSelectGovernorate={handleEditSelectGovernorate} editPhoneType={editPhoneType} 
          setEditPhoneType={setEditPhoneType} governoratesList={governoratesList} translateGov={translateGov} 
          handleUpdate={handleUpdate} isUpdating={isUpdating} 
        />
      )}

      {isDeleteConfirmOpen && (
        <DeleteConfirmModal 
          isDeleteConfirmOpen={isDeleteConfirmOpen} setIsDeleteConfirmOpen={setIsDeleteConfirmOpen} 
          selectedCourt={selectedCourt} handleDelete={handleDelete} isDeleting={isDeleting} 
        />
      )}

      {successModalOpen && createdCredentials && (
        <SuccessModal 
          createdCredentials={createdCredentials} setSuccessModalOpen={setSuccessModalOpen} 
        />
      )}

    </div>
  );
};

export default FamilyCourtsPage;