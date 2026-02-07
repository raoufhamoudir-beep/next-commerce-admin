import { registerSchema, type RegisterFormValues } from "@/features/auth/types/schema";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next"; // 1. Import hook
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const { t, i18n } = useTranslation("auth"); // 2. Initialize translation

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreedToTerms: false },
    mode: "onChange" 
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsRegistering(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };

      const res = await api.post("/auth/register", payload);

      if (res.data?.good || res.data?._id) {
        toast.success(t('success_register')); // Translated Toast
        navigate("/");
      } else {
        toast.error(t('error_generic_register')); // Translated Toast
      }
    } catch (e) {
       toast.error(t('error_server')); // Reusing key from login page!
    } finally {
      setIsRegistering(false);
    }
  };

  const inputClassName = (hasError: boolean) => `
    w-full rounded-xl border px-6 py-3 shadow-sm transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-teal-500
    ${hasError 
      ? 'border-red-500 text-red-900 focus:ring-red-500 placeholder-red-300' 
      : 'border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:bg-white'}
  `;

  // دالة لتغيير اللغة عند الضغط على الكرة الأرضية
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    // ضبط الاتجاه ديناميكياً
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 md:flex-row md:gap-16">
      <Toaster position="top-center" />
      
      {/* --- Language/Global Icon --- */}
      <div className="fixed top-5 left-5 z-50 cursor-pointer" onClick={toggleLanguage}>
         <Globe size={30} className="text-teal-600 hover:rotate-12 transition-transform duration-300" />
      </div>

      {/* --- Left Side: Mascot --- */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.8 }}
        className="hidden max-w-sm md:block"
      >
         <img 
            src="/logo.png" 
            alt={t('mascot_alt')} // Reused from login
            className="rounded-full shadow-2xl transition-transform hover:scale-105 duration-500" 
            style={{ boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)" }} 
         />
      </motion.div>

      {/* --- Right Side: Form Container --- */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl md:mt-0"
      >
        <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
            src="/logo.png"
            className="mx-auto w-24 h-24 -mt-16 mb-6 block rounded-full drop-shadow-lg md:hidden bg-white p-1"
        />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               
               {/* Header Section */}
               <div className="text-center mb-8">
                 <h2 className="mb-2 text-3xl font-extrabold text-purple-600 drop-shadow-sm">{t('register_title')}</h2>
                 <p className="text-sm text-gray-500">{t('register_subtitle')}</p>
               </div>
               
               {/* Inputs Section */}
               <div className="space-y-4">
                 {/* Name */}
                 <div>
                   <input 
                     {...register("name")} 
                     placeholder={t('fullname_placeholder')} 
                     className={inputClassName(!!errors.name)} 
                   />
                   {errors.name && <p className="text-red-500 text-xs mt-1 px-2 font-medium">{errors.name.message}</p>}
                 </div>

                 {/* Phone */}
                 <div>
                   <input 
                     {...register("phone")} 
                     placeholder={t('phone_placeholder')} 
                     className={inputClassName(!!errors.phone)} 
                   />
                   {errors.phone && <p className="text-red-500 text-xs mt-1 px-2 font-medium">{errors.phone.message}</p>}
                 </div>

                 {/* Email (Reusing key from login) */}
                 <div>
                   <input 
                     {...register("email")} 
                     placeholder={t('email_placeholder')} 
                     className={inputClassName(!!errors.email)} 
                   />
                   {errors.email && <p className="text-red-500 text-xs mt-1 px-2 font-medium">{errors.email.message}</p>}
                 </div>

                 {/* Password (Reusing key from login) */}
                 <div>
                   <input 
                     {...register("password")} 
                     type="password" 
                     placeholder={t('password_placeholder')} 
                     className={inputClassName(!!errors.password)} 
                   />
                   {errors.password && <p className="text-red-500 text-xs mt-1 px-2 font-medium">{errors.password.message}</p>}
                 </div>

                 {/* Confirm Password */}
                 <div>
                   <input 
                     {...register("confirmPassword")} 
                     type="password" 
                     placeholder={t('confirm_password_placeholder')} 
                     className={inputClassName(!!errors.confirmPassword)} 
                   />
                   {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 px-2 font-medium">{errors.confirmPassword.message}</p>}
                 </div>
               </div>

               {/* Terms & Conditions */}
               <div className="flex items-center gap-3 mt-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <input 
                    type="checkbox" 
                    {...register("agreedToTerms")} 
                    id="terms" 
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300 cursor-pointer" 
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
                      {t('agree_to')} <Link to="/terms" className="text-teal-600 hover:text-teal-700 hover:underline font-semibold">{t('terms_and_conditions')}</Link>
                  </label>
               </div>
               {errors.agreedToTerms && <p className="text-red-500 text-xs mt-1 px-2 font-medium">{errors.agreedToTerms.message}</p>}

               {/* Submit Button */}
               <motion.button 
                  type="submit" 
                  disabled={isRegistering} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 py-3.5 font-bold text-white shadow-lg transition duration-300 hover:shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {isRegistering ? <Loader2 className="animate-spin mx-auto h-6 w-6" /> : t('create_account_button')}
               </motion.button>

            </motion.div>
        </form>
        
        {/* Footer Link */}
        <div className="mt-8 text-center text-sm text-gray-500">
           <span className="block">
               {t('already_have_account')} <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors">{t('login_link')}</Link>
           </span>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;