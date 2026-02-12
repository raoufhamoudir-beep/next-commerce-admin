import BoxCard from '@/components/ui/BoxCard';
import ImageGallery from '@/components/ui/ImageGallery';
import ImageInput from '@/components/ui/ImageInput';
import Modal from '@/components/ui/Madel';
import PageContainer from '@/components/ui/PageContainer';
import Tutorial from '@/components/ui/Tutorial';
import { useUpdateStore } from '@/features/admin/hook/useStoreManagement';
import { useStore } from '@/features/store/hooks/UseStore';
import type { Categories, Store } from '@/types';
import { handleImageUploadToImgbb } from '@/utils/uploadImage';
import { Loader2, Save} from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const AddCategories = () => {
  const { t } = useTranslation("Categories");
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch Store Data
  const { data: store, isLoading: isStoreLoading } = useStore(id);
  const { mutate: updateStore, isPending } = useUpdateStore(id || "");

  const [showTutorial, setShowTutorial] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Local State for New Category
  const [category, setCategory] = useState<Categories>({
    id: "", // Will be generated on save
    image: null,
    name: "",
    show: true
  });

  // Handle Image Upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // For categories, we usually only need one main image. 
      // Taking the first file selected.
      const url = await handleImageUploadToImgbb(files[0]);
      if (url) {
        setCategory(prev => ({ ...prev, image: url }));
        toast.success(t("Image uploaded successfully"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Upload failed"));
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  // Handle Save
  const handleSave = async () => {
    if (!store) return;

    // Validation
    if (!category.image || !category.name.trim()) {
      toast.error(t("Please fill all required fields"));
      return;
    }

    // Generate a simple unique ID (using timestamp + random is safer than length)
    const newId = `cat_${Date.now()}`;

    const newCategory: Categories = {
      ...category,
      id: newId
    };

    // Construct Payload
    const payload: Store = {
      ...store,
      categories: [...(store.categories || []), newCategory]
    };

    updateStore({ id: id || "30039", data: payload }, {
      onSuccess: () => {
        toast.success(t("Category added successfully"));
        navigate(`/store/${id}/Categories`);
        // Reset form (optional since we navigate away)
        setCategory({ id: "", image: null, name: "", show: true });
      }
    });
  };

  const removeImage = () => {
    setCategory(prev => ({ ...prev, image: null }));
  };

  if (isStoreLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-teal-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <PageContainer
      title={t('Add Category')}
      about={t("Create a new category for your products")}
    >
      {showTutorial && (
        <Modal onClose={() => setShowTutorial(false)}>
          <Tutorial about={"https://firebasestorage.googleapis.com/v0/b/tawssilatrest.appspot.com/o/%D9%83%D9%8A%D9%81%D9%8A%D8%A9%20%D8%A5%D8%B8%D8%A7%D9%81%D8%A9%20%D8%A7%D9%84%D9%81%D8%A6%D8%A7%D8%AA%20%D8%A7%D9%84%D9%89%20%D9%85%D9%86%D8%B5%D8%A9%20next%20comerce.mp4?alt=media&token=86b3723e-7829-48be-8904-f60cf750aae2"} />
        </Modal>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: General Info */}
        <div className="lg:col-span-2 space-y-6">
          <BoxCard
            about={t("General Information")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Category Name")}
                </label>
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => setCategory({ ...category, name: e.target.value })}
                  placeholder={t("e.g. Electronics, Shoes...")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">{t("Navigation Visibility")}</span>
                  <span className="text-sm text-gray-500">
                    {t("Show this category in the")} <span className="text-purple-600 font-medium">{t("Home Page")}</span>
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={category.show}
                  onChange={(e) => setCategory({ ...category, show: e.target.checked })}
                  className="toggle toggle-primary toggle-lg" // Assuming DaisyUI or similar, otherwise standard checkbox styling needed
                />
              </div>
            </div>
          </BoxCard>
        </div>

        {/* Right Column: Image Upload */}
        <div className="lg:col-span-1 space-y-6">
          <BoxCard
            about={t("Category Image")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <p className="text-sm text-gray-500 mb-4">
              {t("Upload a high-quality image to represent this category.")}
            </p>
            
            <div className="space-y-4">
              {category.image ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                   <ImageGallery
                      images={[category.image]}
                      onRemove={removeImage}
                   />
                </div>
              ) : (
                <ImageInput 
                  label={t("Click or Drag to Upload")} 
                  uploading={uploading} 
                  onImageSelected={handleImageUpload} 
                />
              )}
            </div>
          </BoxCard>
        </div>

      </div>

      {/* Action Bar */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isPending || uploading}
          className="
            flex items-center gap-2 
            bg-teal-600 text-white px-8 py-3 rounded-xl 
            shadow-lg hover:bg-teal-700 transition-transform active:scale-95
            disabled:opacity-70 disabled:cursor-not-allowed
          "
        >
          {isPending ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              {t("Save Category")}
            </>
          )}
        </button>
      </div>

    </PageContainer>
  );
};

export default AddCategories;