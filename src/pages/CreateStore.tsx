import  { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store, Globe, Loader2, CheckCircle2, Palette, X } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { formSchema, type FormValues } from '@/features/admin/types/schema';
import { useStoreRegister } from '@/features/admin/hook/useStoreManagement';
import {Toaster } from "react-hot-toast";
import { useTranslation } from 'react-i18next';

const BRAND_COLORS = [
  { name: 'Purple', value: '#9333ea', ring: 'ring-purple-500' }, 
  { name: 'Teal', value: '#0d9488', ring: 'ring-teal-500' }, 
  { name: 'Blue', value: '#2563eb', ring: 'ring-blue-500' },
  { name: 'Black', value: '#0f172a', ring: 'ring-gray-800' },
  { name: 'Orange', value: '#ea580c', ring: 'ring-orange-500' },
];

const CreateStore = () => {
  const [isSubdomainTouched, setIsSubdomainTouched] = useState(false);
   const { t } = useTranslation("account");

  // --- FIX 1: Call the Hook at the Top Level ---
  const { mutate: registerStore, isPending } = useStoreRegister();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: '#9333ea', 
    },
    mode: 'onChange',
  });

  const watchedName = watch("storeName");
  const watchedColor = watch("color");

  // --- Auto-Slug Logic ---
  useEffect(() => {
    if (watchedName && !isSubdomainTouched) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setValue("domain", slug, { shouldValidate: true });
    }
  }, [watchedName, isSubdomainTouched, setValue]);

  // --- Logo Handling ---
 
  // --- FIX 2: Use the mutate function inside onSubmit ---
  const onSubmit =  (data: FormValues) => {
 registerStore(data);

  };

  return (
    <PageContainer
      title={t("Create your store")} // Fixed typo: titel -> title
      about={t("Create a new store with a new domain and controllers")}
    >
     <Toaster  />
      <div className="flex justify-center w-full">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/50 ring-1 ring-gray-100">
          
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            
            {/* --- 1. Store Details Section --- */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-200"></div>
                <h3 className="text-xs font-bold text-purple-900/50 uppercase tracking-widest">{t("Store Details")}</h3>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-200"></div>
              </div>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("Store Name")}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    {...register("storeName")}
                    type="text"
                    className="block w-full pl-11 pr-3 py-3 border-gray-200 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all duration-200 sm:text-sm placeholder:text-gray-400"
                    placeholder={t("e.g. My Awesome Shop")}
                  />
                </div>
                {errors.storeName && <p className="mt-1.5 text-sm text-red-500 flex items-center"><X className="w-3 h-3 mr-1"/> {errors.storeName.message}</p>}
              </div>

              {/* Subdomain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("Store Domain")}</label>
                <div className="flex rounded-xl shadow-sm ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-1 transition-all overflow-hidden">
                  <div className="relative flex-grow flex items-center bg-gray-50/50 focus-within:bg-white transition-colors">
                     <div className="pl-3.5 pr-2">
                        <Globe className="h-5 w-5 text-gray-400" />
                     </div>
                    <input
                      {...register("domain")}
                      onInput={() => setIsSubdomainTouched(true)}
                      type="text"
                      className="block w-full py-3 border-0 bg-transparent focus:ring-0 sm:text-sm placeholder:text-gray-400 text-gray-900"
                      placeholder={t("myshop")}
                    />
                  </div>
                  <div className="flex items-center px-4 bg-gray-50 border-l border-gray-200 text-gray-500 sm:text-sm font-medium">
                    <span className="text-teal-600/70">.next-commerce.shop</span>
                  </div>
                </div>
                {errors.domain && <p className="mt-1.5 text-sm text-red-500 flex items-center"><X className="w-3 h-3 mr-1"/> {errors.domain.message}</p>}
              </div>
            </div>

            {/* --- 2. Branding Section --- */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-teal-200"></div>
                <h3 className="text-xs font-bold text-teal-900/50 uppercase tracking-widest">{t("Identity")}</h3>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-teal-200"></div>
              </div>

          

              {/* Brand Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t("Primary Color")}</label>
                <div className="flex flex-wrap gap-4 items-center">
                  {BRAND_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setValue('color', c.value)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                        watchedColor === c.value 
                          ? `ring-2 ${c.ring} ring-offset-2 scale-110 shadow-md` 
                          : 'ring-1 ring-black/5 hover:scale-105 hover:shadow-sm'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    >
                      {watchedColor === c.value && (
                        <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md animate-in zoom-in duration-200" />
                      )}
                    </button>
                  ))}
                  
                  {/* Custom Color Input */}
                  <div className={`relative w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center cursor-pointer transition-all hover:border-purple-300 ${!BRAND_COLORS.find(c => c.value === watchedColor) ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}>
                      <Palette className="w-5 h-5 text-gray-400" />
                      <input 
                        type="color"
                        {...register("color")}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full"
                      />
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <div className="h-4 w-4 rounded-full border border-gray-100 shadow-sm mr-2" style={{ backgroundColor: watchedColor }}></div>
                  <p className="text-xs text-gray-500 font-mono">
                    {watchedColor}
                  </p>
                </div>
              </div>
            </div>

            {/* --- Submit --- */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-teal-500 group-hover:from-purple-700 group-hover:to-teal-600 transition-all duration-300"></span>
                <div className="relative bg-gradient-to-r from-purple-600 to-teal-500 h-full rounded-xl px-4 py-3.5 flex items-center justify-center transition-all">
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin text-white/90" />
                      <span className="text-white font-medium">{t("Creating Store...")}</span>
                    </>
                  ) : (
                    <span className="text-white font-semibold text-base tracking-wide">{t("Create Store")}</span>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateStore;