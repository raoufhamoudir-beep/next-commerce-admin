import type { LanguageOption, LanguagePanelProps } from "@/types";
import { Check, Globe, X } from "lucide-react";
import { useTranslation } from "react-i18next";



const LanguagePanel = ({ hide }: LanguagePanelProps) => {
  const { t, i18n } = useTranslation("account"); // 2. Initialize translation
  const currentLang = i18n.language;

  const languages: LanguageOption[] = [
    { code: "en", label: "English", native: "English" },
    { code: "fr", label: "French", native: "Français" },
    { code: "ar", label: "Arabic", native: "العربية" },
  ];

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    setTimeout(() => {
      hide();
    }, 150);
  };

  return (
    <div className="w-full bg-white">
      {/* Header Section */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-gray-900">{t("ChooseLanguage")}</h2>
        </div>
        <button
          onClick={hide}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Language List */}
      <div className="p-6 flex flex-col gap-3">
        {languages.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              className={`
                group flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all duration-200 border
                ${isActive
                  ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200 transform scale-[1.02]"
                  : "bg-white border-gray-100 text-gray-600 hover:border-purple-200 hover:bg-purple-50"
                }
              `}
            >
              <div className="flex flex-col">
                <span className={`font-bold text-base ${isActive ? "text-white" : "text-gray-900"}`}>
                  {lang.native}
                </span>
                <span className={`text-xs ${isActive ? "text-purple-200" : "text-gray-400"}`}>
                  {lang.label}
                </span>
              </div>

              {isActive && (
                <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguagePanel;