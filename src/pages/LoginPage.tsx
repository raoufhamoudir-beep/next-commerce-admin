import { loginSchema, type LoginFormValues } from "@/features/auth/types/schema";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation("auth"); // i18n is useful for checking language direction

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      
      if (res.data?._id) {
        toast.success(t('success_login')); // استخدام الترجمة هنا
        window.location.replace("/"); 
      } else {
        toast.error(t('error_invalid_credentials')); // وهنا
      }
    } catch (e) {
      toast.error(t('error_server')); // وهنا
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // تغيير الاتجاه بناء على اللغة الحالية
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-8 md:flex-row md:gap-16">
      <Toaster position="top-center" />
      
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="hidden max-w-sm md:block">
         <img src="/logo.png" alt={t('mascot_alt')} className="rounded-full shadow-2xl" style={{ boxShadow: "0 0 40px rgba(139, 92, 246, 0.5)" }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl mt-5 md:mt-0"
      >
        <h2 className="mb-2 text-center text-4xl font-extrabold text-purple-600 drop-shadow-md">
            {t('login_title')}
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500">
            {t('welcome_msg')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              {...register("email")}
              type="email"
              placeholder={t('email_placeholder')}
              className={`w-full rounded-xl border px-6 py-3 shadow-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <input
              {...register("password")}
              type="password"
              placeholder={t('password_placeholder')}
              className={`w-full rounded-xl border px-6 py-3 shadow-sm focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <motion.button
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-xl bg-purple-600 py-3 font-semibold text-white shadow-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : t('login_button')}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
           <Link to="/forgot-password" className="text-teal-500 hover:underline">{t('forgot_password')}</Link>
           <br />
           <span className="mt-2 block">
             {t('no_account')} <Link to="/register" className="text-teal-500 hover:underline">{t('register_now')}</Link>
           </span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;