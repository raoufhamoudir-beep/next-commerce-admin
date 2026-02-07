import { useState } from "react";
import type { product } from "@/types";
import { Edit, Eye, EyeOff, ImageIcon, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Madel"; // Note: You might want to rename file to 'Modal' later
import { ActionAlert, AlertItemPreview } from "@/components/ui/ActionAlert";
import { useDeleteProduct, useUpdateProduct } from "@/features/AddProduct/hooks/useProductManagement";
import { useTranslation } from "react-i18next";

interface AdminProductCardProps {
  product: product;
  domain: string;
   storeId: string; // Renamed from 'id' for clarity
}

const formatPrice = (price: number | string) => {
  if (typeof price === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  }
  return price;
};
 
const AdminProductCard = ({ product,   storeId, domain }: AdminProductCardProps) => {
  // --- State ---
      const { t } = useTranslation("product");
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  // --- Hooks ---
  const { isPending: isDeleting, mutate: deleteProduct } = useDeleteProduct(storeId);
  const { isPending: isUpdating, mutate: updateProduct } = useUpdateProduct(storeId);

  // --- Handlers ---
  const handleDelete = () => {
    deleteProduct(product._id || "", {
      onSuccess: () => setShowDeleteModal(false),
    });
  };

  const handleSwitchVisibility = () => {
    updateProduct(
      {
        id: product._id || "",
        data: { ...product, show: !product.show, subdomain: domain  },
      },
      {
        onSuccess: () => setShowSwitchModal(false),
      }
    );
  };

  // --- UI Variables ---
  const mainImage = product.images?.[0] || null;
  const isVisible = product.show;

  // Display Limits
  const MAX_VISIBLE_COLORS = 5;
  const MAX_VISIBLE_SIZES = 4;
  const extraColors = (product.colorOpions?.length || 0) - MAX_VISIBLE_COLORS;
  const extraSizes = (product.sizeOpions?.length || 0) - MAX_VISIBLE_SIZES;

  return (
    <>
      <div
        className={`group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl border transition-all duration-300 overflow-hidden ${
          isVisible
            ? "border-slate-100 hover:border-purple-200"
            : "border-slate-200 bg-slate-50 opacity-80"
        }`}
      >
        {/* --- Image Section --- */}
        <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                !isVisible && "grayscale"
              }`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300 flex-col gap-2">
              <ImageIcon size={32} />
              <span className="text-xs">{t("No Image")}</span>
            </div>
          )}

          {/* Floating Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md shadow-sm flex items-center gap-1.5 ${
                isVisible
                  ? "bg-teal-500/90 text-white"
                  : "bg-slate-500/90 text-white"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isVisible ? "bg-white animate-pulse" : "bg-slate-300"
                }`}
              />
              {isVisible ? "Active" : "Hidden"}
            </span>

            {product.type && (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 text-purple-700 backdrop-blur-md shadow-sm border border-white/50">
                {product.type}
              </span>
            )}
          </div>

          {/* Quick Edit Button */}
          <button
            // onClick={() => onEdit(product)}
            className="absolute top-3 right-3 p-2.5 bg-white text-slate-700 rounded-full hover:bg-purple-600 hover:text-white shadow-lg transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            title="Edit Product"
          >
            <Edit size={16} />
          </button>

          {/* Price Overlay */}
          <div className="absolute bottom-3 right-3">
            <span className="bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="p-4 flex flex-col gap-4 flex-grow">
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 truncate group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 h-8 leading-relaxed">
              {product.subTitel || product.ShortDescription || t("No description provided.")}
            </p>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Variants Row */}
          <div className="space-y-3">
            {/* Colors */}
            {product.colorOpions && product.colorOpions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-10">
                  {t("Colors")}
                </span>
                <div className="flex items-center -space-x-1.5">
                  {product.colorOpions.slice(0, MAX_VISIBLE_COLORS).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-5 h-5 rounded-full border border-white shadow-sm ring-1 ring-slate-100 relative group/color"
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                  {extraColors > 0 && (
                    <span className="w-5 h-5 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[9px] font-bold text-slate-500">
                      +{extraColors}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizeOpions && product.sizeOpions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-10">
                  {t("Sizes")}
                </span>
                <div className="flex flex-wrap gap-1">
                  {product.sizeOpions.slice(0, MAX_VISIBLE_SIZES).map((size, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {size}
                    </span>
                  ))}
                  {extraSizes > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-400 border border-slate-100">
                      +{extraSizes}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Footer Actions --- */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setShowSwitchModal(true)}
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
              isVisible
                ? "text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100"
                : "text-slate-600 bg-white hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{isVisible ? t("Visible") : t("Hidden")}</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* --- Modals --- */}
      
      {/* 1. Delete Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <ActionAlert
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            title={t("Delete Product?")}
            variant="danger"
            confirmText={t("Yes, Delete")}
            description={
              <span>
                {t("You are about to delete")} <span className="font-bold text-gray-800">"{product.name}"</span>.
                {t("This action is")} <span className="text-red-600 font-semibold">{t("permanent")}</span>.
              </span>
            }
          >
            <AlertItemPreview
              title={product.name}
              subtitle={`ID: ${product._id}`}
              image={mainImage || ""}
            />
          </ActionAlert>
        </Modal>
      )}

      {/* 2. Switch Visibility Modal */}
      {showSwitchModal && (
        <Modal onClose={() => setShowSwitchModal(false)}>
          <ActionAlert
            isOpen={showSwitchModal}
            onClose={() => setShowSwitchModal(false)}
            onConfirm={handleSwitchVisibility}
            isLoading={isUpdating}
            title={isVisible ? t("Hide Product?") : t("Show Product?")}
            variant={isVisible ? "warning" : "success"}
            confirmText={isVisible ? t("Yes, Hide") : t("Yes, Show")}
            description={
              <span>
                {isVisible 
                  ? t("This product will be hidden from the store. Customers won't be able to see it.") 
                  : t("This product will be visible in the store immediately.")}
              </span>
            }
          >
            <AlertItemPreview
              title={product.name}
              subtitle={isVisible ? t("Current: Visible") : t("Current: Hidden")}
              image={mainImage || ""}
            />
          </ActionAlert>
        </Modal>
      )}
    </>
  );
};

export default AdminProductCard;