import PageContainer from '@/components/ui/PageContainer';
import { useUser } from '@/features/auth/hooks/useUser';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io'; // تأكد من تثبيت react-icons
import { Link } from 'react-router-dom';

const Setting = () => {
  const { t, i18n } = useTranslation("auth");
  const { data: user } = useUser();
  const isRtl = i18n.language === 'ar'; // للتحقق من الاتجاه لقلب الأيقونة

  // المصفوفة أصبحت تعتمد على id ثابت للتحقق المنطقي
  const SettingsLinks = [
    {
      id: "name",
      to: "/setting/update-name",
      title: t("name_label"),
      value: user?.name
    },
    {
      id: "phone",
      to: "/setting/update-phone",
      title: t("phone_label"),
      value: user?.phone
    },
    {
      id: "email",
      to: "/setting/update-email",
      title: t("email_label"),
      value: user?.email
    },
    {
      id: "password",
      to: "/setting/update-password",
      title: t("password_label"),
      value: "********" // قيمة افتراضية للإخفاء
    },
  ];

  return (
    <PageContainer
      title={t("page_header_store_owner")} // ترجمة العنوان
      about={t("page_about_settings")}     // ترجمة الوصف
    >
      <div className='w-full flex justify-center items-center pt-5 flex-col gap-4 border-t border-gray-100 mt-5'>
        {SettingsLinks.map((item) => (
          <Link
            key={item.id} // استخدام id كمفتاح أفضل من الـ index
            to={item.to}
            className="flex items-center justify-between w-full md:w-11/12 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors px-5 py-4 rounded-2xl group"
          >
            <div className="flex flex-col flex-1">
              <strong className="text-sm font-semibold text-gray-900 block mb-1">
                {item.title}
              </strong>
              
              <span className="text-gray-500 text-sm font-medium dir-ltr block text-start">
                 {/* إصلاح المنطق:
                    نتحقق من الـ id بدلاً من الـ title المترجم.
                    ونعرض النجوم إذا كان id هو password
                 */}
                 {item.id === "password" ? "••••••••" : item.value || "---"}
              </span>
            </div>

            {/* Arrow Icon Logic:
               في اللغة العربية، السهم الذي يشير للأمام (اليسار) يجب أن يكون معكوساً 
               إذا كانت الأيقونة الأصلية تشير لليمين.
            */}
            <IoIosArrowForward 
                className={`text-gray-400 group-hover:text-purple-600 transition-colors text-xl ${isRtl ? 'rotate-180' : ''}`} 
            />
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}

export default Setting;