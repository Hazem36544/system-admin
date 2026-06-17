import React from 'react';

export const AdminHeader = () => (
  <>
    <div className="flex justify-center mb-6">
      <div className="w-32 h-32">
        <img
          src={`${import.meta.env.BASE_URL}logo.svg`}
          alt="شعار وصال"
          className="w-full h-full object-contain"
          onError={(e) => { e.target.src = 'https://placehold.co/128x128/1e3a8a/ffffff?text=Admin'; }}
        />
      </div>
    </div>
    <div className="text-center mb-3">
      <h1 className="text-3xl font-black text-[#2c3e50] mb-2 tracking-tight" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}>نظام الإدارة العليا</h1>
      <p className="text-sm font-bold text-[#95a5a6] tracking-wider" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}>مشروع وصال - وزارة العدل</p>
    </div>
  </>
);

export const AdminFooter = () => (
  <div className="text-center">
    <p className="text-sm text-[#95a5a6] font-bold" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}>
      آمن ومعتمد من قبل وزارة العدل
    </p>
  </div>
);