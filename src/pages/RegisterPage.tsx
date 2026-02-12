import { registerSchema, type RegisterFormValues } from "@/features/auth/types/schema";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, Shield, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t, i18n } = useTranslation("auth");

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
        toast.success(t('success_register'));
        navigate("/");
      } else {
        toast.error(t('error_generic_register'));
      }
    } catch (e) {
       toast.error(t('error_server'));
    } finally {
      setIsRegistering(false);
    }
  };

  const features = [
    { icon: "🎨", title: "تصميم احترافي", desc: "واجهة متجر عصرية وجذابة", color: "purple" },
    { icon: "📱", title: "متوافق مع الجوال", desc: "يعمل على جميع الأجهزة", color: "blue" },
    { icon: "🚀", title: "سرعة فائقة", desc: "تحميل سريع وأداء ممتاز", color: "pink" },
    { icon: "🔒", title: "آمن ومحمي", desc: "حماية متقدمة لبياناتك", color: "indigo" }
  ];

  return (
    <div 
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
    >
      <Toaster position="top-center" />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, 0],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl"
        />
      </div>

      {/* Decorative Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col justify-center space-y-8 pt-12"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-purple-100 rounded-full border border-purple-200"
              >
                <span className="text-purple-700 text-sm font-medium">✨ انضم إلينا اليوم</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight"
              >
                ابدأ متجرك
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  الإلكتروني الآن
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                انشئ متجرك الإلكتروني الاحترافي في دقائق وابدأ البيع فوراً
              </motion.p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-white/80 backdrop-blur-sm border-2 border-${feature.color}-100 rounded-2xl p-5 hover:shadow-xl hover:shadow-${feature.color}-200/50 transition-all duration-300`}
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-gray-800 font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-4 border-white flex items-center justify-center text-white font-bold shadow-lg">
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-gray-800 font-semibold">+500 تاجر</p>
                <p className="text-gray-600 text-sm">انضموا إلينا هذا الشهر</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Register Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl shadow-indigo-200/50 border border-indigo-100/50">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-300/50"
                >
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {t('register_title')}
                </h2>
                <p className="text-gray-600 text-sm">
                  {t('register_subtitle')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('name_label')}
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                    <input
                      {...register("name")}
                      placeholder={t('fullname_placeholder')}
                      className={`w-full bg-white border-2 ${
                        errors.name ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl px-12 py-3.5 text-gray-800 placeholder:text-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                      transition-all duration-300 shadow-sm`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5">⚠️ {errors.name.message}</p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('phone_label')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                    <input
                      {...register("phone")}
                      placeholder={t('phone_placeholder')}
                      className={`w-full bg-white border-2 ${
                        errors.phone ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl px-12 py-3.5 text-gray-800 placeholder:text-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                      transition-all duration-300 shadow-sm`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1.5">⚠️ {errors.phone.message}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email_label')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder={t('email_placeholder')}
                      className={`w-full bg-white border-2 ${
                        errors.email ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl px-12 py-3.5 text-gray-800 placeholder:text-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                      transition-all duration-300 shadow-sm`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5">⚠️ {errors.email.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('password_label')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder={t('password_placeholder')}
                      className={`w-full bg-white border-2 ${
                        errors.password ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl px-12 py-3.5 text-gray-800 placeholder:text-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
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
                    <p className="text-red-500 text-xs mt-1.5">⚠️ {errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t('confirm_password_placeholder')}
                      className={`w-full bg-white border-2 ${
                        errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                      } rounded-xl px-12 py-3.5 text-gray-800 placeholder:text-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                      transition-all duration-300 shadow-sm`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1.5">⚠️ {errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    {...register("agreedToTerms")}
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    {t('agree_to')}{' '}
                    <Link to="/terms" className="text-indigo-600 hover:text-purple-600 font-medium underline">
                      {t('terms_and_conditions')}
                    </Link>
                  </label>
                </div>
                {errors.agreedToTerms && (
                  <p className="text-red-500 text-xs">⚠️ {errors.agreedToTerms.message}</p>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isRegistering}
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري إنشاء الحساب...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {t('create_account_button')}
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  {t('already_have_account')}{' '}
                  <Link 
                    to="/login" 
                    className="text-indigo-600 font-semibold hover:text-purple-600 transition-colors"
                  >
                    {t('login_link')}
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

export default RegisterPage;