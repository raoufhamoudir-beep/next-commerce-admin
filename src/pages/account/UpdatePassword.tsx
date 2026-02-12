import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';

// UI Components
import BoxCard from '@/components/ui/BoxCard';
import PageContainer from '@/components/ui/PageContainer';

// Hooks
import { useUpdatePassword } from '@/features/auth/hooks/useAuthMutations';

const UpdatePassword = () => {
const { t, i18n } = useTranslation("account");
  const isRtl = i18n.language === 'ar';  
  // Use a specific hook for password changes (see below)
  const { mutate: changePassword, isPending } = useUpdatePassword();

  // State for form fields
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Simple validation
  const passwordsMatch = form.newPassword === form.confirmPassword;
  const isLengthValid = form.newPassword.length >= 8;
  const isFormValid = 
    form.currentPassword.length > 0 && 
    isLengthValid && 
    passwordsMatch;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword
    });
    
    // Optional: Reset form on success (handled in hook usually)
  };

return (
    <PageContainer title={t("Modify")} about={t("passwordSecurity")}>
      <BoxCard
      about=''
      className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        
        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            {t("CurrentPassword")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
            {/* تعديل مكان العين بناءً على اللغة */}
            <button 
              onClick={() => toggleVisibility('current')}
              className={`absolute top-2.5 text-gray-400 hover:text-gray-600 ${isRtl ? "left-3" : "right-3"}`}
            >
              {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
  <hr className="border-gray-100" />



        {/* 2. New Password */}

        <div className="space-y-1.5">

          <label className="block text-sm font-semibold text-gray-700">

            {t("NewPassword")}

          </label>

          <div className="relative">

            <input

              type={showPassword.new ? "text" : "password"}

              name="newPassword"

              value={form.newPassword}

              onChange={handleChange}

              placeholder={t("Min8Chars")}

              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"

            />

             <button

              onClick={() => toggleVisibility('new')}

              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"

            >

              {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}

            </button>

          </div>

        </div>



        {/* 3. Confirm New Password */}

        <div className="space-y-1.5">

          <label className="block text-sm font-semibold text-gray-700">

            {t("ConfirmNewPassword")}

          </label>

          <div className="relative">

            <input

              type={showPassword.confirm ? "text" : "password"}

              name="confirmPassword"

              value={form.confirmPassword}

              onChange={handleChange}

              placeholder="••••••••"

              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${

                !passwordsMatch && form.confirmPassword

                  ? "border-red-300 focus:ring-red-200"

                  : "border-gray-300 focus:ring-teal-500"

              }`}

            />

             <button

              onClick={() => toggleVisibility('confirm')}

              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"

            >

              {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}

            </button>

          </div>

         

          {/* Validation Feedback */}

          {!passwordsMatch && form.confirmPassword && (

             <p className="text-xs text-red-500 mt-1">{t("PasswordsDoNotMatch")}</p>

          )}

        </div>


        {/* ... (New Password & Confirm بنفس منطق الأيقونة أعلاه) */}
        
        {/* Action Button */}
        <button
          disabled={!isFormValid || isPending}
          onClick={handleSubmit}
          className={`w-full flex justify-center items-center py-2.5 rounded-xl text-white font-medium transition-all duration-200
            ${!isFormValid || isPending ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 shadow-md"}
          `}
        >
          {isPending ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
              <Lock size={18} />
              <span>{t("UpdatePassword")}</span>
            </div>
          )}
        </button>
      </BoxCard>
    </PageContainer>
  );
};

export default UpdatePassword;