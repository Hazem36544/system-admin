import React from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const ChangePasswordForm = ({
  passwords, handlePassChange, formErrors, error, loading,
  showCurrentPassword, setShowCurrentPassword, showNewPassword, setShowNewPassword,
  showConfirmPassword, setShowConfirmPassword, handleKeyPress, handleUpdatePassword
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 relative overflow-hidden border-t-4" style={{ borderColor: '#2c5aa0' }}>
    <div className="flex flex-col items-center mb-6 mt-2">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: '#eef2f7', color: '#2c5aa0' }}>
        <ShieldCheck className="w-7 h-7" />
      </div>
      <h2 className="text-2xl font-bold text-[#2c3e50] mb-2 text-center" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}>تأمين حساب الإدارة</h2>
      <p className="text-center text-[#95a5a6] text-sm font-bold" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}>
        هذا هو تسجيل دخولك الأول، يرجى تغيير كلمة المرور المؤقتة بكلمة مرور خاصة بك للمتابعة.
      </p>
    </div>

    <div className="space-y-6">
      <div style={{ position: 'absolute', opacity: 0, zIndex: -1, width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
        <input type="password" name="fake_admin_pwd" autoComplete="current-password" tabIndex="-1" />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-bold flex items-center gap-2 justify-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="relative">
        <label className="block mb-2 text-[#2c3e50] font-bold text-sm text-right" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}>كلمة المرور الحالية (المؤقتة)</label>
        <div className="relative">
          <input
            type="text" name="ws_curr_pass" autoComplete="off" value={passwords.currentPassword}
            onChange={(e) => handlePassChange('currentPassword', e.target.value)} placeholder="••••••••"
            style={{ WebkitTextSecurity: showCurrentPassword ? 'none' : 'disc' }}
            className={`w-full h-12 pr-4 pl-12 text-sm rounded-lg text-right outline-none transition-all font-mono tracking-widest border ${formErrors.currentPassword ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-400' : 'bg-[#F8F9FA] border-[#E1E8ED] focus:border-[#2c5aa0] focus:ring-1 focus:ring-[#2c5aa0]'}`}
            dir="ltr" disabled={loading} onKeyDown={(e) => handleKeyPress(e, 'change_password')}
          />
          <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#95a5a6] hover:text-[#2c3e50] focus:outline-none bg-transparent border-none cursor-pointer">
            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formErrors.currentPassword && <p className="absolute -bottom-5 right-0 text-red-500 text-[11px] font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formErrors.currentPassword}</p>}
      </div>

      <div className="relative">
        <label className="block mb-2 text-[#2c3e50] font-bold text-sm text-right" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}>كلمة المرور الجديدة</label>
        <div className="relative">
          <input
            type="text" name="ws_new_pass" autoComplete="off" value={passwords.newPassword}
            onChange={(e) => handlePassChange('newPassword', e.target.value)} placeholder="••••••••"
            style={{ WebkitTextSecurity: showNewPassword ? 'none' : 'disc' }}
            className={`w-full h-12 pr-4 pl-12 text-sm rounded-lg text-right outline-none transition-all font-mono tracking-widest border ${formErrors.newPassword ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-400' : 'bg-[#F8F9FA] border-[#E1E8ED] focus:border-[#2c5aa0] focus:ring-1 focus:ring-[#2c5aa0]'}`}
            dir="ltr" disabled={loading} onKeyDown={(e) => handleKeyPress(e, 'change_password')}
          />
          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#95a5a6] hover:text-[#2c3e50] focus:outline-none bg-transparent border-none cursor-pointer">
            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formErrors.newPassword && <p className="absolute -bottom-5 right-0 text-red-500 text-[11px] font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formErrors.newPassword}</p>}
      </div>

      <div className="relative">
        <label className="block mb-2 text-[#2c3e50] font-bold text-sm text-right" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}>تأكيد كلمة المرور</label>
        <div className="relative">
          <input
            type="text" name="ws_conf_pass" autoComplete="off" value={passwords.confirmPassword}
            onChange={(e) => handlePassChange('confirmPassword', e.target.value)} placeholder="••••••••"
            style={{ WebkitTextSecurity: showConfirmPassword ? 'none' : 'disc' }}
            className={`w-full h-12 px-4 text-sm rounded-lg text-right outline-none transition-all font-mono tracking-widest border ${formErrors.confirmPassword ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-400' : 'bg-[#F8F9FA] border-[#E1E8ED] focus:border-[#2c5aa0] focus:ring-1 focus:ring-[#2c5aa0]'}`}
            dir="ltr" disabled={loading} onKeyDown={(e) => handleKeyPress(e, 'change_password')}
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#95a5a6] hover:text-[#2c3e50] focus:outline-none bg-transparent border-none cursor-pointer">
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formErrors.confirmPassword && <p className="absolute -bottom-5 right-0 text-red-500 text-[11px] font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formErrors.confirmPassword}</p>}
      </div>

      <div className="bg-[#F8F9FA] rounded-lg p-4 mt-6 border border-[#E1E8ED]">
        <p className="text-sm font-bold text-[#2c3e50] mb-3" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}>متطلبات كلمة المرور:</p>
        <ul className="space-y-2">
          <li className="flex items-center text-sm font-bold text-[#95a5a6]"><CheckCircle2 className="w-4 h-4 text-green-500 ml-2" /> 6 أحرف على الأقل</li>
          <li className="flex items-center text-sm font-bold text-[#95a5a6]"><CheckCircle2 className="w-4 h-4 text-green-500 ml-2" /> أحرف كبيرة وصغيرة</li>
          <li className="flex items-center text-sm font-bold text-[#95a5a6]"><CheckCircle2 className="w-4 h-4 text-green-500 ml-2" /> رقم واحد على الأقل</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={handleUpdatePassword}
        disabled={loading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
        className="w-full h-12 text-base font-bold rounded-lg mt-8 flex items-center justify-center gap-2 border-none transition-all text-white"
        style={{ background: (loading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) ? '#95a5a6' : '#2c5aa0', cursor: (loading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) ? 'not-allowed' : 'pointer', fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}
      >
        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري التحديث...</> : <><Lock className="w-4 h-4" /> تأكيد وحفظ</>}
      </button>
    </div>
  </div>
);

export default ChangePasswordForm;