import { useState, useEffect, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

// Components
import BoxCard from "@/components/ui/BoxCard";
import ImageGallery from "@/components/ui/ImageGallery";
import ImageInput from "@/components/ui/ImageInput";

// Hooks & Utils
import { useUpdateStore } from "@/features/admin/hook/useStoreManagement";
import { useStore } from "@/features/store/hooks/UseStore";
import { handleImageUploadToImgbb } from "@/utils/uploadImage";
import type { Store } from "@/types";
import SaveModal from "@/components/ui/SaveModal";

const UpdateLogo = () => {
  const { id } = useParams();
     const { t } = useTranslation("store"); // 👈 load dashboard.json
  
  // 1. Fetch Store Data
  const { data: store, isLoading: isStoreLoading } = useStore(id);
  
  // 2. Mutation Hook
  const { mutate: updateStore, isPending } = useUpdateStore(id || "");

  // 3. Local State
  const [logo, setLogo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [HasChanged, setHasChanged] = useState(false);

  // 4. Sync local state with fetched data
  useEffect(() => {
    if (store?.logo) {
      setLogo(store.logo);
    }
  }, [store]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const url = await handleImageUploadToImgbb(files[0]);
      if (url) {
        setLogo(url);
        setHasChanged(true)
        toast.success(t("Image uploaded successfully"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Upload failed"));
    } finally {
      setUploading(false);
      // Reset input value to allow re-uploading the same file if needed
      e.target.value = ""; 
    }
  };

  const handleSave = () => {
    if (!id || !store) return;
    
    // Construct Payload (Optimized to only send what changed if API supports it, 
    // otherwise send full object as per your previous pattern)
    const payload: Store = {
      ...store,
      logo: logo || "", // Ensure it's string if null
    };

    updateStore(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success(t("Logo updated successfully"));
        },
      }
    );
  };

  const removeImage = () => {
    setLogo(null);
  };

  if (isStoreLoading) {
    return (
      <BoxCard about={t("Logo")} small={true} className="py-1">
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
        </div>
      </BoxCard>
    );
  }

  return (
    <BoxCard about={t("Logo")} small={true} className="py-1">
      <div className="space-y-4">
        
        {/* Helper Text */}
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t("logotext")}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-5">

          {/* Image Display Area */}
          <div className="flex flex-col gap-4">
            {logo ? (
              <div className="flex flex-wrap gap-3">
                <ImageGallery 
                variant="banner"
                  images={[logo]} 
                  onRemove={removeImage} 
                />
              </div>
            ) : (
              <div className="mt-2">
                <ImageInput 
                  label="" 
                  uploading={uploading} 
                  onImageSelected={handleImageUpload} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <SaveModal
     isDirty={HasChanged}
     handleSave={handleSave}
     isSaving={isPending}
     />

      </div>
    </BoxCard>
  );
};

export default UpdateLogo;