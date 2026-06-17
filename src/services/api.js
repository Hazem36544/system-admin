import axios from 'axios';

console.log("Current API URL:", import.meta.env.VITE_API_URL);

/**
 * 1. الإعدادات الأساسية
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'https://wesal.runasp.net'; 

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * 2. Request Interceptor: حقن التوكن في جميع الطلبات
 */
api.interceptors.request.use(
    (config) => {
        // ✅ سحب التوكن الخاص بنظام الإدارة فقط لمنع التداخل مع الأنظمة الأخرى
        const token = sessionStorage.getItem('wesal_admin_token');
                      
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * 3. Response Interceptor: معالجة الأخطاء بشكل موحد
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized access - redirecting to login...");
        }
        
        const serverError = error.response?.data;
        if (serverError) {
            // استخراج رسالة الخطأ من الـ ProblemDetails الخاصة بـ .NET
            const message = serverError.detail || serverError.title || "حدث خطأ في الاتصال بالسيرفر";
            error.message = message;
        }
        return Promise.reject(error);
    }
);

/**
 * --- [ A. خدمات الهوية - Auth ] ---
 */
export const authAPI = {
    loginVisitCenter: (creds) => api.post('/api/auth/visit-center-staff/sign-in', creds),
    loginCourtStaff: (creds) => api.post('/api/auth/court-staff/sign-in', creds),
    loginFamilyCourt: (creds) => api.post('/api/auth/court/sign-in', creds), // ✅ محدث
    loginSchool: (creds) => api.post('/api/auth/school/sign-in', creds),
    loginSystemAdmin: (creds) => api.post('/api/auth/system-admin/sign-in', creds),
    loginParent: (creds) => api.post('/api/auth/parent/sign-in', creds),
    
    // دالة مساعدة للحصول على بيانات المستخدم المحلي
    getCurrentUser: () => {
        const savedUser = sessionStorage.getItem('wesal_admin_user_data');
        return Promise.resolve({ data: savedUser ? JSON.parse(savedUser) : {} });
    }
};

/**
 * --- [ NEW. خدمات المستخدمين - Users ] ---
 */
export const userAPI = {
    changePassword: (data) => api.patch('/api/users/change-password', data),
    
    // مسارات إنشاء مستخدمي النظام من قبل الإدارة
    createCourtStaff: (data) => api.post('/api/users/court-staff', data),
    createFamilyCourt: (data) => api.post('/api/users/courts', data), // ✅ محدث
    createSystemAdmin: (data) => api.post('/api/users/system-admin', data),
    createVisitCenterStaff: (data) => api.post('/api/users/visit-center-staff', data),
};

/**
 * --- [ B. خدمات إدارة القضايا والأسر - Court Workflow ] ---
 */
export const courtAPI = {
    // 1. الأسرة (Families)
    enrollFamily: (data) => api.post('/api/families', data),
    getFamily: (id) => api.get(`/api/families/${id}`),
    searchFamilies: (params) => api.get('/api/courts/me/families', { params }),
    getMyFamilies: () => api.get('/api/families'), 
    
    // إدارة الأبناء داخل الأسرة
    addChild: (familyId, data) => api.post(`/api/families/${familyId}/children`, data),
    removeChild: (familyId, childId) => api.delete(`/api/families/${familyId}/children`, { params: { childId } }),
    
    // 2. أولياء الأمور (Parents)
    updateParent: (id, data) => api.put(`/api/parents/${id}`, data),

    // 3. القضايا (Court Cases)
    createCase: (data) => api.post('/api/court-cases', data),
    listCourtCasesByFamily: (familyId, params) => api.get(`/api/families/${familyId}/court-cases`, { params }),
    closeCase: (caseId, notes) => api.patch(`/api/court-cases/${caseId}/close`, { closureNotes: notes }),

    // 4. النفقة (Alimony)
    createAlimony: (data) => api.post('/api/alimony-schedules', data), // ✅ محدث
    updateAlimony: (id, data) => api.put(`/api/alimony-schedules/${id}`, data), // ✅ محدث
    deleteAlimony: (id) => api.delete(`/api/alimony-schedules/${id}`), // ✅ محدث
    getAlimonyByCourtCase: (caseId) => api.get(`/api/court-cases/${caseId}/alimony-schedule`), // ✅ محدث
    
    // 5. الحضانة (Custody)
    createCustody: (data) => api.post('/api/custodies', data),
    updateCustody: (id, data) => api.put(`/api/custodies/${id}`, data),
    deleteCustody: (id) => api.delete(`/api/custodies/${id}`),
    getCustodyByCourtCase: (caseId) => api.get(`/api/court-cases/${caseId}/custodies`),
    
    // 6. جداول الزيارة (Schedules)
    createSchedule: (data) => api.post('/api/visit-schedules', data), // ✅ محدث
    updateSchedule: (id, data) => api.put(`/api/visit-schedules/${id}`, data), // ✅ محدث
    deleteSchedule: (id) => api.delete(`/api/visit-schedules/${id}`), // ✅ محدث
    getVisitationScheduleByCourtCase: (caseId) => api.get(`/api/court-cases/${caseId}/visit-schedules`), // ✅ محدث

    // 7. المستحقات المالية (Payments Due)
    listPaymentsDueByAlimony: (alimonyId, params) => api.get(`/api/alimony-schedules/${alimonyId}/alimony-dues`, { params }), // ✅ محدث
    listPaymentsHistory: (paymentDueId, params) => api.get(`/api/alimony-schedules/${paymentDueId}/alimony-dues`, { params }), // ✅ محدث (استدعاء المستحقات)
    withdrawPayment: (paymentDueId, data) => api.post(`/api/alimony-dues/${paymentDueId}/withdraw`, data), // ✅ محدث
    initiateAlimonyPayment: (paymentDueId, data) => api.post(`/api/alimony-dues/${paymentDueId}/payments`, data), // ✅ محدث
    
    // جلب بيانات ملف موظف المحكمة
    getProfile: () => api.get('/api/court-staff/me'), // ✅ محدث (بدون s الجمع)
};

/**
 * --- [ C. خدمات البيانات المساعدة - Lookups ] ---
 */
export const lookupAPI = {
    getVisitationLocations: (params) => api.get('/api/visit-centers', { params }), // ✅ محدث
    createLocation: (data) => api.post('/api/visit-centers', data), // ✅ محدث
    updateLocation: (id, data) => api.put(`/api/visit-centers/${id}`, data), // ✅ محدث
    deleteLocation: (id) => api.delete(`/api/visit-centers/${id}`), // ✅ محدث
};

/**
 * --- [ D. خدمات مركز الرؤية - Visitation Execution ] ---
 */
export const visitationAPI = {
    list: (params) => api.get('/api/visit-sessions', { params }), // ✅ محدث
    checkIn: (id, nationalId) => api.patch(`/api/visit-sessions/${id}/check-in`, { nationalId }), // ✅ محدث
    complete: (id) => api.patch(`/api/visit-sessions/${id}/check-out`), // ✅ محدث
    setCompanion: (id, data) => api.patch(`/api/visit-sessions/${id}`, typeof data === 'object' ? data : { companionNationalId: data }), // ✅ محدث
};

/**
 * --- [ E. خدمات المدرسة - Schools ] ---
 */
export const schoolAPI = {
    listSchools: (params) => api.get('/api/schools', { params }),
    registerSchool: (data) => api.post('/api/schools', data),
    listChildren: (params) => api.get('/api/schools/me/children', { params }),
    uploadReport: (formData) => api.post('/api/school-reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    listReports: (childId, params) => api.get(`/api/school-reports/${childId}`, { params }),
};

/**
 * --- [ F. الشكاوى - Complaints ] ---
 */
export const complaintsAPI = {
    create: (data) => api.post('/api/complaints', data),
    listMyComplaints: (params) => api.get('/api/court-staff/me/complaints', { params }), // ✅ محدث
    listComplaintsByFamily: (familyId, params) => api.get(`/api/families/${familyId}/complaints`, { params }),
    updateStatus: (id, data) => api.patch(`/api/complaints/${id}/status`, data),
};

/**
 * --- [ G. التنبيهات والمخالفات - Obligation Alerts ] ---
 */
export const alertsAPI = {
    list: (params) => api.get('/api/court-staff/me/violation-alerts', { params }), // ✅ محدث
    updateStatus: (id, data) => api.patch(`/api/violation-alerts/${id}/status`, data), // ✅ محدث
};

/**
 * --- [ H. طلبات الحضانة - Custody Requests ] ---
 */
export const requestsAPI = {
    list: (params) => api.get('/api/hosting-requests', { params }), // ✅ محدث
    create: (data) => api.post('/api/hosting-requests', data), // ✅ محدث
    process: (id, data) => api.patch(`/api/hosting-requests/${id}/respond`, data), // ✅ محدث (respond)
};

/**
 * --- [ I. الإشعارات والملفات - Common ] ---
 */
export const commonAPI = {
    // المستندات
    uploadDocument: (formData) => api.post('/api/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getDocument: (id) => api.get(`/api/documents/${id}`),
    deleteDocument: (id) => api.delete(`/api/documents/${id}`),

    // الإشعارات
    getUnreadNotificationsCount: () => api.get('/api/notifications/unread-count'),
    listNotifications: (params) => api.get('/api/notifications/me', { params }),
    markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
    
    // الأجهزة
    registerDevice: (data) => api.post('/api/notifications/devices', data),
    unregisterDevice: (token) => api.delete(`/api/user-devices/${token}`),
};

export default api;