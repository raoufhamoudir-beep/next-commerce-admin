import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  Loader2,
  CheckCircle,
  Eye,
  Type,
  Layout,
  ArrowRight,
  Copy,
  Smartphone,
  Home
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

// Components & Hooks
import BoxCard from "@/components/ui/BoxCard";
import { useStore } from "@/features/store/hooks/UseStore";
import { useUpdateStore } from "@/features/admin/hook/useStoreManagement";
import type { thanks } from "@/types";
import SaveModal from "@/components/ui/SaveModal";

const StoreUpdateThemeThanks = () => {
  const { id } = useParams();
  const { t } = useTranslation("store");

  // 1. Fetch Store Data
  const { data: store, isLoading: isStoreLoading } = useStore(id);

  // 2. Mutation Hook
  const { mutate: updateStore, isPending } = useUpdateStore(id || "");

  // 3. State
  const [hasChanges, setHasChanges] = useState(false);
  const [thanksConfig, setThanksConfig] = useState<thanks>({
    img: true,
    title: true,
    about: true,
    homeButton: true,
    phone: true,
    media: true,
    titleText: "Thank you for your order!",
    aboutText: "We will contact you soon. Have a nice day.",
  });

  // 4. Sync Logic
  useEffect(() => {
    if (store?.thanks) {
      setThanksConfig({
        img: store.thanks.img ?? true,
        title: store.thanks.title ?? true,
        about: store.thanks.about ?? true,
        homeButton: store.thanks.homeButton ?? true,
        phone: store.thanks.phone ?? true,
        media: store.thanks.media ?? true,
        titleText: store.thanks.titleText || "Thank you for your order!",
        aboutText: store.thanks.aboutText || "We will contact you soon. Have a nice day.",
      });
    }
  }, [store]);

  // Handlers
  const handleToggle = (key: keyof thanks) => {
    setThanksConfig((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleTextChange = (key: keyof thanks, value: string) => {
    setThanksConfig((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!store || !id) return;

    if (!hasChanges) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

    updateStore(
      { id: id, data: { ...store, thanks: thanksConfig } },
      {
        onSuccess: () => {
          toast.success(t("Thanks page updated successfully"));
          setHasChanges(false);
        },
        onError: () => {
          toast.error(t("Failed to update thanks page"));
        },
      }
    );
  };

  if (isStoreLoading) {
    return (
      <BoxCard about={t("ThanksPageStyle")} small={true} className="py-1">
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
        </div>
      </BoxCard>
    );
  }

  // Helper component for toggles
  const ToggleItem = ({ label, fieldKey, icon: Icon }: { label: string, fieldKey: keyof thanks, icon: any }) => (
    <div
      onClick={() => handleToggle(fieldKey)}
      className={`
        cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-center justify-between
        ${thanksConfig[fieldKey]
          ? "bg-teal-50 border-teal-200 shadow-sm"
          : "bg-white border-gray-200 hover:bg-gray-50"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${thanksConfig[fieldKey] ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"}`}>
          <Icon size={16} />
        </div>
        <span className="font-medium text-sm text-gray-700">{label}</span>
      </div>
      <div className={`w-9 h-5 rounded-full relative transition-colors ${thanksConfig[fieldKey] ? "bg-teal-500" : "bg-gray-300"}`}>
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-transform ${thanksConfig[fieldKey] ? "left-5" : "left-1"}`} />
      </div>
    </div>
  );

  return (
      <div className="space-y-8 font-inter">

        {/* Header Intro */}
        <div className="flex items-start gap-3 bg-teal-50 p-4 rounded-2xl">
          <CheckCircle className="text-teal-600 w-6 h-6 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-teal-900 leading-relaxed font-medium">
            {t("Customize the confirmation page your customers see after placing an order. Add helpful details and next steps.")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN: Controls */}
          <div className="space-y-6">

            {/* 1. Visibility Toggles */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Layout size={16} /> {t("Visibility Settings")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ToggleItem label={t("Show Image")} fieldKey="img" icon={Layout} />
                <ToggleItem label={t("Show Title")} fieldKey="title" icon={Type} />
                <ToggleItem label={t("Show Description")} fieldKey="about" icon={Type} />
                <ToggleItem label={t("Show Phone")} fieldKey="phone" icon={Smartphone} />
                <ToggleItem label={t("Home Button")} fieldKey="homeButton" icon={Home} />
                <ToggleItem label={t("Social Media")} fieldKey="media" icon={Layout} />
              </div>
            </div>

            {/* 2. Content Editing */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Type size={16} /> {t("Edit Content")}
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{t("Title")}</label>
                  <input
                    type="text"
                    value={thanksConfig.titleText as string}
                    onChange={(e) => handleTextChange("titleText", e.target.value)}
                    placeholder="Thank you for your order!"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{t("Description")}</label>
                  <textarea
                    rows={3}
                    value={thanksConfig.aboutText as string}
                    onChange={(e) => handleTextChange("aboutText", e.target.value)}
                    placeholder="We will contact you soon..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <Eye size={16} /> {t("Live Preview")}
            </h3>

            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50/50 min-h-[500px] flex flex-col items-center justify-center p-6 relative">
              {/* Fake Phone Frame */}
              <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden relative">
                 {/* Status Bar */}
                 <div className="h-6 bg-gray-100 w-full flex justify-between items-center px-4">
                    <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                    </div>
                 </div>

                 {/* Content */}
                 <div className="p-6 flex flex-col items-center text-center space-y-6 min-h-[400px]">
                    
                    {thanksConfig.img && (
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                        <CheckCircle className="text-green-500 w-10 h-10" />
                      </div>
                    )}

                    <div className="space-y-2">
                        {thanksConfig.title && (
                          <h2 className="text-xl font-bold text-gray-800 leading-tight">
                            {thanksConfig.titleText}
                          </h2>
                        )}
                        {thanksConfig.about && (
                          <p className="text-sm text-gray-500 leading-relaxed px-4">
                            {thanksConfig.aboutText}
                          </p>
                        )}
                    </div>

                    {/* Divider if needed */}
                    {(thanksConfig.phone || thanksConfig.homeButton) && <div className="w-full border-t border-gray-100" />}

                    {/* Action Area */}
                    <div className="w-full space-y-4">
                       {thanksConfig.phone && (
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                             <p className="text-xs text-gray-500 mb-2">{t("Need help? Call us:")}</p>
                             <div className="flex items-center justify-center gap-2 font-mono font-medium text-gray-700 bg-white py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50">
                                <Copy size={14} /> {store?.contacts?.phone || "+123 456 789"}
                             </div>
                          </div>
                       )}

                       {thanksConfig.homeButton && (
                          <button 
                            className="w-full py-3 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: store?.mainColor || "#0D9488" }}
                          >
                             {t("Back to Home")} <ArrowRight size={16} />
                          </button>
                       )}
                    </div>

                    {/* Footer Media */}
                    {thanksConfig.media && (
                       <div className="pt-4 mt-auto">
                          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">{t("Follow us")}</p>
                          <div className="flex justify-center gap-4">
                             <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition"><FaFacebookF size={14} /></div>
                             <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition"><FaInstagram size={14} /></div>
                             <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition"><FaTiktok size={14} /></div>
                          </div>
                       </div>
                    )}

                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <SaveModal
     isDirty={hasChanges}
     handleSave={handleSave}
     isSaving={isPending}
     />

      </div>
   );
};

export default StoreUpdateThemeThanks;