import type { Categories, Store } from "@/types";
import { ImageIcon } from "lucide-react";
import CategoriesCard from "./CategoriesCard";
import { useState } from "react";
import { useUpdateStore } from "@/features/admin/hook/useStoreManagement";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Madel";
import { ActionAlert, AlertItemPreview } from "@/components/ui/ActionAlert";
import { useTranslation } from "react-i18next";

interface ProductGridProps {
  store: Store | undefined;
  Categories: Categories[] | [];
  id: string;
  domain: string;
}

const CategoriesGrid = ({ store, Categories = [], id = "" }: ProductGridProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
  const { t } = useTranslation("Categories");

  const { mutate: updateStore, isPending } = useUpdateStore(id || "");

  const handleSelectCategory = (cat: Categories, type: "delete" | "switch") => {
    setSelectedCategory(cat);
    if (type === "delete") {
      setShowDeleteModal(true);
    } else {
      setShowSwitchModal(true);
    }
  };

  const handleDeleteCategory = () => {
    if (!store || !selectedCategory) return;

    // Filter out the selected category
    const newCategories: Categories[] = Categories.filter((e) => e.id !== selectedCategory.id);

    // Construct Payload
    const payload: Store = {
      ...store,
      categories: newCategories, // Ensure this matches your Store interface key (Categories vs categories)
    };

    updateStore(
      { id: id || "30039", data: payload },
      {
        onSuccess: () => {
          toast.success("Category deleted successfully");
          setShowDeleteModal(false);
          setSelectedCategory(null);
        },
        onError: () => {
            toast.error("Failed to delete category");
        }
      }
    );
  };

  const handleSwitchCategory = () => {
    if (!store || !selectedCategory) return;

    // Map through and toggle the specific category
    const newCategories: Categories[] = Categories.map((e) => {
      return e.id === selectedCategory.id ? { ...e, show: !e.show } : e;
    });

    // Construct Payload
    const payload: Store = {
      ...store,
      categories: newCategories,
    };

    updateStore(
      { id: id || "30039", data: payload },
      {
        onSuccess: () => {
          const status = !selectedCategory.show ? "Visible" : "Hidden";
          toast.success(`Category is now ${status}`);
          setShowSwitchModal(false);
          setSelectedCategory(null);
        },
        onError: () => {
            toast.error("Failed to update status");
        }
      }
    );
  };

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {t("number")}: {Categories.length}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Categories.map((item, index) => (
            <CategoriesCard
              storeId={id}
              key={item.id || index}
              Categories={item}
              handleSelectCategory={handleSelectCategory}
            />
          ))}
        </div>

        {/* Empty State */}
        {Categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
              <ImageIcon className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-700">{t("nocat")}</h3>
            <p className="text-slate-500 text-sm">
             {t("addhere")}
            </p>
          </div>
        )}
      </div>

      {/* --- Delete Modal --- */}
      {showDeleteModal && selectedCategory && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <ActionAlert
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteCategory}
            isLoading={isPending}
            title={t("Delete Category?")}
            variant="danger"
            confirmText={t("Yes, Delete")}
            description={
              <span>
                {t("You are about to delete")} <span className="font-bold text-gray-800">"{selectedCategory.name}"</span>.
                {t("This action is")} <span className="text-red-600 font-semibold">{t("permanent")}</span> {t("and cannot be undone.")}
              </span>
            }
          >
            <AlertItemPreview
              title={selectedCategory.name || "Untitled"}
              subtitle={`ID: ${selectedCategory.id}`}
              image={selectedCategory.image || ""}
            />
          </ActionAlert>
        </Modal>
      )}

      {/* --- Switch Visibility Modal --- */}
      {showSwitchModal && selectedCategory && (
        <Modal onClose={() => setShowSwitchModal(false)}>
          <ActionAlert
            isOpen={showSwitchModal}
            onClose={() => setShowSwitchModal(false)}
            onConfirm={handleSwitchCategory}
            isLoading={isPending}
            title={selectedCategory.show ? t("Hide Category?") : t("Show Category?")}
            variant={selectedCategory.show ? "warning" : "success"}
            confirmText={selectedCategory.show ? t("Yes, Hide") : t("Yes, Show")}
            description={
              <span>
                {t("You are about to make")} <span className="font-bold text-gray-800">"{selectedCategory.name}"</span>{" "}
                {selectedCategory.show ? t("hidden from") : t("visible on")} {t("your store.")}
              </span>
            }
          >
            <AlertItemPreview
              title={selectedCategory.name || "Untitled"}
              subtitle={`Current Status: ${selectedCategory.show ? t("Visible") : t("Hidden")}`}
              image={selectedCategory.image || ""}
            />
          </ActionAlert>
        </Modal>
      )}
    </>
  );
};

export default CategoriesGrid;