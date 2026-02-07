import type { product } from '@/types';
import {   Image as ImageIcon } from 'lucide-react';
import AdminProductCard from './AdminProductCard';
import { useTranslation } from 'react-i18next';

interface ProductGridProps {
   products: product[],
   domain : string,
   id: string
}

const ProductGrid = ({products, domain, id}: ProductGridProps ) => {

    const { t } = useTranslation("product");
  

  

  return (
    <div className="w-full">
        {/* عنوان القسم (اختياري) */}
        <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-bold text-slate-800">
                {t("products")} <span className="text-purple-600">{domain}</span>
            </h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                العدد: {products.length}
            </span>
        </div>

        {/* الشبكة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((item, index) => (
                <AdminProductCard 
                domain={domain}
                storeId={id}
                    key={index} 
                    product={item} 
                     
                />
            ))}
        </div>

        {/* حالة عدم وجود منتجات */}
        {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <ImageIcon className="text-slate-300" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-700">{t("no products")}</h3>
                <p className="text-slate-500 text-sm">{t("add products")}</p>
            </div>
        )}
    </div>
  )
}

export default ProductGrid;