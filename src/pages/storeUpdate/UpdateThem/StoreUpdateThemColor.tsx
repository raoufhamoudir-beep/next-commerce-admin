import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { 
  Loader2, 
  Palette, 
  Check, 
  Copy, 
  RefreshCw 
} from "lucide-react";

// Components & Hooks
import BoxCard from "@/components/ui/BoxCard";
import { useStore } from "@/features/store/hooks/UseStore";
import { useUpdateStore } from "@/features/admin/hook/useStoreManagement";
import SaveModal from "@/components/ui/SaveModal";

// Curated presets for quick selection
const COLOR_PRESETS = [
  "#0D9488", // Teal (Your brand)
  "#7C3AED", // Violet
  "#2563EB", // Blue
  "#DC2626", // Red
  "#EA580C", // Orange
  "#000000", // Black
  "#4B5563", // Gray
  "#DB2777", // Pink
];

const StoreUpdateThemColor = () => {
  const { id } = useParams();
  const { t } = useTranslation("store");

  // 1. Fetch Store Data
  const { data: store, isLoading: isStoreLoading } = useStore(id);

  // 2. Mutation Hook
  const { mutate: updateStore, isPending } = useUpdateStore(id || "");

  // 3. State
  const [mainColor, setMainColor] = useState("#ffffff");
  const [hasChanges, setHasChanges] = useState(false);

  // 4. Sync Logic
  useEffect(() => {
    if (store?.mainColor) {
      setMainColor(store.mainColor);
    }
  }, [store]);

  // Handle Color Change (Picker or Input)
  const handleColorChange = (newColor: string) => {
    setMainColor(newColor);
    setHasChanges(true);
  };

  // Handle Manual Hex Input
  

  // Copy to Clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(mainColor);
    toast.success("Color code copied!");
  };

  // Reset to original
  const handleReset = () => {
    if (store?.mainColor) {
      setMainColor(store.mainColor);
      setHasChanges(false);
    }
  };

  // Save Logic
  const handleSave = () => {
    if (!store || !id) return;

    if (!hasChanges) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

    updateStore(
      { id: id, data: { ...store, mainColor: mainColor } },
      {
        onSuccess: () => {
          toast.success(t("Theme updated successfully"));
          setHasChanges(false);
        },
        onError: () => {
          toast.error(t("Failed to update theme"));
        },
      }
    );
  };

  if (isStoreLoading) {
    return (
      <BoxCard about={t("ThemeColor")} small={true} className="py-1">
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
        </div>
      </BoxCard>
    );
  }

  return (
      <div className="space-y-6">
        
        {/* Header Description */}
    

        <div className="border-t border-gray-100 pt-5">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Left: Color Picker & Input */}
            <div className="flex-1 space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Palette className="w-4 h-4 text-gray-400" />
                {t("PrimaryColor")}
              </label>

              <div className="flex gap-3">
                {/* Visual Picker */}
                <div className="relative w-14 h-14 rounded-xl shadow-sm border border-gray-200 overflow-hidden shrink-0 group">
                  <input
                    type="color"
                    value={mainColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                  />
                </div>

                {/* Hex Input */}
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono">#</span>
                  <input
                    type="text"
                    value={mainColor.replace('#', '')}
                    onChange={(e) => handleColorChange(`#${e.target.value}`)}
                    className="w-full pl-7 pr-10 py-3.5 border border-gray-300 rounded-xl font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    maxLength={6}
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy Hex"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Presets */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">
                  {t("Presets")}
                </label>
                {hasChanges && (
                  <button 
                    onClick={handleReset}
                    className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw size={12} /> {t("Reset")}
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-full border border-black/10 transition-all duration-200 flex items-center justify-center hover:scale-110 ${
                      mainColor.toLowerCase() === color.toLowerCase() 
                        ? "ring-2 ring-offset-2 ring-teal-500 scale-110 shadow-sm" 
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                    aria-label={`Select color ${color}`}
                  >
                    {mainColor.toLowerCase() === color.toLowerCase() && (
                      <Check className="w-4 h-4 text-white drop-shadow-md" strokeWidth={3} />
                    )}
                  </button>
                ))}
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

export default StoreUpdateThemColor;