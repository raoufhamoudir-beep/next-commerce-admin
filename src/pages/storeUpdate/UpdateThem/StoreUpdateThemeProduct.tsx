import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Loader2, Check, Sparkles } from "lucide-react";

// Components & Hooks 
import BoxCard from "@/components/ui/BoxCard";
import { useStore } from "@/features/store/hooks/UseStore";
import { useUpdateStore } from "@/features/admin/hook/useStoreManagement";

// Product Card Variants
import ProductCardTypeA from "@/features/StoreUpdate/components/ProductCard/ProductCardTypeA";
import ProductCardTypeB from "@/features/StoreUpdate/components/ProductCard/ProductCardTypeB";
import ProductCardTypeC from "@/features/StoreUpdate/components/ProductCard/ProductCardTypeC";
import SaveModal from "@/components/ui/SaveModal";

// Types
type CardType = "A" | "B" | "C";

// Dummy Data for Preview
const PREVIEW_PRODUCT = {
  name: "Nike Air Max",
  price: 3000,
  Oldprice: 3500,
  image: "https://f003.backblazeb2.com/file/flex-storage/hQEmYrJWMRB4JsHEKCzeu-1721729707950.jpg",
};

const StoreUpdateThemeProduct = () => {
  const { id } = useParams();
  const { t } = useTranslation("store");

  // 1. Fetch Store Data
  const { data: store, isLoading: isStoreLoading } = useStore(id);

  // 2. Mutation Hook
  const { mutate: updateStore, isPending } = useUpdateStore(id || "");

  // 3. State
  const [selectedType, setSelectedType] = useState<CardType>("A");
  const [hasChanges, setHasChanges] = useState(false);

  // 4. Sync Logic
  useEffect(() => {
    if (store?.ProductCardType) {
      setSelectedType(store.ProductCardType as CardType);
    }
  }, [store]);

  const handleSelect = (type: CardType) => {
    setSelectedType(type);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!store || !id) return;

    if (!hasChanges) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

    updateStore(
      { id: id, data: { ...store, ProductCardType: selectedType } },
      {
        onSuccess: () => {
          toast.success(t("Card style updated successfully"));
          setHasChanges(false);
        },
        onError: () => {
          toast.error(t("Failed to update card style"));
        },
      }
    );
  };

  // Define Layout Options
  const CARD_OPTIONS = [
    {
      id: "A",
      label: t("Shadow Style"),
      description: t("Classic card with a soft drop shadow."),
      Component: ProductCardTypeA,
    },
    {
      id: "B",
      label: t("Minimal Style"),
      description: t("Clean, flat design with no borders."),
      Component: ProductCardTypeB,
    },
    {
      id: "C",
      label: t("Modern Style"),
      description: t("Contemporary look with rounded details."),
      Component: ProductCardTypeC,
    },
  ];

  if (isStoreLoading) {
    return (
      <BoxCard about={t("ProductCardStyle")} small={true} className="py-1">
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
        </div>
      </BoxCard>
    );
  }

  return (
      <div className="space-y-8 font-inter">
        
        {/* Header Text */}
        <div className="flex items-start gap-3 bg-teal-50 p-4 rounded-2xl">
           <Sparkles className="text-teal-600 w-6 h-6 flex-shrink-0 mt-0.5" />
           <p className="text-sm text-teal-900 leading-relaxed font-medium">
            {t("Select the visual style for your product grids. The chosen style will appear across your entire store.")}
          </p>
        </div>

        {/* Cards Grid - Added padding-x to prevent shadow clipping on hover scale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
          {CARD_OPTIONS.map((option) => {
            const isSelected = selectedType === option.id;
            return (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id as CardType)}
                // The container uses padding (p-1) to create an internal gap for the selection effect
                className={`
                  relative group cursor-pointer rounded-[2rem] p-1
                  transition-all duration-300 ease-out
                  ${isSelected 
                    ? "bg-gradient-to-br from-teal-100 via-teal-50 to-white shadow-xl shadow-teal-200/40 scale-[1.02] z-10" // Selected state: Gradient background, soft deep shadow, slight scale up
                    : "bg-white shadow-sm hover:shadow-md hover:-translate-y-1 hover:bg-gray-50/50" // Default state: subtle
                  }
                `}
              >
                 {/* FLOATING CHECK BADGE (Replacing Border) */}
                 <div className={`
                    absolute -top-2 -right-2 z-20 transition-all duration-300 ease-spring
                    ${isSelected ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}
                  `}>
                    <div className="bg-teal-600 text-white rounded-full p-2.5 shadow-lg shadow-teal-600/30">
                        <Check size={22} strokeWidth={3} />
                    </div>
                  </div>

                {/* INNER CONTENT CARD */}
                <div className={`
                    h-full rounded-[1.75rem] p-6 flex flex-col
                    ${isSelected ? 'bg-white/60 backdrop-blur-sm' : 'bg-transparent'}
                `}>
                   {/* Label Header */}
                   <div className="text-center mb-8">
                      <h3 className={`font-bold text-xl mb-2 transition-colors ${isSelected ? 'text-teal-800' : 'text-gray-800'}`}>
                        {option.label}
                      </h3>
                      <p className={`text-sm transition-colors ${isSelected ? 'text-teal-600/80' : 'text-gray-500'}`}>
                        {option.description}
                      </p>
                   </div>

                  {/* Preview Area */}
                  <div className="flex-1 flex justify-center items-center relative min-h-[300px]">
                    {/* Subtle Ambient Glow behind selected item */}
                    {isSelected && (
                        <div className="absolute inset-0 bg-teal-300/20 blur-3xl rounded-full z-0 transform scale-75"></div>
                    )}
                    
                    <div className="relative z-10 pointer-events-none transform transition-transform duration-500 ease-out group-hover:scale-105">
                      <option.Component
                        {...PREVIEW_PRODUCT}
                        mainColor={store?.mainColor || "#0D9488"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

export default StoreUpdateThemeProduct;