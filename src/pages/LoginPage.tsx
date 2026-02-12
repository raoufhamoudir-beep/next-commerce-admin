import { loginSchema, type LoginFormValues } from "@/features/auth/types/schema";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation("auth");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      
      if (res.data?._id) {
        toast.success(t('success_login'));
        window.location.replace("/"); 
      } else {
        toast.error(t('error_invalid_credentials'));
      }
    } catch (e) {
      toast.error(t('error_server'));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

 

  return (
    <div 
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      <Toaster position="top-center" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300/40 rounded-full blur-3xl"
        />
      </div>

      {/* Decorative Dots Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Illustration & Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex flex-col items-center justify-center space-y-8"
          >
            <motion.div  animate="animate" className="relative">
              <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Animated Rings */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-purple-300/40"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 rounded-full border-2 border-blue-300/40"
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-16 rounded-full border-2 border-pink-300/40"
                />
                
                {/* Center Icon */}
                <div className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-2xl shadow-purple-300/50">
                  <Sparkles className="w-20 h-20 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div className="text-center space-y-4 max-w-md">
              <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                مرحباً بعودتك
              </h1>
              <p className="text-xl text-gray-600">
                ابدأ رحلتك في إدارة متجرك الإلكتروني بكل سهولة واحترافية
              </p>
              <div className="flex items-center justify-center gap-8 pt-6">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shadow-md">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">سرعة</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow-md">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">تصميم</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shadow-md">
                    <span className="text-2xl">💎</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">جودة</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl shadow-purple-200/50 border border-purple-100/50">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-300/50"
                >
                  <Lock className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {t('login_title')}
                </h2>
                <p className="text-gray-600">
                  {t('welcome_msg')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email_label')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder={t('email_placeholder')}
                      className={`w-full bg-white border-2 ${
                        errors.email ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl px-12 py-4 text-gray-800 placeholder:text-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                      transition-all duration-300 shadow-sm`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 flex items-center gap-1"
                    >
                      ⚠️ {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('password_label')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder={t('password_placeholder')}
                      className={`w-full bg-white border-2 ${
                        errors.password ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl px-12 py-4 text-gray-800 placeholder:text-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                      transition-all duration-300 shadow-sm`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 flex items-center gap-1"
                    >
                      ⚠️ {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-between items-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    {t('forgot_password')}
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-purple-300/50 hover:shadow-purple-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      t('login_button')
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  {t('no_account')}{' '}
                  <Link 
                    to="/register" 
                    className="text-purple-600 font-semibold hover:text-pink-600 transition-colors"
                  >
                    {t('register_now')}
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;