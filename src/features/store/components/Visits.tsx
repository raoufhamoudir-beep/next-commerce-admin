import { motion } from 'framer-motion';
import BoxCard from '@/components/ui/BoxCard';
import { useTranslation } from 'react-i18next';
import { BarChart3, ShoppingBag, Trophy, Award, Medal, ImageOff } from 'lucide-react';

interface VisitItem {
  page: string;
  count: number;
  name?: string;
  image?: string;
}

interface VisitsProps {
  visit: VisitItem[];
}

const Visits = ({ visit = [] }: VisitsProps) => {
  const { t } = useTranslation("store");

  // Separate general pages from products
  const generalPages = visit.filter(item => !item.image && !item.name);
  const productPages = visit.filter(item => item.image || item.name);

  const totalGeneral = generalPages.reduce((sum, item) => sum + item.count, 0);
  const totalProducts = productPages.reduce((sum, item) => sum + item.count, 0);

  const getShare = (count: number, total: number) => 
    total > 0 ? Math.round((count / total) * 100) : 0;

  const getPercent = (count: number, max: number) => 
    max > 0 ? Math.round((count / max) * 100) : 0;

  const maxProductVal = Math.max(...productPages.map(p => p.count), 1);

  // Medal colors for top 3
  const getMedalColor = (index: number) => {
    if (index === 0) return { bg: 'bg-yellow-500', icon: Trophy };
    if (index === 1) return { bg: 'bg-slate-400', icon: Award };
    if (index === 2) return { bg: 'bg-orange-500', icon: Medal };
    return { bg: 'bg-gray-300', icon: null };
  };

  return (
    <BoxCard about={t("TrafficAnalytics")}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ==========================
            LEFT: GENERAL PAGES
           ========================== */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-200/50">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{t("General Pages")}</h4>
                <p className="text-xs text-gray-500">
                  {totalGeneral} {t("total views")}
                </p>
              </div>
            </div>
          </div>

          {/* Pages List */}
          <div className="space-y-2">
            {generalPages.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 italic">{t("No data available")}</p>
              </div>
            ) : (
              generalPages.map((item, index) => (
                <motion.div
                  key={item.page}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="group relative"
                >
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-indigo-50/30 border border-indigo-100/50 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      {/* Rank Badge */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                          ${index < 3 
                            ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200/50" 
                            : "bg-white border-2 border-gray-200 text-gray-500"}
                        `}
                      >
                        {index + 1}
                      </motion.div>
                      
                      {/* Page Name */}
                      <span className="text-sm font-semibold text-gray-700 capitalize">
                        {item.page}
                      </span>
                    </div>

                    {/* Views & Percentage */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="block text-lg font-bold text-gray-800 leading-none">
                          {item.count}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {getShare(item.count, totalGeneral)}%
                        </span>
                      </div>
                      
                      {/* Mini Bar */}
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getShare(item.count, totalGeneral)}%` }}
                          transition={{ delay: index * 0.05 + 0.2, duration: 0.6 }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* ==========================
            RIGHT: TOP PRODUCTS
           ========================== */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200/50">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{t("Top Products")}</h4>
                <p className="text-xs text-gray-500">
                  {totalProducts} {t("product views")}
                </p>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-3">
            {productPages.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 italic">{t("No products visited")}</p>
              </div>
            ) : (
              productPages.map((item, index) => {
                const medal = getMedalColor(index);
                const MedalIcon = medal.icon;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group relative"
                  >
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white to-purple-50/30 border border-purple-100/50 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300">
                      
                      {/* Product Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-xl bg-gray-100 border-2 border-gray-200 overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ImageOff className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          
                          {/* Medal Badge for Top 3 */}
                          {index < 3 && MedalIcon && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.05 + 0.3, type: "spring" }}
                              className={`absolute -top-2 -left-2 w-6 h-6 rounded-full ${medal.bg} flex items-center justify-center border-2 border-white shadow-lg`}
                            >
                              <MedalIcon className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <span
                            className="block text-sm font-semibold text-gray-800 truncate"
                            title={item.name}
                          >
                            {item.name}
                          </span>
                          
                          {/* Progress Bar */}
                          <div className="mt-2 w-full max-w-[200px] h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${getPercent(item.count, maxProductVal)}%` }}
                              transition={{ delay: index * 0.05 + 0.2, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Views Count */}
                      <div className="text-right ml-4">
                        <span className="block text-xl font-bold text-gray-800 leading-none">
                          {item.count}
                        </span>
                        <span className="text-[10px] uppercase font-medium text-gray-400">
                          {t("views")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </BoxCard>
  );
};

export default Visits;