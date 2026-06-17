// src/utils/errorHandler.js

export const getErrorMessage = (error) => {
    // 1. التأكد من وجود اتصال بالسيرفر (سقوط السيرفر أو انقطاع الإنترنت)
    if (!error.response || error.code === 'ERR_NETWORK') {
        return "تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت أو حالة الخادم.";
    }

    const { status, data } = error.response;

    // 2. تجميع نصوص الخطأ للبحث عن الرسائل الإنجليزية الثابتة (Identity & Domain Logic)
    const errorText = String(
        data?.detail || data?.title || data?.message || (typeof data === 'string' ? data : "")
    ).toLowerCase();

    // --- أخطاء تسجيل الدخول (مشتركة) ---
    if (errorText.includes("credentials are invalid") || errorText.includes("invalid credentials")) {
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    }
    if (errorText.includes("locked out") || errorText.includes("lockout")) {
        return "تم قفل الحساب مؤقتاً لكثرة المحاولات الخاطئة، يرجى المحاولة لاحقاً.";
    }
    if (errorText.includes("temporary password") || errorText.includes("change password")) {
        return "يجب تأمين حسابك بكلمة مرور جديدة قبل الدخول.";
    }

    // --- أخطاء مركز الرؤية (Visitation Logic) ---
    if (errorText.includes("already checked in") || errorText.includes("already checked-in")) {
        return "تم تسجيل الحضور لهذا الشخص مسبقاً.";
    }
    if (errorText.includes("already completed") || errorText.includes("is completed")) {
        return "هذه الزيارة مكتملة بالفعل ولا يمكن التعديل عليها.";
    }
    if (errorText.includes("invalid national id") || errorText.includes("nationalid mismatch") || errorText.includes("not match")) {
        return "الرقم القومي المدخل غير متطابق مع بيانات الزيارة.";
    }

    // --- أخطاء نظام الأدمن (Admin / Entities Creation Logic) ---
    if (errorText.includes("already exists") || errorText.includes("is already taken")) {
        if (errorText.includes("email")) return "البريد الإلكتروني مسجل بالفعل في النظام.";
        if (errorText.includes("username")) return "اسم المستخدم هذا مسجل بالفعل.";
        if (errorText.includes("national id") || errorText.includes("nationalid")) return "الرقم القومي مسجل مسبقاً في النظام.";
        return "هذه البيانات مسجلة بالفعل في النظام، يرجى التحقق منها.";
    }
    if (errorText.includes("invalid role") || errorText.includes("role does not exist")) {
        return "الصلاحية المحددة غير موجودة في النظام.";
    }
    if (errorText.includes("not found") && errorText.includes("location")) {
         return "لم يتم العثور على مكان الرؤية المحدد لربطه بالموظف.";
    }
    if (errorText.includes("not found") && errorText.includes("court")) {
         return "لم يتم العثور على المحكمة المحددة.";
    }

    // 3. قراءة رسائل الخطأ التفصيلية من الباك إند (Validation Errors من FluentValidation)
    if (data) {
        if (data.errors && typeof data.errors === 'object') {
            const firstErrorKey = Object.keys(data.errors)[0];
            if (Array.isArray(data.errors[firstErrorKey]) && data.errors[firstErrorKey].length > 0) {
                return data.errors[firstErrorKey][0]; 
            }
        }
    }

    // 4. معالجة أكواد الخطأ الأساسية (Fallbacks)
    if (status === 400) return data?.detail || data?.title || "بيانات غير صالحة، يرجى مراجعة المدخلات.";
    if (status === 401) return "الجلسة انتهت أو بيانات الدخول غير صحيحة.";
    if (status === 403) return "لا تملك الصلاحيات الكافية لإجراء هذه العملية، أو أن العملية غير مسموحة حالياً.";
    if (status === 404) return "البيانات المطلوبة غير موجودة في النظام.";
    if (status === 409) return "يوجد تعارض: هذه البيانات (البريد أو الرقم القومي أو الاسم) مسجلة بالفعل.";

    // 5. عرض الرسالة المخصصة من الباك إند (لو لم يتم اصطيادها في الشروط السابقة)
    if (data?.detail) return data.detail;
    if (data?.title) return data.title;

    // 6. رسالة افتراضية لأي خطأ غير معروف
    return "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.";
};