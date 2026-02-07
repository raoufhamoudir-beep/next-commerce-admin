import {
  Settings,
  MessageCircle,
  HelpCircle,
  LogOut,
  Check,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { AccountPanelProps } from "@/types";
import { logout } from "@/features/auth/hooks/useAuthMutations"; // تأكد أن هذه دالة عادية وليست Hook

const AccountPanel = ({ user, hide }: AccountPanelProps) => {
  const { t, i18n } = useTranslation("auth");
  const isRtl = i18n.language === 'ar';

  const menu = [
    {
      link: "/Setting",
      label: t("account_settings"), // تم التحديث
      icon: <Settings className="w-4 h-4 text-purple-600" />,
    },
    {
      link: "/Contact",
      label: t("contact_us"), // تم التحديث
      icon: <MessageCircle className="w-4 h-4 text-purple-600" />,
    },
    {
      link: "/FAQ",
      label: t("faq"), // تم التحديث
      icon: <HelpCircle className="w-4 h-4 text-purple-600" />,
    },
    {
      link: "/login",
      label: t("logout"), // تم التحديث
      icon: <LogOut className="w-4 h-4 text-red-500" />, // لون أحمر للخروج
      isDestructive: true,
    },
  ];

  const handleLinkClick = (link: string) => {
    hide();
    if (link === "/login") {
      logout();
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="w-full flex flex-col bg-white">
      
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-gray-100 text-center">
        <h2 className="font-bold text-xl capitalize text-gray-900">
          {user?.name || t("default_user")}
        </h2>
        <div className="flex justify-center items-center mt-1 text-sm text-gray-500 gap-1.5">
          <span>{t("store_owner_badge")}</span>
          <div className="bg-teal-50 rounded-full p-0.5">
            <Check className="w-3 h-3 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="p-3 space-y-1">
        {menu.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.link}
            onClick={() => handleLinkClick(item.link)}
            className={({ isActive }) =>
              `flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
               ${isActive
                 ? "bg-purple-50 text-purple-700"
                 : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
               }`
            }
          >
            {/* تم تعديل الترتيب هنا:
               في القوائم الجانبية، غالباً ما تكون الأيقونة قبل النص.
               قمت بوضع الأيقونة بجانب النص في حاوية واحدة لترتيب أجمل.
            */}
            <div className="flex items-center gap-3">
               {item.icon}
               <span>{item.label}</span>
            </div>
            
            {/* سهم صغير يظهر عند التحويم (اختياري جمالي) */}
            {/* <ChevronLeft className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isRtl ? '' : 'rotate-180'}`} /> */}
          </NavLink>
        ))}
      </div>

      {/* Close button */}
      <div className="p-5 pt-2">
        <button
          onClick={hide}
          className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors text-sm"
        >
          {t("close_panel")}
        </button>
      </div>
    </div>
  );
};

export default AccountPanel;