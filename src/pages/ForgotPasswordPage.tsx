import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, KeyRound, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

// Schemas للمراحل المختلفة
const emailSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح")
});

const codeSchema = z.object({
  code: z.string().length(6, "الرمز يجب أن يكون 6 أرقام")
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"]
});

type Step = "email" | "code" | "reset";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation("auth");
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Email Form
  const emailForm = useForm({
    resolver: zodResolver(emailSchema)
  });

  // Step 2: Code Form
  const codeForm = useForm({
    resolver: zodResolver(codeSchema)
  });

  // Step 3: Reset Password Form
  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  // إرسال البريد الإلكتروني
  const handleEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email: data.email });
      
      if (res.data?.success) {
        setEmail(data.email);
        setCurrentStep("code");
        toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      } else {
        toast.error("البريد الإلكتروني غير موجود");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  // التحقق من الكود
  const handleCodeSubmit = async (data: z.infer<typeof codeSchema>) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/verify-reset-code", { 
        email, 
        code: data.code 
      });
      
      if (res.data?.success) {
        setResetToken(res.data.token);
        setCurrentStep("reset");
        toast.success("تم التحقق بنجاح");
      } else {
        toast.error("الرمز غير صحيح");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "الرمز غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة تعيين كلمة المرور
  const handleResetSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        email,
        token: resetToken,
        password: data.password
      });
      
      if (res.data?.success) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error("حدث خطأ، حاول مرة أخرى");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  // مكون الخطوات
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {["email", "code", "reset"].map((step, idx) => (
        <div key={step} className="flex items-center">
          <motion.div
            initial={false}
            animate={{
              scale: currentStep === step ? 1.2 : 1,
              backgroundColor: 
                currentStep === step ? "rgb(139, 92, 246)" :
                ["email", "code", "reset"].indexOf(currentStep) > idx ? "rgb(34, 197, 94)" :
                "rgb(229, 231, 235)"
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
              ${currentStep === step ? "shadow-lg shadow-purple-300/50" : ""}`}
          >
            {["email", "code", "reset"].indexOf(currentStep) > idx ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <span className={currentStep === step ? "text-white" : "text-gray-600"}>{idx + 1}</span>
            )}
          </motion.div>
          {idx < 2 && (
            <div className={`w-12 h-1 mx-1 rounded-full transition-colors duration-300
              ${["email", "code", "reset"].indexOf(currentStep) > idx ? "bg-green-500" : "bg-gray-300"}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div 
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50"
    >
      <Toaster position="top-center" />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-300/40 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl"
        />
      </div>

      {/* Decorative Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl shadow-indigo-200/50 border border-indigo-100/50">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-300/50"
              >
                {currentStep === "email" && <Mail className="w-10 h-10 text-white" />}
                {currentStep === "code" && <KeyRound className="w-10 h-10 text-white" />}
                {currentStep === "reset" && <Lock className="w-10 h-10 text-white" />}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {currentStep === "email" && "استرجاع كلمة المرور"}
                {currentStep === "code" && "التحقق من الرمز"}
                {currentStep === "reset" && "إنشاء كلمة مرور جديدة"}
              </h2>
              <p className="text-gray-600 text-sm">
                {currentStep === "email" && "أدخل بريدك الإلكتروني لإرسال رمز التحقق"}
                {currentStep === "code" && "أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك"}
                {currentStep === "reset" && "أدخل كلمة المرور الجديدة"}
              </p>
            </div>

            <StepIndicator />

            {/* Forms */}
            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {currentStep === "email" && (
                <motion.form
                  key="email-form"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                      <input
                        {...emailForm.register("email")}
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-12 py-4 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
                      />
                    </div>
                    {emailForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-2">
                        ⚠️ {emailForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/50 disabled:opacity-50 transition-all"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "إرسال رمز التحقق"
                    )}
                  </motion.button>
                </motion.form>
              )}

              {/* Step 2: Code Verification */}
              {currentStep === "code" && (
                <motion.form
                  key="code-form"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  onSubmit={codeForm.handleSubmit(handleCodeSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رمز التحقق
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                      <input
                        {...codeForm.register("code")}
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-12 py-4 text-gray-800 text-center text-2xl tracking-widest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
                      />
                    </div>
                    {codeForm.formState.errors.code && (
                      <p className="text-red-500 text-sm mt-2">
                        ⚠️ {codeForm.formState.errors.code.message}
                      </p>
                    )}
                    <p className="text-indigo-600 text-xs mt-3 font-medium">
                      تم إرسال الرمز إلى: <span className="font-semibold">{email}</span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("email")}
                      className="flex-1 bg-gray-100 border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      رجوع
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/50 disabled:opacity-50 transition-all"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        "تحقق"
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* Step 3: Reset Password */}
              {currentStep === "reset" && (
                <motion.form
                  key="reset-form"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  onSubmit={resetForm.handleSubmit(handleResetSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                      <input
                        {...resetForm.register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-12 py-4 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {resetForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-2">
                        ⚠️ {resetForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                      <input
                        {...resetForm.register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-12 py-4 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {resetForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-2">
                        ⚠️ {resetForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/50 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        تغيير كلمة المرور
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Back to Login */}
            <div className="mt-8 text-center">
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-purple-600 transition-colors text-sm font-medium"
              >
                <ArrowRight className="w-4 h-4" />
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;