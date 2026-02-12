import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { 
  Loader2, 
  Menu, 
  Search, 
  Eye, 
  EyeOff, 
  Palette, 
  LayoutTemplate 
} from "lucide-react";

// Components & Hooks
import BoxCard from "@/components/ui/BoxCard";
import { useStore } from "@/features/store/hooks/UseStore";
import { useUpdateStore } from "@/features/admin/hook/useStoreManagement";
import type { header } from "@/types";
import SaveModal from "@/components/ui/SaveModal";

const StoreUpdateThemeHeader = () => {
  const { id } = useParams();
  const { t } = useTranslation("store");

  // 1. Fetch Store Data
  const { data: store, isLoading: isStoreLoading } = useStore(id);

  // 2. Mutation Hook
  const { mutate: updateStore, isPending } = useUpdateStore(id || "");

  // 3. State
  const [hasChanges, setHasChanges] = useState(false);
  const [headerConfig, setHeaderConfig] = useState<header>({
    name: true,
    logo: true,
    headerColor: "#ffffff",
    textColor: "#000000",
    barColor: "#000000",
  });

  // 4. Sync Logic
  useEffect(() => {
    if (store?.header) {
      setHeaderConfig({
        name: store.header.name ?? true,
        logo: store.header.logo ?? true,
        headerColor: store.header.headerColor || "#ffffff",
        textColor: store.header.textColor || "#000000",
        barColor: store.header.barColor || "#000000",
      });
    }
  }, [store]);

  // Handlers
  const handleToggle = (key: keyof header) => {
    setHeaderConfig((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleColorChange = (key: keyof header, color: string) => {
    setHeaderConfig((prev) => ({ ...prev, [key]: color }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!store || !id) return;

    if (!hasChanges) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

    updateStore(
      { id: id, data: { ...store, header: headerConfig } },
      {
        onSuccess: () => {
          toast.success(t("Header style updated successfully"));
          setHasChanges(false);
        },
        onError: () => {
          toast.error(t("Failed to update header"));
        },
      }
    );
  };

  if (isStoreLoading) {
    return (
      <BoxCard about={t("HeaderStyle")} small={true} className="py-1">
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
        </div>
      </BoxCard>
    );
  } 

  return (
      <div className="space-y-8 font-inter">
        
        {/* Header Intro */}
        <div className="flex items-start gap-3 bg-teal-50 p-4 rounded-2xl">
           <LayoutTemplate className="text-teal-600 w-6 h-6 flex-shrink-0 mt-0.5" />
           <p className="text-sm text-teal-900 leading-relaxed font-medium">
            {t("Customize your store's top navigation bar. Toggle visibility of elements and pick colors that match your brand.")}
          </p>
        </div>

        {/* 1. Visibility Toggles (Modern Switch Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Show Logo Toggle */}
            <div 
                onClick={() => handleToggle("logo")}
                className={`
                    cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center justify-between
                    ${headerConfig.logo 
                        ? "bg-teal-50 border-teal-200 shadow-sm" 
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${headerConfig.logo ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"}`}>
                        {headerConfig.logo ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>
                    <span className="font-medium text-gray-700">{t("Show Logo")}</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${headerConfig.logo ? "bg-teal-500" : "bg-gray-300"}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-transform ${headerConfig.logo ? "left-6" : "left-1"}`} />
                </div>
            </div>

            {/* Show Name Toggle */}
            <div 
                onClick={() => handleToggle("name")}
                className={`
                    cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center justify-between
                    ${headerConfig.name 
                        ? "bg-teal-50 border-teal-200 shadow-sm" 
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${headerConfig.name ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"}`}>
                        {headerConfig.name ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>
                    <span className="font-medium text-gray-700">{t("Show Store Name")}</span>
                </div>
                 <div className={`w-10 h-5 rounded-full relative transition-colors ${headerConfig.name ? "bg-teal-500" : "bg-gray-300"}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-transform ${headerConfig.name ? "left-6" : "left-1"}`} />
                </div>
            </div>
        </div>

        {/* 2. Color Customization */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Palette size={18} className="text-gray-500" />
                {t("Color Customization")}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Background Color */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("Background")}</label>
                    <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-xl bg-white shadow-sm">
                        <input 
                            type="color" 
                            value={headerConfig.headerColor}
                            onChange={(e) => handleColorChange("headerColor", e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border-none p-0"
                        />
                        <span className="text-sm font-mono text-gray-600 uppercase">{headerConfig.headerColor}</span>
                    </div>
                </div>

                {/* Text Color */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("Store Name")}</label>
                    <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-xl bg-white shadow-sm">
                        <input 
                            type="color" 
                            value={headerConfig.textColor}
                            onChange={(e) => handleColorChange("textColor", e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border-none p-0"
                        />
                        <span className="text-sm font-mono text-gray-600 uppercase">{headerConfig.textColor}</span>
                    </div>
                </div>

                {/* Icons Color */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("Icons")}</label>
                    <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-xl bg-white shadow-sm">
                         <input 
                            type="color" 
                            value={headerConfig.barColor}
                            onChange={(e) => handleColorChange("barColor", e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border-none p-0"
                        />
                        <span className="text-sm font-mono text-gray-600 uppercase">{headerConfig.barColor}</span>
                    </div>
                </div>

            </div>
        </div>

        {/* 3. Live Preview */}
        <div className="space-y-2 pt-4">
             <h3 className="font-semibold text-gray-800 text-sm">{t("Live Preview")}</h3>
             
             {/* Device Mockup */}
             <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50">
                 {/* Fake Browser Bar */}
                <div className="bg-white border-b border-gray-200 px-4 py-2 flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>

                {/* Actual Header Preview */}
                <div 
                    style={{ backgroundColor: headerConfig.headerColor }} 
                    className="p-4 flex items-center justify-between transition-colors duration-300"
                >
                    <div className="flex items-center gap-3">
                        {headerConfig.logo && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shadow-sm">
                                {store?.logo ? (
                                    <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">L</div>
                                )}
                            </div>
                        )}
                        
                        {headerConfig.name && (
                            <span 
                                style={{ color: headerConfig.textColor }} 
                                className="font-bold text-sm transition-colors duration-300"
                            >
                                {store?.storeName || "Store Name"}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <Search size={20} style={{ color: headerConfig.barColor }} />
                        <Menu size={20} style={{ color: headerConfig.barColor }} />
                    </div>
                </div>

                {/* Skeleton Content Below */}
                <div className="p-4 space-y-3 opacity-50 bg-white">
                    <div className="h-32 bg-gray-100 rounded-xl w-full" />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-24 bg-gray-100 rounded-xl" />
                        <div className="h-24 bg-gray-100 rounded-xl" />
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

export default StoreUpdateThemeHeader;