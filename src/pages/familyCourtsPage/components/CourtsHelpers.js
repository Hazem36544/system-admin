// دالة لمعالجة الأخطاء
export const safeGetError = (err) => {
    if (typeof err === 'string') return err;
    return err?.response?.data?.detail || err?.response?.data?.title || err?.message || 'حدث خطأ غير متوقع';
};

// مصفوفة المحافظات
export const governoratesList = [
    { ar: "القاهرة", en: "Cairo", code: "02" },
    { ar: "الجيزة", en: "Giza", code: "02" },
    { ar: "الإسكندرية", en: "Alexandria", code: "03" },
    { ar: "القليوبية", en: "Qalyubia", code: "013" },
    { ar: "الدقهلية", en: "Dakahlia", code: "050" },
    { ar: "الشرقية", en: "Sharqia", code: "055" },
    { ar: "الغربية", en: "Gharbia", code: "040" },
    { ar: "المنوفية", en: "Monufia", code: "048" },
    { ar: "البحيرة", en: "Beheira", code: "045" },
    { ar: "كفر الشيخ", en: "Kafr El Sheikh", code: "047" },
    { ar: "دمياط", en: "Damietta", code: "057" },
    { ar: "بورسعيد", en: "Port Said", code: "066" },
    { ar: "الإسماعيلية", en: "Ismailia", code: "064" },
    { ar: "السويس", en: "Suez", code: "062" },
    { ar: "شمال سيناء", en: "North Sinai", code: "068" },
    { ar: "جنوب سيناء", en: "South Sinai", code: "069" },
    { ar: "البحر الأحمر", en: "Red Sea", code: "065" },
    { ar: "مطروح", en: "Matrouh", code: "046" },
    { ar: "الفيوم", en: "Fayoum", code: "084" },
    { ar: "بني سويف", en: "Beni Suef", code: "082" },
    { ar: "المنيا", en: "Minya", code: "086" },
    { ar: "أسيوط", en: "Assiut", code: "088" },
    { ar: "سوهاج", en: "Sohag", code: "093" },
    { ar: "قنا", en: "Qena", code: "096" },
    { ar: "الأقصر", en: "Luxor", code: "095" },
    { ar: "أسوان", en: "Aswan", code: "097" },
    { ar: "الوادي الجديد", en: "New Valley", code: "092" }
];

export const govFilterOptions = [
    { value: 'all', label: 'جميع المحافظات' },
    ...governoratesList.map(g => ({ value: g.en, label: g.ar }))
];

export const translateGov = (enName) => {
    if (!enName) return '';
    const gov = governoratesList.find(g => g.en.toLowerCase() === enName.toLowerCase());
    return gov ? gov.ar : String(enName);
};