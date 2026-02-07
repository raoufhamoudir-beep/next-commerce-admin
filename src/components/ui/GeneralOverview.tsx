import type { product, Categories } from '@/types'
import { useTranslation } from 'react-i18next';
 
interface GeneralOverview {
   stats: product[] | Categories [],
   type: "product" | "Categories" 
 }

 const SummaryCard = ({ label, value, bg }:any) => (
    <div
        className={`flex flex-col items-center justify-center rounded-2xl shadow-sm border border-gray-200 px-6 py-4 ${bg}`}
    >
        <span className="text-gray-700 text-sm">{label}</span>
        <span className="text-2xl font-bold mt-1">{value}</span>
    </div>
);


const GeneralOverview = ({stats, type   }: GeneralOverview  ) => {
  const { t } = useTranslation("Categories");

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <SummaryCard
                    label={type == "product"?   t("Totalproducts"): t("TotalCategories")}
                    value={stats.length}
                    bg="bg-blue-100"
                />
                <SummaryCard
                label={type == "product"?   t("productsvisible"): t("Categoriesvisible")}
                    
                    value={stats.filter(e => e.show).length}
                    bg="bg-green-100"
                />
                <SummaryCard
                                label={type == "product"?   t("productshidden"): t("Categorieshidden")}
                    value={stats.filter(e => !e.show).length}
                    bg="bg-yellow-100"
                />

            </div>
        </div>
    );
};

export default GeneralOverview