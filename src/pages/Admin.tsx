import { useUser } from '@/features/auth/hooks/useUser';
import type { UserStore } from '@/types';
import { Plus, Store, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import PageContainer from '@/components/ui/PageContainer';
import StoreCard from '@/features/admin/components/StoreCard';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Admin = () => {
  const { data } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation("account");

  const userStores: UserStore[] = data?.Stores || [];

  const NewStore = () => {
    const storeCount = data?.Stores?.length ?? 0;

    if (storeCount < 2) {
      navigate('/store/new');
      return;
    }

    if (!data?.isPaid && storeCount > 1) {
      toast.error(t("you hit the max stores in free trail"));
    }
  };

  // Stats for dashboard header
  const stats = [
    {
      icon: Store,
      label: t("Total Stores") || "Total Stores",
      value: userStores.length,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: TrendingUp,
      label: t("Active Stores") || "Active",
      value: userStores.length,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Zap,
      label: t("Quick Actions") || "Quick",
      value: "New",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <PageContainer
      title={t(`Dashboard`)}
      about={t(`Manage your stores or launch a new venture.`)}
    >
      <Toaster />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100/50 hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stores Grid */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
            <h2 className="text-xl font-bold text-gray-800">
              {t("Your Stores") || "Your Stores"}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Store Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -8 }}
            onClick={NewStore}
            className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-purple-300 hover:border-indigo-400 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 hover:from-purple-100/50 hover:to-indigo-100/50 transition-all duration-300 cursor-pointer min-h-[280px] overflow-hidden"
          >
            {/* Animated Background Gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5"
            />

            {/* Floating Circles Animation */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400 rounded-full blur-2xl"
            />

            {/* Content */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative z-10 w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-purple-200/50 group-hover:shadow-indigo-200/50"
            >
              <Plus className="w-10 h-10 text-purple-600 group-hover:text-indigo-600 transition-colors" />
            </motion.div>

            <h3 className="relative z-10 text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
              {t("Add New Store")}
            </h3>
            <p className="relative z-10 text-sm text-gray-500 mt-2 text-center max-w-[180px] group-hover:text-gray-600 transition-colors">
              {t("Create a new brand and start selling today.")}
            </p>

            {/* Sparkle Effect on Hover */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              whileHover={{ scale: 1, rotate: 180 }}
              className="absolute top-4 right-4 text-purple-400 group-hover:text-indigo-400"
            >
              <Zap className="w-6 h-6" fill="currentColor" />
            </motion.div>
          </motion.div>

          {/* Existing Stores */}
          {userStores.map((store, idx) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
            >
              <StoreCard store={store} />
            </motion.div>
          ))}

          {/* Empty State */}
          {userStores.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="col-span-full flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-6">
                <Store className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {t("No stores yet") || "No stores yet"}
              </h3>
              <p className="text-gray-600 max-w-md mb-6">
                {t("Create your first store to start your e-commerce journey") ||
                  "Create your first store to start your e-commerce journey"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={NewStore}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-300/50 hover:shadow-xl hover:shadow-purple-400/50 transition-all duration-300"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                {t("Create First Store") || "Create First Store"}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Admin;