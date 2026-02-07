import type { Categories } from '@/types';
import { Edit, Eye, EyeOff, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface CategoriesCardProps {
  Categories: Categories;
  storeId: string;
  // Made required since parent provides it
  handleSelectCategory: (category: Categories, type: "delete" | "switch") => void;
}

const CategoriesCard = ({ Categories, storeId, handleSelectCategory }: CategoriesCardProps) => {
  const isVisible = Categories.show;
  const { t } = useTranslation("Categories");

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl border transition-all duration-300 overflow-hidden ${
        isVisible
          ? "border-slate-100 hover:border-purple-200"
          : "border-slate-200 bg-slate-50 opacity-80"
      }`}
    >
      {/* --- Image Section --- */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {Categories.image ? (
          <img
            src={Categories.image}
            alt={Categories.name}
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

        {/* Floating Status Badge */}
        <div className="absolute top-3 left-3">
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
            {isVisible ? t("Active") : t("Hidden")}
          </span>
        </div>

        {/* Floating Edit Button */}
        <Link
           to={`/store/${storeId}/categories/${Categories.id}`}
           className="absolute top-3 right-3 p-2.5 bg-white text-slate-700 rounded-full hover:bg-purple-600 hover:text-white shadow-lg transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
           title="Edit Category"
        >
          <Edit size={16} />
        </Link>
      </div>

      {/* --- Content Section --- */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <div>
          <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 truncate group-hover:text-purple-600 transition-colors">
            {Categories.name}
          </h3>
          <p className="text-xs text-slate-500">
             {t("Category ID:")} <span className="font-mono text-[10px]">{Categories.id ? Categories.id.slice(0, 8) : 'N/A'}...</span>
          </p>
        </div>
      </div>

      {/* --- Footer Actions --- */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        {/* Visibility Toggle */}
        <button
          onClick={() => handleSelectCategory(Categories, "switch")}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
            isVisible
              ? "text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100"
              : "text-slate-600 bg-white hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
          <span>{isVisible ? t("Visible") : t("Hidden")}</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={() => handleSelectCategory(Categories, "delete")}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Category"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CategoriesCard;